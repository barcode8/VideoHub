import mongoose from "mongoose"
import { isValidObjectId } from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    
    const pageNumber = parseInt(page, 10)
    const limitNumber = parseInt(limit, 10)

    //Building the match conditions object
    const matchConditions = {
        isPublished : true //We only want to show published videos
    }

    //If a query exists, we search for it using regex DB operator
    if(query){
        matchConditions.$or = [
            {title : {$regex: query, $options: "i"}},
            {description : {$regex : query, $options: "i"}}
        ];
    }

    //If a userid is provided, display videos belonging only to that user
    if(userId){
        if(!isValidObjectId(userId)){
            throw new ApiError(400, "Invalid User")
        }

        //Convert string ID into an object ID
        matchConditions.owner = new mongoose.Types.ObjectId(userId);
    }

    //Building the sort object
    const sortOptions = {}
    if(sortBy){
        //sortType is usually asc or desc, 1 stands for asc and -1 for desc
        sortOptions[sortBy] = sortType === "asc" ? 1 : -1
    }else{
        //Default fallback, sort by newest uploaded videos
        sortOptions["createdAt"] = -1;
    }

    //Making the aggregation pipeline
    const pipeline = [
        {
            $match : matchConditions
        },
        {
            $sort : sortOptions
        },
        {
            $lookup: {
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "ownerDetails",
                pipeline : [
                    {
                        $project : {
                            username : 1,
                            avatar : 1
                        }
                    }
                ]
            }
        },
        {
            $addFields : {
                ownerDetails : {$first : "$ownerDetails"}
            }
        }
    ];

    //Execute Pagenation
    const aggregate = Video.aggregate(pipeline);

    const options = {
        page : pageNumber,
        limit : limitNumber,
    }

    const result = await Video.aggregatePaginate(aggregate, options)

    //Send final response
    return res
    .status(200)
    .json(new ApiResponse(200, result, "Videos fetched successfully"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    
    //Validating text fields
    if(!title || !title.trim()){
        throw new ApiError (400, "Title is required")
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!videoLocalPath) {
        throw new ApiError(400, "Video files are required")
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail files are required")
    }
    // 1. Create a "processing" placeholder in the database
    const video = await Video.create({
        title,
        description,
        videoFile: "processing", // Placeholder
        thumbnail: "processing", // Placeholder
        duration: 0,
        isPublished: false, // Keep it hidden until processing finishes
        owner: req.user._id 
    })

    processVideoBackground(video._id, videoLocalPath, thumbnailLocalPath).catch(console.error)

    //Sending this response so that the request stops processing
    return res.status(200).json(
        new ApiResponse(200, video, "Video is uploading and processing in the background")
    )
})

async function processVideoBackground(videoId, videoLocalPath, thumbnailLocalPath){
    try {
        const videoUpload = await uploadOnCloudinary(videoLocalPath, true)

        if (!videoUpload) {
            await Video.findByIdAndDelete(videoId);
            return;
        }

        // 1 hour = 3600 seconds. Check Cloudinary's calculated duration.
        if(videoUpload.duration > 3600){
            // A. Delete the oversized file from Cloudinary 
            await cloudinary.uploader.destroy(videoUpload.public_id, { resource_type: "video" });

            // B. Delete the database placeholder
            await Video.findByIdAndDelete(videoId);

            // C. Delete the local thumbnail (since uploadOnCloudinary didn't process it yet)
            if (fs.existsSync(thumbnailLocalPath)) {
                fs.unlinkSync(thumbnailLocalPath);
            }
            
            console.error(`Video ${videoId} rejected: Exceeded 1 hour limit.`);
            return;
        }

        // Upload the thumbnail (passing false or nothing so it doesn't get video transformations)
        const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

        // Update the database with the final URLs and publish
        await Video.findByIdAndUpdate(videoId, {
            videoFile: videoUpload.url,
            thumbnail: thumbnailUpload?.url || "",
            duration: videoUpload.duration,
            isPublished: true 
        });

    } catch (error) {
        console.error("Background processing failed for video:", videoId, error);
        // Clean up the placeholder if something crashes
        await Video.findByIdAndDelete(videoId);
    }
}

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    //Check if we recieved video id or not
    if(!videoId){
        throw new ApiError(400, "VideoId not received")
    }

    //Check if recieved videoId is valid or not
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID format")
    }

    //Find record in Mongo through videoId
    const response = await Video.findById(videoId)

    if(!response){
        throw new ApiError(404, "Video could not be fetched")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, response, "Video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {title, description} = req.body

    //Recieve thumbnail local path
    const thumbnailLocalPath = req.file?.path

    //Check if we recieved video id or not
    if(!videoId){
        throw new ApiError(400, "VideoId not received")
    }

    //Check if recieved videoId is valid or not
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID format")
    }

    const existingVideo = await Video.findById(videoId);

    if (!existingVideo) {
        throw new ApiError(404, "Video not found");
    }

    // Create an empty object to store only the fields the user actually provided
    const updateFields = {}

    if (title && title.trim() !== "") {
        updateFields.title = title;
    }

    if (description && description.trim() !== "") {
        updateFields.description = description;
    }

    //Only process the thumbnail if a new one was actually uploaded
    if(thumbnailLocalPath){
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

        if(!thumbnail.url){
            throw new ApiError(500, "Error while uploading the thumbnail")
        }
        
        updateFields.thumbnail = thumbnail.url;

        //Deleting existing thumbnail from cloudinary
        if(existingVideo.thumbnail){
            try {
                // Extract public ID from the old URL
                const parts = existingVideo.thumbnail.split("/");
                const fileWithExtension = parts[parts.length - 1];
                const publicId = fileWithExtension.split(".")[0];

                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.error("Failed to delete old thumbnail from Cloudinary:", error);
            }
        }
    }

    // Prevent unnecessary database calls if no fields were provided at all
    if (Object.keys(updateFields).length === 0) {
        throw new ApiError(400, "Please provide at least one field (title, description, or thumbnail) to update")
    }

    //Find video record then update the thumbnail field with the new url
    const video=await Video.findByIdAndUpdate(
        videoId,
        {
            $set: updateFields
        },
        {new:true}
    )

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, video, "Video details changed successfully")
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    //Check if we recieved video id or not
    if(!videoId){
        throw new ApiError(400, "VideoId not received")
    }

    //Check if recieved videoId is valid or not
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID format")
    }

    //Find record in Mongo through videoId
    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError("Video not found")
    }

    //We need to extract the public url of video and thumbnail to delete them from cloudinary
    const extractPublicId = (url) => {
        if (!url) return null;
        const parts = url.split("/");
        const fileWithExtension = parts[parts.length - 1];
        return fileWithExtension.split(".")[0];
    };

    const videoPublicId = extractPublicId(video.videoFile);
    const thumbnailPublicId = extractPublicId(video.thumbnail);

    try {
        if (videoPublicId) {
            // Video files require the resource_type to be explicitly set to "video"
            await cloudinary.uploader.destroy(videoPublicId, { resource_type: "video" });
        }
        
        if (thumbnailPublicId) {
            // Images are the default resource_type, so no extra options are needed
            await cloudinary.uploader.destroy(thumbnailPublicId);
        }
    } catch (error) {
        console.error("Failed to delete files from Cloudinary:", error);
        throw new ApiError(500, "Failed to delete associated files from cloud storage");
    }

    const response = await Video.findByIdAndDelete(videoId)

    if(!response){
        throw new ApiError(404, "Video could not be fetched")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, response, "Video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    //Check if we recieved video id or not
    if(!videoId){
        throw new ApiError(400, "VideoId not received")
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    //Check if recieved videoId is valid or not
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID format")
    }

    // Security check: Ensure only the person who uploaded the video can hide/unhide it
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You do not have permission to toggle this video's status");
    }

    // Flip the current boolean value
    video.isPublished = !video.isPublished;
    
    // Save the updated document
    await video.save({ validateBeforeSave: false });

    return res
    .status(200)
    .json(new ApiResponse(200, {isPublished : video.isPublished}, `Video is now ${video.isPublished ? "Published" : "Hidden"}`))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
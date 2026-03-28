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
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    
    //Validating text fields
    if(!title || !title.trim()){
        throw new ApiError (400, "Title is required")
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!videoLocalPath || !thumbnailLocalPath) {
        throw new ApiError(400, "Video and thumbnail files are required")
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

    const videoUpload = await uploadOnCloudinary(videoLocalPath)
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath)

    processVideoBackground(video._id, videoLocalPath, thumbnailLocalPath).catch(console.error)
})

async function processVideoBackground(videoId, videoLocalPath, thumbnailLocalPath){
    try {
        const videoUpload = uploadOnCloudinary(videoLocalPath, true)

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
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
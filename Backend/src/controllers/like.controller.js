import mongoose, {isValidObjectId} from "mongoose"
import { Like } from "../models/like.models.js"
import ApiError from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    
    //Check if we recieved video id or not
    if(!videoId){
        throw new ApiError(400, "Video Id not received")
    }

    //Check if recieved videoId is valid or not
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID format")
    }

    //Find if the user has already liked the video before
    const existingLike = await Like.findOne({
        video: videoId,
        likedBy : req.user._id
    })

    //If yes, we reverse their like i.e. destroy their record from the database
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)

        return res
        .status(200)
        .json(new ApiResponse(200, {isLiked : false}, "Video unliked successfully" ))

    } else{
        //Else, we just create a new record for the like
        const newLike = await Like.create({
            video: videoId,
            likedBy: req.user._id
        })

        return res
        .status(200)
        .json(new ApiResponse(200, {isLiked : true}, "Video liked successfully"))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    
    //Check if we recieved comment id or not
    if(!commentId){
        throw new ApiError(400, "Comment Id not received")
    }

    //Check if recieved commentId is valid or not
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid Comment ID format")
    }

    //Find if user has already liked the comment before
    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy : req.user._id
    })

    //If yes, we reverse their like i.e. destroy their record from the database
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)

        return res
        .status(200)
        .json(new ApiResponse(200, {isLiked : false}, "Comment unliked successfully" ))

    } else{
        //Else, we just create a new record for the like
        const newLike = await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })

        return res
        .status(200)
        .json(new ApiResponse(200, {isLiked : true}, "Comment liked successfully"))
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    
    //Check if we recieved tweet id or not
    if(!tweetId){
        throw new ApiError(400, "Tweet Id not received")
    }

    //Check if recieved tweetId is valid or not
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid Tweet ID format")
    }

    //Find if user has already liked the tweet before
    const existingLike = await Like.findOne({
        community: tweetId,
        likedBy : req.user._id
    })

    //If yes, we reverse their like i.e. destroy their record from the database
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)

        return res
        .status(200)
        .json(new ApiResponse(200, {isLiked : false}, "Tweet unliked successfully" ))

    } else{
        //Else, we just create a new record for the like
        const newLike = await Like.create({
            community: tweetId,
            likedBy: req.user._id
        })

        return res
        .status(200)
        .json(new ApiResponse(200, {isLiked : true}, "Tweet liked successfully"))
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.aggregate([
        {
            $match :{
                //Finding all likes for this specific user
                likedBy: new mongoose.Types.ObjectId(req.user._id),
                //Only grab documents where the video field exists
                video: { $exists: true, $ne: null }
            }
        },
        {
            //Look up the actual video details from the videos collection
            $lookup:{
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails",
                //Nested lookup to fetch channel details as well
                pipeline:[
                    {
                        $lookup: {
                            from : "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails",
                            pipeline:[
                                {
                                    $project:{
                                        fullName : 1,
                                        username : 1,
                                        avatar : 1
                                    }
                                }
                            ]
                        }
                    },
                    //The nested lookup returns a nested array which we unwind
                    {
                        $unwind: "$ownerDetails"
                    }
                ]
            }
        },
        //The outer lookup also returns a nested array, we unwind this too
        {
            $unwind : "$videoDetails"
        },
        //Showing most recently liked videos first
        {
            $sort : {createdAt: -1}
        },
        //Filtering out and returning only relevant data from the pipeline
        {
            $project:{
                _id : "$videoDetails._id",
                title : "$videoDetails.title",
                thumbnail : "$videoDetails.thumbnail",
                description : "$videoDetails.duration",
                views: "$videoDetails.views",
                owner: "$videoDetails.ownerDetails",
                likedAt : "$createdAt"
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "Liked Videos fetched successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
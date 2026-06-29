import mongoose from "mongoose"
import { isValidObjectId } from "mongoose"
import {asyncHandler} from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Like } from "../models/like.models.js"
import { Subscription } from "../models/subscription.models.js"
import {Video} from "../models/video.models.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {channelId} = req.params

    if(!channelId){
        throw new ApiError(400, "Channel ID not recieved")
    }

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel ID")
    }

    const totalSubscribers = await Subscription.countDocuments({ 
        channel: new mongoose.Types.ObjectId(channelId) 
    });

    const videoStats = await Video.aggregate([
        {
            $match:{
                owner : new mongoose.Types.ObjectId(channelId),
                isPublished : true
            }
        },
        {
            $lookup:{
                from : "likes",
                localField : "_id",
                foreignField : "video",
                as : "likes"
            }
        },
        {
            $project:{
                views : 1,
                likesCount : {$size : "$likes"}
            }
        },
        {
            $group: {
                _id: null, 
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" },
                totalLikes: { $sum: "$likesCount" }
            }
        }
    ])

    // Format the final response object, handling empty states if the user has no videos
    const stats = {
        totalSubscribers: totalSubscribers || 0,
        totalVideos: videoStats.length > 0 ? videoStats[0].totalVideos : 0,
        totalViews: videoStats.length > 0 ? videoStats[0].totalViews : 0,
        totalLikes: videoStats.length > 0 ? videoStats[0].totalLikes : 0,
    };

    return res
    .status(200)
    .json(new ApiResponse(200, stats, "Channel stats fetched successfully"))
})


export {
    getChannelStats
    }
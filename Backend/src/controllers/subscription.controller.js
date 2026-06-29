import mongoose, {isValidObjectId} from "mongoose"
import { User } from "../models/user.models.js"
import { Subscription } from "../models/subscription.models.js"
import ApiError from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    
    //Check whether we recieved channel id 
    if(!channelId){
        throw new ApiError(400, "Channel ID not recieved")
    }

    //Check whether channel ID is a valid object id 
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid Channel ID")
    }

    const userId = req.user._id

    if(userId.toString() === channelId.toString()){
        throw new ApiError(400, "User cannot subscribe to their own channel")
    }

    //Find if the user has already subscribed to the channel before, if yes we delete their record from the database
    const existingSubscriber = await Subscription.findOneAndDelete({
        subscriber: userId,
        channel: channelId
    })

    if(existingSubscriber){
        return res
        .status(200)
        .json(new ApiResponse(200, {isSubscribed : false}, "Unsubscribed successfully"))
    } else {
        //Else, we just create a new entry
        const newSubscriber = await Subscription.create({
            subscriber: userId,
            channel: channelId
        })

        return res
        .status(200)
        .json(new ApiResponse(200, {isSubscribed : true}, "Subscribed successfully"))
    }
})

// Controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    //Check whether we recieved channel id 
    if(!channelId){
        throw new ApiError(400, "Channel ID not recieved")
    }

    //Check whether channel ID is a valid object id 
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid Channel ID")
    }

    const subscriberList = await Subscription.aggregate([
        {
            $match : {
                channel : new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup : {
                from : "users",
                foreignField : "_id",
                localField : "subscriber",
                as : "subscriberDetails",
                pipeline : [
                    {
                        $project:{
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                subscriberDetails : { $first: "$subscriberDetails" }
            }
        },
        {
            $sort : {createdAt: -1}
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, subscriberList, "Subscriber list fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const  subscriberId  = req.user._id

    //Check whether we recieved subscriber id 
    if(!subscriberId){
        throw new ApiError(400, "Subscriber ID not recieved")
    }

    //Check whether subscriber ID is a valid object id 
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400, "Invalid Subscriber ID")
    }

    const channelList = await Subscription.aggregate([
        {
            $match : {
                subscriber : new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup : {
                from : "users",
                foreignField : "_id",
                localField : "channel",
                as : "channelDetails",
                pipeline : [
                    {
                        $project:{
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                channelDetails : { $first: "$channelDetails" }
            }
        },
        {
            $sort : {createdAt: -1}
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, channelList, "Channel list fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
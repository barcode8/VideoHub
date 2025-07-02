import {asyncHandler} from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req,res)=>{
    //get user details from frontend
    //validate user inputs
    //check if user already exists
    //check for images
    //check for avatar
    //upload images to cloudinary,check if avatar got uploaded to cloudinary or not
    //create user object
    //remove password and refresh token field from response

    //step 1
    const {username, email, fullName, password}=req.body
    
    if(
        [username, email, fullName, password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existingUser=await User.findOne({
        $or: [{username} , {email}]
    })

    if(existingUser){
        throw new ApiError(409,"User with email or username already exists")
    }

    const avatarLocalPath=req.files?.avatar[0]?.path

    let coverImageLocalPath;
    if(req.files.coverImage?.[0]){
        coverImageLocalPath= req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is compulsory")
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar is compulsory")
    }

    const user=await User.create({
        username: username.toLowerCase(),
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
    })

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered sucessfully")
    )
})

export {registerUser}
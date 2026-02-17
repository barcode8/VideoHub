import { User } from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJwt= asyncHandler(async (req, res, next)=>{
    try {
        //Checks for access token
        const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
    
        //Here we decode the access token we checked for
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        //By decoding the token we got access to all its fields, with that we can check for a user by searching for an id and we want the record to not contain the password nor the refreshtoken
        const user= await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        )
    
        if(!user){
            throw new ApiError(401,"Invalid access token")
        }
    
        //This step is extremely crucial as here we create it so that when we call req.user we got user info which is then used in the get-user api
        req.user=user;
        next()
    } catch (error) {
        throw new ApiError(401, "Invalid access token")
    }
})
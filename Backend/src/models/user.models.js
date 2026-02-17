import mongoose from "mongoose";
import { Schema } from "mongoose";
import { Model } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
    },
    fullName:{
        type: String,
        required: false,
        trim: true,
        index: true
    },
    avatar:{
        type: String, //cloudinary url
    },
    coverImage:{
        type: String, //cloudinary url
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:{
        type: String,
        required: true,
    },
    refreshToken:{
        type: String
    }
},{timestamps: true})

//Here we use model life cycle middleware (we dont need to call them in routes) so that before a password for a user is saved we hash it using bcrypt
userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password= await bcrypt.hash(this.password,10)
        next();
    }
})

//Checks if entered password is correct or not during login, we have to use this since our passwords are stored in a hash value inside our records
userSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password,this.password)
}

//Generating access token which will have the values id, email, username and fullname
userSchema.methods.generateAccessToken= function(){
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}

//Generating refresh token which will only store _id
userSchema.methods.generateRefreshToken= function(){
    return jwt.sign({
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

export const User= mongoose.model("User",userSchema)
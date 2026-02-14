import { v2 as cloudinary} from "cloudinary";
import fs from 'fs'
import dotenv from "dotenv";
dotenv.config();

//Purely boilerplate cloudinary config file needed to allow cloudinary to work

cloudinary.config({
    //This basically signs us in from this server to cloudinary so we can use it
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
})


const uploadOnCloudinary = async function(localFilePath){
    try {
        if(!localFilePath) return null

        //This line allows us to upload server content to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            //This allows any type of file to be uploaded
            resource_type: "auto"
        })

        //This deletes the file stored in the public folder after uploading
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}

export {uploadOnCloudinary}
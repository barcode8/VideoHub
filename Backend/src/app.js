import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";

// Central Express app configuration:
// - middleware stack
// - global parsers
// - route mounting

const app = express()

//Setting up CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//Allows app to accept JSON data and sets payload size limit
app.use(express.json({
    limit: "16kb"
}))

//Allows the server to recieve urlencoded data
app.use(express.urlencoded({
    extended: true
}))

//Allows the public folder to be accessed from the url
app.use(express.static("public"))

//Allows app to make use of req.cookies
app.use(cookieParser())

//Routes

//Importing and using user related apis
import userRouter from "./routes/user.routes.js"
app.use("/api/v1/users",userRouter)

export {app};
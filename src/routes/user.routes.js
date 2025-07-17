import { Router } from "express";
import { changeCurrentPassword, changeUserAvatar, changeUserCoverImage, changeUserDetails, getCurrentUser, getUserProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router= Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

router.route('/login').post(
    loginUser
)

router.route("/logout").post(verifyJwt, logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJwt, changeCurrentPassword)

router.route("/current-user").get(verifyJwt, getCurrentUser)

router.route("/change-details").patch(verifyJwt, changeUserDetails)

router.route("/change-details").patch(verifyJwt, upload.single("avatar"), changeUserAvatar)

router.route("/change-coverimage").patch(verifyJwt, upload.single("coverImage"), changeUserCoverImage)

router.route("/c/:username").get(verifyJwt, getUserProfile)

router.route("/watch-history").get(verifyJwt, getWatchHistory)

export default router
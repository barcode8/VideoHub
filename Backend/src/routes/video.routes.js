import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishVideoDraft,
    initVideoUpload,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js"
import { verifyJwt, verifyJWTIfAvailable } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"

const router = Router();

// Public routes (No verifyJwt here)
router.route("/").get(verifyJWTIfAvailable, getAllVideos);
router.route("/:videoId").get(getVideoById); 

// Protected routes (Add verifyJwt as a middleware argument)
router.route("/init").post(verifyJwt, initVideoUpload);

router
    .route("/:videoId")
    .post(
        verifyJwt,
        upload.fields([
            { name: "videoFile", maxCount: 1 },
            { name: "thumbnail", maxCount: 1 },
        ]),
        publishVideoDraft
    );

router
    .route("/:videoId")
    .delete(verifyJwt, deleteVideo)
    .patch(verifyJwt, upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(verifyJwt, togglePublishStatus);

export default router;
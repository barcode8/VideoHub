import { Router } from 'express';
import {
    getChannelStats,
} from "../controllers/dashboard.controller.js"
import {verifyJwt} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/stats/:channelId").get(getChannelStats);

export default router
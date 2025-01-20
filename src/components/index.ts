import { Router } from "express";
import ApiResponse from "../interfaces/ApiResponse";
import userRouter from "./user/user.route";
import authRouter from "./auth/auth.route";
import reviewerRouter from "./reviewer/reviewer.route";
import editorRouter from "./editor/editor.route";
import mailRouter from "./mail/mail.route";
import manuscriptRouter from "./manuscript/manuscript.route";
import ratingRouter from "./rating/rating.route";
import analyticsRouter from "./analytics/analytics.route";
import imagekitRouter from "./imagekit/imagekit.route";
const router = Router();

router.get<ApiResponse>("/", (req, res) => {
    res.json({
        message: "API - 👋🌎🌍🌏"
    });
});

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/editor", editorRouter);
router.use("/reviewer", reviewerRouter);
router.use("/mail", mailRouter);
router.use("/manuscript", manuscriptRouter);
router.use("/rating", ratingRouter);
router.use("/analytics", analyticsRouter);
router.use("/imagekit", imagekitRouter);

export default router;

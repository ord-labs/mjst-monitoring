import { Router } from "express";
import ApiResponse from "../interfaces/ApiResponse";
import userRouter from "./user/user.route";
import authRouter from "./auth/auth.route";
import reviewerRouter from "./reviewer/reviewer.route";

const router = Router();

router.get<ApiResponse>("/", (req, res) => {
    res.json({
        message: "API - 👋🌎🌍🌏"
    });
});

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/reviewer", reviewerRouter);

export default router;

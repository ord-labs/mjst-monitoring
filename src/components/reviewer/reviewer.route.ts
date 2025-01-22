import express from "express";
import {
    deleteReviewer,
    getReviewer,
    createReviewer,
    updateReviewer,
    loginReviewerByCredentials
} from "./reviewer.controller";
import { authenticated } from "../../config/passport.jwt.config";

const router = express.Router();

router.get("/", getReviewer);
router.post("/", createReviewer);
router.post("/login", loginReviewerByCredentials);
router.put("/:reviewerId", updateReviewer);
router.delete("/:reviewerId", deleteReviewer);

export default router;

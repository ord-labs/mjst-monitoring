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

router.get("/", authenticated, getReviewer);
router.post("/", authenticated, createReviewer);
router.post("/login", loginReviewerByCredentials);
router.put("/:reviewerId", authenticated, updateReviewer);
router.delete("/:reviewerId", authenticated, deleteReviewer);

export default router;

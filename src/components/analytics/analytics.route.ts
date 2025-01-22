import express from "express";
import { authenticated } from "../../config/passport.jwt.config";
import { getAnalytics } from "./analytics.controller";

const router = express.Router();

router.get("/", getAnalytics);

export default router;

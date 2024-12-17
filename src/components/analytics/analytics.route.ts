import express from "express";
import { authenticated } from "../../config/passport.jwt.config";
import { getAnalytics } from "./analytics.controller";

const router = express.Router();

router.get("/", authenticated, getAnalytics);

export default router;

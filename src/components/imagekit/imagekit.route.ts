import express from "express";
import { authenticateUpload } from "./imagekit.controller";
import { authenticated } from "../../config/passport.jwt.config";

const router = express.Router();

router.post("/authenticateUpload", authenticateUpload);

export default router;

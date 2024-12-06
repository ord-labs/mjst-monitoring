import express from "express";
import { authenticated } from "../../config/passport.jwt.config";
import { sendMail } from "./mail.controller";

const router = express.Router();

router.post("/", authenticated, sendMail);

export default router;

import express from "express";
import { deleteManuscript, getManuscript, createManuscript, updateManuscript } from "./manuscript.controller";
import { authenticated } from "../../config/passport.jwt.config";

const router = express.Router();

router.get("/", authenticated, getManuscript);
router.post("/", authenticated, createManuscript);
router.put("/:manuscriptId", authenticated, updateManuscript);
router.delete("/:manuscriptId", authenticated, deleteManuscript);

export default router;

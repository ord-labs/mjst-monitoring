import express from "express";
import {
    deleteManuscript,
    getManuscript,
    createManuscript,
    updateManuscript,
    getManuscriptByStepStatus,
    getManuscriptByReviewer,
    getManuscriptByEditor
} from "./manuscript.controller";
import { authenticated } from "../../config/passport.jwt.config";
import { authenticatedReviewer } from "../../config/passport.jwt.reviewer.config";
import { authenticatedEditor } from "../../config/passport.jwt.editor.config";

const router = express.Router();

router.get("/", authenticated, getManuscript);
router.get("/step", authenticated, getManuscriptByStepStatus);
router.post("/by-reviewer", authenticatedReviewer, getManuscriptByReviewer);
router.post("/by-editor", authenticatedEditor, getManuscriptByEditor);
router.get("/step", authenticated, getManuscriptByStepStatus);
router.post("/", authenticated, createManuscript);
router.put("/:manuscriptId", authenticated, updateManuscript);
router.delete("/:manuscriptId", authenticated, deleteManuscript);

export default router;

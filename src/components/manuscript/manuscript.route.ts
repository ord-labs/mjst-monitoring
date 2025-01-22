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

const router = express.Router();

router.get("/", getManuscript);
router.get("/step", getManuscriptByStepStatus);
router.post("/by-reviewer", getManuscriptByReviewer);
router.post("/by-editor", getManuscriptByEditor);
router.get("/step", getManuscriptByStepStatus);
router.post("/", createManuscript);
router.put("/:manuscriptId", updateManuscript);
router.delete("/:manuscriptId", deleteManuscript);

export default router;

import express from "express";
import { deleteEditor, getEditor, getEditors, createEditor, updateEditor } from "./editor.controller";
import { authenticated } from "../../config/passport.jwt.config";

const router = express.Router();

router.get("/", authenticated, getEditor);
router.post("/", authenticated, createEditor);
router.put("/:editorId", authenticated, updateEditor);
router.delete("/:editorId", authenticated, deleteEditor);

export default router;

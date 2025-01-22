import express from "express";
import { deleteEditor, getEditor, createEditor, updateEditor, loginEditorByCredentials } from "./editor.controller";
import { authenticated } from "../../config/passport.jwt.config";

const router = express.Router();

router.get("/", getEditor);
router.post("/", createEditor);
router.post("/login", loginEditorByCredentials);
router.put("/:editorId", updateEditor);
router.delete("/:editorId", deleteEditor);

export default router;

import express from "express";
import { deleteEditor, getEditor, createEditor, updateEditor, loginEditorByCredentials } from "./editor.controller";
import { authenticated } from "../../config/passport.jwt.config";

const router = express.Router();

router.get("/", authenticated, getEditor);
router.post("/", authenticated, createEditor);
router.post("/login", loginEditorByCredentials);
router.put("/:editorId", authenticated, updateEditor);
router.delete("/:editorId", authenticated, deleteEditor);

export default router;

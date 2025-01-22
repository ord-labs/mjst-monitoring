import express from "express";
import { deleteUser, getUser, getUserByToken, registerUser, updateUser } from "./user.controller";
import { authenticated } from "../../config/passport.jwt.config";

const router = express.Router();

router.get("/", getUser);
router.get("/byToken", getUserByToken);
router.post("/", registerUser);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

export default router;

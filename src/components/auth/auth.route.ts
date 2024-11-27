import express from "express";
import { loginUserByCredentials, registerUser } from "../user/user.controller";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUserByCredentials);

export default router;

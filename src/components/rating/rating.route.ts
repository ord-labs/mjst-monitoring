import express from "express";
import { deleteRating, getRating, createRating, updateRating } from "./rating.controller";
import { authenticated } from "../../config/passport.jwt.config";

const router = express.Router();

router.get("/", getRating);
router.post("/", createRating);
router.put("/:ratingId", updateRating);
router.delete("/:ratingId", deleteRating);

export default router;

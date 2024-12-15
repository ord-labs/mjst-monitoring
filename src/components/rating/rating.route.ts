import express from "express";
import { deleteRating, getRating, createRating, updateRating } from "./rating.controller";
import { authenticated } from "../../config/passport.jwt.config";

const router = express.Router();

router.get("/", authenticated, getRating);
router.post("/", authenticated, createRating);
router.put("/:ratingId", authenticated, updateRating);
router.delete("/:ratingId", authenticated, deleteRating);

export default router;

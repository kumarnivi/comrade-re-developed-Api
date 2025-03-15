import express from "express";
import { addReview, getReviewsByProduct } from "../controllers/review.controller";

const router = express.Router();

router.post("/add", addReview);
router.get("/:productId", getReviewsByProduct);

export default router;

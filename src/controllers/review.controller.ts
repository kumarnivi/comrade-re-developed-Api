import { Request, Response } from "express";
import Review from "../models/review.model";
import Product from "../models/product.model";

// Add a review for a product
export const addReview = async (req: any, res: any) => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const review = await Review.create({ productId, rating, comment });

    res.json({ message: "Review added", review });
  } catch (error) {
    res.status(500).json({ error: "Error adding review" });
  }
};

// Get all reviews for a specific product
export const getReviewsByProduct = async (req: any, res: any) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.findAll({ where: { productId } });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving reviews" });
  }
};

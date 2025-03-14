import { Request, Response } from "express";
import Review from "../models/review.model";
import Product from "../models/product.model";

export const addReview = async (req: any, res: any) => {
  try {
    const { productId, rating, comment } = req.body;
    const review = await Review.create({ productId, rating, comment });
    res.json({ message: "Review added", review });
  } catch (error) {
    res.status(500).json({ error: "Error adding review" });
  }
};

export const getReviews = async (req: any, res: any) => {
  const { productId } = req.params;
  const reviews = await Review.findAll({ where: { productId }, include: [{ model: Product, as: "product" }] });
  res.json(reviews);
};

import { Request, Response } from "express";
import Category from "../models/category.model";

export const addCategory = async (req: any, res: any) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.json({ message: "Category added", category });
  } catch (error) {
    res.status(500).json({ error: "Error adding category" });
  }
};

export const getCategories = async (req: any, res: any) => {
  const categories = await Category.findAll();
  res.json(categories);
};

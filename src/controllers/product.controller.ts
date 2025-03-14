import { Request, Response } from "express";
import Product from "../models/product.model";
import Category from "../models/category.model";

export const addProduct = async (req: any, res: any) => {
  try {
    const { name, price, categoryId } = req.body;
    const product = await Product.create({ name, price, categoryId });
    res.json({ message: "Product added", product });
  } catch (error) {
    res.status(500).json({ error: "Error adding product" });
  }
};

export const getProducts = async (req: any, res: any) => {
  const products = await Product.findAll({ include: [{ model: Category, as: "category" }] });
  res.json(products);
};

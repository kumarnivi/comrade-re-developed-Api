import { Request, Response } from "express";
import Product from "../models/product.model";
import Category from "../models/category.model";
import Review from "../models/review.model";
import fs from "fs";
import path from "path";

export const addProduct = async (req: any, res: any) => {
  try {
    const { name, price, categoryId } = req.body;
    
    // Get uploaded file paths
    const imageUrls = req.files ? req.files.map((file: any) => `/uploads/${file.filename}`) : [];

    // Create product with images
    const product = await Product.create({ name, price, categoryId, images: imageUrls });

    res.json({ message: "Product added", product });
  } catch (error) {
    res.status(500).json({ error: "Error adding product" });
  }
};


export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: "category" },
        { model: Review, as: "reviews" }, // Include product reviews
      ],
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving products" });
  }
};


// Edit Product
export const editProduct = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, price, categoryId } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Handle image updates
    let imageUrls = product.images || [];
    if (req.files && req.files.length > 0) {
      // Delete old images
      imageUrls.forEach((imagePath: string) => {
        const filePath = path.join(__dirname, "..", imagePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      // Add new images
      imageUrls = req.files.map((file: any) => `/uploads/${file.filename}`);
    }

    // Update product
    await product.update({ name, price, categoryId, images: imageUrls });

    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ error: "Error updating product" });
  }
};

// Delete Product
export const deleteProduct = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete associated images from the server
    product.images.forEach((imagePath: string) => {
      const filePath = path.join(__dirname, "..", imagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await product.destroy();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting product" });
  }
};
import { Request, Response } from "express";
import Product from "../models/product.model";
import Category from "../models/category.model";
import Review from "../models/review.model";
import fs from "fs";
import path from "path";
import sequelize from "sequelize";


// get All Products

export const addProduct = async (req: any, res: any) => {
  try {
    const { name, price, categoryId, stock } = req.body;
    // Process uploaded images if any
    const imageUrls = req.files ? req.files.map((file: any) => `/uploads/${file.filename}`) : [];

    // Create product including the new "stock" field
    const product = await Product.create({
      name,
      price,
      categoryId,
      stock: stock || 0, // use provided stock or default to 0
      images: JSON.stringify(imageUrls),
    });

    res.json({ message: "Product added", product });
  } catch (error) {
    res.status(500).json({ error: "Error adding product" });
  }
};

// Get All Products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: "category" },
        { model: Review, as: "reviews" },
      ],
    });

    // Format image URLs correctly
    const formattedProducts = products.map((product) => {
      let images: string[] = [];

      // Ensure product.images is processed correctly
      if (typeof product.images === "string") {
        try {
          images = JSON.parse(product.images); // Parse JSON string
          if (!Array.isArray(images)) {
            images = [product.images]; // Convert single string to array
          }
        } catch (err) {
          images = [product.images]; // If parsing fails, treat as single image
        }
      } else if (Array.isArray(product.images)) {
        images = product.images;
      }

      // Ensure correct URLs
      return {
        ...product.toJSON(),
        images: images.map((img: string) => `${req.protocol}://${req.get("host")}${img.startsWith("/") ? img : "/" + img}`),
      };
    });

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ error: "Error retrieving products" });
  }
};


// Get ProductByCategory 
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params; // Get category ID from request parameters

    const products = await Product.findAll({
      where: { categoryId }, // Filter by category
      include: [
        { model: Category, as: "category" },
        { model: Review, as: "reviews" },
      ],
    });

    // Format image URLs correctly
    const formattedProducts = products.map((product) => {
      let images: string[] = [];

      if (typeof product.images === "string") {
        try {
          images = JSON.parse(product.images); // Parse JSON string
          if (!Array.isArray(images)) {
            images = [product.images]; // Convert single string to array
          }
        } catch (err) {
          images = [product.images]; // If parsing fails, treat as single image
        }
      } else if (Array.isArray(product.images)) {
        images = product.images;
      }

      return {
        ...product.toJSON(),
        images: images.map((img: string) => `${req.protocol}://${req.get("host")}${img.startsWith("/") ? img : "/" + img}`),
      };
    });

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error retrieving products by category:", error);
    res.status(500).json({ error: "Error retrieving products by category" });
  }
};





export const editProduct = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, price, categoryId, stock } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let imageUrls: string[] = [];

    if (product.images) {
      if (typeof product.images === "string") {
        imageUrls = JSON.parse(product.images);
      } else {
        imageUrls = product.images;
      }
    }

    // Delete old files if new ones are uploaded
    if (req.files && req.files.length > 0) {
      imageUrls.forEach((imagePath: string) => {
        const filePath = path.resolve("public", imagePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      // Replace with new images
      imageUrls = (req.files as Express.Multer.File[]).map(
        (file) => `/uploads/${file.filename}`
      );
    }

    await product.update({
      name,
      price,
      categoryId,
      stock,
      images: imageUrls, // Save as array (or stringify if needed)
    });

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error("Edit product error:", err);
    res.status(500).json({ error: "Failed to update product" });
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
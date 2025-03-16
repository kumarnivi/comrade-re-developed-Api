import { Request, Response } from "express";
import Category from "../models/category.model";
import fs from "fs";
import path from "path";

// Add Category - Accepts name, description, and an image file (if available)
export const addCategory = async (req: any, res: any) => {
  try {
    const { name, description } = req.body;
    // Process the uploaded file (assuming middleware like multer is used)
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const category = await Category.create({ 
      name, 
      description, 
      image: imageUrl 
    });

    res.json({ message: "Category added", category });
  } catch (error) {
    res.status(500).json({ error: "Error adding category" , err:error});
  }
};

// Get All Categories
export const getCategories = async (req: any, res: any) => {
  try {
    const categories = await Category.findAll();
    const formattedCategories = categories.map((category) => {
      const cat = category.toJSON();
      if (cat.image) {
        cat.image = `${req.protocol}://${req.get("host")}${
          cat.image.startsWith("/") ? cat.image : "/" + cat.image
        }`;
      }
      return cat;
    });
    res.json(formattedCategories);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving categories" , err:error });
  }
};


// Update Category - Allows updating name, description, and image.
export const updateCategory = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Process new image if provided
    let imageUrl = category.image;
    if (req.file) {
      // Delete the old image file if exists
      if (category.image) {
        const oldImagePath = path.join(__dirname, "..", category.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageUrl = `/uploads/${req.file.filename}`;
    }

    await category.update({ name, description, image: imageUrl });
    res.json({ message: "Category updated", category });
  } catch (error) {
    res.status(500).json({ error: "Error updating category" });
  }
};

// Delete Category - Removes category and deletes associated image file if it exists.
export const deleteCategory = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete the image file if it exists
    if (category.image) {
      const filePath = path.join(__dirname, "..", category.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await category.destroy();
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting category" });
  }
};

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



// Update Category
export const updateCategory = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.update({ name });
    res.json({ message: "Category updated", category });
  } catch (error) {
    res.status(500).json({ error: "Error updating category" });
  }
};

// Delete Category
export const deleteCategory = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.destroy();
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting category" });
  }
};
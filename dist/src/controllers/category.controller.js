"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategories = exports.getCategoriesWithProductCount = exports.addCategory = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sequelize_1 = __importDefault(require("sequelize"));
// Add Category - Accepts name, description, and an image file (if available)
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        // Process the uploaded file (assuming middleware like multer is used)
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const category = yield category_model_1.default.create({
            name,
            description,
            image: imageUrl
        });
        res.json({ message: "Category added", category });
    }
    catch (error) {
        res.status(500).json({ error: "Error adding category" });
    }
});
exports.addCategory = addCategory;
const getCategoriesWithProductCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.default.findAll({
            attributes: [
                "id",
                "name",
                "description",
                "image",
                [
                    sequelize_1.default.literal(`(SELECT COUNT(*) FROM products WHERE products.categoryId = Category.id)`),
                    "productCount",
                ],
            ],
        });
        // Format the image URL properly
        const formattedCategories = categories.map((category) => {
            const cat = category.toJSON();
            if (cat.image) {
                const imagePath = cat.image.startsWith("/") ? cat.image : `/${cat.image}`;
                cat.image = `${req.protocol}://${req.get("host")}${imagePath}`;
            }
            return cat;
        });
        res.json(formattedCategories);
    }
    catch (error) {
        console.error("Error retrieving categories with product count:", error);
        res.status(500).json({ error: "Error retrieving categories" });
    }
});
exports.getCategoriesWithProductCount = getCategoriesWithProductCount;
// Get All Categories
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.default.findAll();
        const formattedCategories = categories.map((category) => {
            const cat = category.toJSON();
            if (cat.image) {
                cat.image = `${req.protocol}://${req.get("host")}${cat.image.startsWith("/") ? cat.image : "/" + cat.image}`;
            }
            return cat;
        });
        res.json(formattedCategories);
    }
    catch (error) {
        res.status(500).json({ error: "Error retrieving categories" });
    }
});
exports.getCategories = getCategories;
// Update Category - Allows updating name, description, and image.
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const category = yield category_model_1.default.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        // Process new image if provided
        let imageUrl = category.image;
        if (req.file) {
            // Delete the old image file if exists
            if (category.image) {
                const oldImagePath = path_1.default.join(__dirname, "..", category.image);
                if (fs_1.default.existsSync(oldImagePath)) {
                    fs_1.default.unlinkSync(oldImagePath);
                }
            }
            imageUrl = `/uploads/${req.file.filename}`;
        }
        yield category.update({ name, description, image: imageUrl });
        res.json({ message: "Category updated", category });
    }
    catch (error) {
        res.status(500).json({ error: "Error updating category" });
    }
});
exports.updateCategory = updateCategory;
// Delete Category - Removes category and deletes associated image file if it exists.
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield category_model_1.default.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        // Delete the image file if it exists
        if (category.image) {
            const filePath = path_1.default.join(__dirname, "..", category.image);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        }
        yield category.destroy();
        res.json({ message: "Category deleted" });
    }
    catch (error) {
        res.status(500).json({ error: "Error deleting category" });
    }
});
exports.deleteCategory = deleteCategory;

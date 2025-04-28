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
exports.deleteProduct = exports.editProduct = exports.getProductsByCategory = exports.getProducts = exports.addProduct = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
const review_model_1 = __importDefault(require("../models/review.model"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// export const addProduct = async (req: any, res: any) => {
//   try {
//     const { name, price, categoryId } = req.body;
//     // Ensure images are correctly processed
//     const imageUrls = req.files ? req.files.map((file: any) => `/uploads/${file.filename}`) : [];
//     // Store image paths as JSON string
//     const product = await Product.create({ 
//       name, 
//       price, 
//       categoryId, 
//       images: JSON.stringify(imageUrls) 
//     });
//     res.json({ message: "Product added", product });
//   } catch (error) {
//     res.status(500).json({ error: "Error adding product" });
//   }
// };
// get All Products
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, categoryId, stock } = req.body;
        // Process uploaded images if any
        const imageUrls = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];
        // Create product including the new "stock" field
        const product = yield product_model_1.default.create({
            name,
            price,
            categoryId,
            stock: stock || 0, // use provided stock or default to 0
            images: JSON.stringify(imageUrls),
        });
        res.json({ message: "Product added", product });
    }
    catch (error) {
        res.status(500).json({ error: "Error adding product" });
    }
});
exports.addProduct = addProduct;
// Get All Products
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_model_1.default.findAll({
            include: [
                { model: category_model_1.default, as: "category" },
                { model: review_model_1.default, as: "reviews" },
            ],
        });
        // Format image URLs correctly
        const formattedProducts = products.map((product) => {
            let images = [];
            // Ensure product.images is processed correctly
            if (typeof product.images === "string") {
                try {
                    images = JSON.parse(product.images); // Parse JSON string
                    if (!Array.isArray(images)) {
                        images = [product.images]; // Convert single string to array
                    }
                }
                catch (err) {
                    images = [product.images]; // If parsing fails, treat as single image
                }
            }
            else if (Array.isArray(product.images)) {
                images = product.images;
            }
            // Ensure correct URLs
            return Object.assign(Object.assign({}, product.toJSON()), { images: images.map((img) => `${req.protocol}://${req.get("host")}${img.startsWith("/") ? img : "/" + img}`) });
        });
        res.status(200).json(formattedProducts);
    }
    catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ error: "Error retrieving products" });
    }
});
exports.getProducts = getProducts;
// Get ProductByCategory 
const getProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params; // Get category ID from request parameters
        const products = yield product_model_1.default.findAll({
            where: { categoryId }, // Filter by category
            include: [
                { model: category_model_1.default, as: "category" },
                { model: review_model_1.default, as: "reviews" },
            ],
        });
        // Format image URLs correctly
        const formattedProducts = products.map((product) => {
            let images = [];
            if (typeof product.images === "string") {
                try {
                    images = JSON.parse(product.images); // Parse JSON string
                    if (!Array.isArray(images)) {
                        images = [product.images]; // Convert single string to array
                    }
                }
                catch (err) {
                    images = [product.images]; // If parsing fails, treat as single image
                }
            }
            else if (Array.isArray(product.images)) {
                images = product.images;
            }
            return Object.assign(Object.assign({}, product.toJSON()), { images: images.map((img) => `${req.protocol}://${req.get("host")}${img.startsWith("/") ? img : "/" + img}`) });
        });
        res.status(200).json(formattedProducts);
    }
    catch (error) {
        console.error("Error retrieving products by category:", error);
        res.status(500).json({ error: "Error retrieving products by category" });
    }
});
exports.getProductsByCategory = getProductsByCategory;
// Edit Product
// export const editProduct = async (req: any, res: any) => {
//   try {
//     const { id } = req.params;
//     const { name, price, categoryId } = req.body;
//     const product = await Product.findByPk(id);
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }
//     // Handle image updates
//     let imageUrls = product.images || [];
//     if (req.files && req.files.length > 0) {
//       // Delete old images
//       imageUrls.forEach((imagePath: string) => {
//         const filePath = path.join(__dirname, "..", imagePath);
//         if (fs.existsSync(filePath)) {
//           fs.unlinkSync(filePath);
//         }
//       });
//       // Add new images
//       imageUrls = req.files.map((file: any) => `/uploads/${file.filename}`);
//     }
//     // Update product
//     await product.update({ name, price, categoryId, images: imageUrls });
//     res.json({ message: "Product updated successfully", product });
//   } catch (error) {
//     res.status(500).json({ error: "Error updating product" });
//   }
// };
const editProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, price, categoryId, stock } = req.body;
        const product = yield product_model_1.default.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        // Handle image updates if files are uploaded
        let imageUrls = product.images || [];
        if (req.files && req.files.length > 0) {
            // Delete old images
            imageUrls.forEach((imagePath) => {
                const filePath = path_1.default.join(__dirname, "..", imagePath);
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                }
            });
            // Map new images
            imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
        }
        // Update product details including stock
        yield product.update({ name, price, categoryId, stock, images: imageUrls });
        res.json({ message: "Product updated successfully", product });
    }
    catch (error) {
        res.status(500).json({ error: "Error updating product" });
    }
});
exports.editProduct = editProduct;
// Delete Product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield product_model_1.default.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        // Delete associated images from the server
        product.images.forEach((imagePath) => {
            const filePath = path_1.default.join(__dirname, "..", imagePath);
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.unlinkSync(filePath);
            }
        });
        yield product.destroy();
        res.json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Error deleting product" });
    }
});
exports.deleteProduct = deleteProduct;

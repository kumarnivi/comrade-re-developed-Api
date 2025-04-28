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
exports.getReviewsByProduct = exports.addReview = void 0;
const review_model_1 = __importDefault(require("../models/review.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
// Add a review for a product
const addReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, rating, comment } = req.body;
        const product = yield product_model_1.default.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const review = yield review_model_1.default.create({ productId, rating, comment });
        res.json({ message: "Review added", review });
    }
    catch (error) {
        res.status(500).json({ error: "Error adding review" });
    }
});
exports.addReview = addReview;
// Get all reviews for a specific product
const getReviewsByProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const reviews = yield review_model_1.default.findAll({ where: { productId } });
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ error: "Error retrieving reviews" });
    }
});
exports.getReviewsByProduct = getReviewsByProduct;

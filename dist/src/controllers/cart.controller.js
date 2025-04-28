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
exports.removeFromCart = exports.getCartItems = exports.addToCart = void 0;
const cart_model_1 = __importDefault(require("../models/cart.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
// Add to Cart
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId, quantity } = req.body;
        const product = yield product_model_1.default.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        const cartItem = yield cart_model_1.default.create({ userId, productId, quantity });
        res.json({ message: "Product added to cart", cartItem });
    }
    catch (error) {
        res.status(500).json({ error: "Error adding to cart" });
    }
});
exports.addToCart = addToCart;
// Get Cart Items
const getCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const cartItems = yield cart_model_1.default.findAll({
            where: { userId },
            include: [{ model: product_model_1.default, as: "product" }],
        });
        res.json(cartItems);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching cart items" });
    }
});
exports.getCartItems = getCartItems;
// Remove from Cart
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield cart_model_1.default.destroy({ where: { id } });
        res.json({ message: "Item removed from cart" });
    }
    catch (error) {
        res.status(500).json({ error: "Error removing item from cart" });
    }
});
exports.removeFromCart = removeFromCart;

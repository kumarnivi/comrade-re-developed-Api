import express from "express";
import { addToCart, getCartItems, removeFromCart } from "../controllers/cart.controller";

const router = express.Router();

router.post("/", addToCart);
router.get("/:userId", getCartItems);
router.delete("/:id", removeFromCart);

export default router;

import express from "express";
import { addToCart, getCartItems, removeFromCart ,getAllCartItems} from "../controllers/cart.controller";

const router = express.Router();

router.post("/", addToCart);
router.get("/:userId", getCartItems);
router.get("/", getAllCartItems);
router.delete("/:id", removeFromCart);

export default router;

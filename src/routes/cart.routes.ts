import express from "express";
import { addToCart, getCartItems, removeFromCart ,getAllCartItems} from "../controllers/cart.controller";
import { verifyToken } from "../middlewares/isAdmin";

const router = express.Router();

router.post("/", verifyToken, addToCart);
router.get("/:userId", getCartItems);
router.get("/", getAllCartItems);
router.delete("/:id", removeFromCart);

export default router;

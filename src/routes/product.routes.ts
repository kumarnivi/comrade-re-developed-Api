import express from "express";
import { addProduct, getProducts } from "../controllers/product.controller";

const router = express.Router();

router.post("/add", addProduct);
router.get("/", getProducts);

export default router;

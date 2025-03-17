import express from "express";
import { getProducts, addProduct, editProduct, deleteProduct, getProductsByCategory } from "../controllers/product.controller";
import upload from "../middlewares/multer";
import { checkRole, verifyToken } from "../middlewares/isAdmin";

const router = express.Router();

router.post("/add", upload.array("images", 5), verifyToken, checkRole(["admin"]), addProduct);
router.get("/", getProducts);
router.put("/edit/:id", upload.array("images"), verifyToken, checkRole(["admin"]), editProduct);
router.delete("/delete/:id", verifyToken, checkRole(["admin"]), deleteProduct)

router.get("/:categoryId", getProductsByCategory);

export default router;

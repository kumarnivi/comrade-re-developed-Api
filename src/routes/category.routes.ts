import express from "express";
import { addCategory, deleteCategory, getCategories, updateCategory ,getCategoriesWithProductCount } from "../controllers/category.controller";
import {verifyToken, checkRole} from "../middlewares/isAdmin";
import upload from "../middlewares/multer";

const router = express.Router();

router.post("/add", verifyToken, checkRole(["admin"]), upload.single("image"), addCategory);
router.get("/", getCategories);
router.put("/edit/:id", verifyToken, checkRole(["admin"]), updateCategory);
router.delete("/delete/:id", verifyToken, checkRole(["admin"]), deleteCategory);
router.get("/categories-with-product-count", getCategoriesWithProductCount);

export default router;

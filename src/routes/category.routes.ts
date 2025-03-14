import express from "express";
import { addCategory, getCategories } from "../controllers/category.controller";
import isAdmin from "../middlewares/isAdmin";

const router = express.Router();

router.post("/add", isAdmin, addCategory);
router.get("/", getCategories);

export default router;

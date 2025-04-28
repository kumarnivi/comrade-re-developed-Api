"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const isAdmin_1 = require("../middlewares/isAdmin");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = express_1.default.Router();
router.post("/add", isAdmin_1.verifyToken, (0, isAdmin_1.checkRole)(["admin", "superAdmin"]), multer_1.default.single("image"), category_controller_1.addCategory);
router.get("/", category_controller_1.getCategories);
router.put("/edit/:id", isAdmin_1.verifyToken, (0, isAdmin_1.checkRole)(["admin", "superAdmin"]), category_controller_1.updateCategory);
router.delete("/delete/:id", isAdmin_1.verifyToken, (0, isAdmin_1.checkRole)(["admin", "superAdmin"]), category_controller_1.deleteCategory);
router.get("/categories-with-product-count", category_controller_1.getCategoriesWithProductCount);
exports.default = router;

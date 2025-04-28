"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const multer_1 = __importDefault(require("../middlewares/multer"));
const isAdmin_1 = require("../middlewares/isAdmin");
const router = express_1.default.Router();
router.post("/add", multer_1.default.array("images", 5), isAdmin_1.verifyToken, (0, isAdmin_1.checkRole)(["admin", "superAdmin"]), product_controller_1.addProduct);
router.get("/", product_controller_1.getProducts);
router.put("/edit/:id", multer_1.default.array("images"), isAdmin_1.verifyToken, (0, isAdmin_1.checkRole)(["admin", "superAdmin"]), product_controller_1.editProduct);
router.delete("/delete/:id", isAdmin_1.verifyToken, (0, isAdmin_1.checkRole)(["admin", "superAdmin"]), product_controller_1.deleteProduct);
router.get("/:categoryId", product_controller_1.getProductsByCategory);
exports.default = router;

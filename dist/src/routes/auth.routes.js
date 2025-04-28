"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = express_1.default.Router();
router.post("/register", multer_1.default.single("profileImage"), auth_controller_1.register);
router.post("/login", auth_controller_1.login);
router.post("/forgot-password", auth_controller_1.forgotPassword);
router.post("/reset-password", auth_controller_1.resetPassword);
router.get("/users", auth_controller_1.getAllUsers);
router.put("/edit-profile/:id", multer_1.default.single("profileImage"), auth_controller_1.editProfile);
exports.default = router; // ✅ Use default export

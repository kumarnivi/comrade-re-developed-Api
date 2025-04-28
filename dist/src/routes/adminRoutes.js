"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const isAdmin_1 = require("../middlewares/isAdmin"); // Middleware for authentication
const router = express_1.default.Router();
// Approve an admin (Only Super Admin can access this route)
router.post("/approve-admin/:userId", isAdmin_1.verifyToken, adminController_1.approveAdmin);
// Change password (Logged-in users only)
router.post("/change-password", isAdmin_1.verifyToken, adminController_1.changePassword);
exports.default = router;

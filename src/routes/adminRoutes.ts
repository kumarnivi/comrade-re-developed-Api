import express from "express";
import { approveAdmin, changePassword } from "../controllers/adminController";
import {verifyToken, checkRole} from "../middlewares/isAdmin"; // Middleware for authentication

const router = express.Router();

// Approve an admin (Only Super Admin can access this route)
router.post("/approve-admin/:userId", verifyToken, approveAdmin);

// Change password (Logged-in users only)
router.post("/change-password", verifyToken, changePassword);

export default router;

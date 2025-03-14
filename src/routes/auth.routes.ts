import express from "express";
import { register, login, forgotPassword, resetPassword, getAllUsers, editProfile } from "../controllers/auth.controller";
import upload from "../middlewares/multer";

const router = express.Router();

router.post("/register", upload.single("profileImage"), register);
router.post("/login", login);


router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/users", getAllUsers);
router.put("/edit-profile/:id", upload.single("profileImage"), editProfile);


export default router; // ✅ Use default export

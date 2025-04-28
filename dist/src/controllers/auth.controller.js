"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editProfile = exports.getAllUsers = exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// Register User
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = yield user_model_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const imagePath = req.file ? req.file.path : null;
        const newUser = yield user_model_1.default.create({
            name,
            email,
            password: hashedPassword,
            role,
            profileImage: imagePath, // Save image path
        });
        res.status(201).json({ message: "User registered successfully", newUser });
    }
    catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
});
exports.register = register;
// Login User
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = yield user_model_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        console.log("Received password:", password); // Debugging line
        console.log("Stored hashed password:", user.password); // Debugging line
        // Ensure passwords are properly compared
        const isMatch = yield bcryptjs_1.default.compare(password.toString(), user.password.toString());
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, "role", user.role, { httpOnly: true });
        res.json({ message: "Login successful", token, role: user.role });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error logging in", error });
    }
});
exports.login = login;
// Setup Nodemailer Transporter
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "nivethikashivakumar56@gmail.com", // Replace with your email
        pass: "xnep zczr wocb dtxf", // Replace with your email password
    },
});
// Store OTPs temporarily (use Redis or DB for production)
const otpStore = {};
// ======================== 1. Forgot Password (Send OTP) ========================
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_model_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Expires in 5 mins
        // Send email with OTP
        yield transporter.sendMail({
            from: "nivethikashivakumar56@gmail.com",
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. This OTP is valid for 5 minutes.`,
        });
        res.json({ message: "OTP sent to your email" });
    }
    catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Error sending OTP", error });
    }
});
exports.forgotPassword = forgotPassword;
// ======================== 2. Verify OTP & Reset Password ========================
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, newPassword } = req.body;
        const storedOtp = otpStore[email];
        if (!storedOtp || storedOtp.otp !== otp || storedOtp.expiresAt < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        yield user_model_1.default.update({ password: hashedPassword }, { where: { email } });
        delete otpStore[email]; // Remove OTP after successful reset
        res.json({ message: "Password reset successfully" });
    }
    catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Error resetting password", error });
    }
});
exports.resetPassword = resetPassword;
// ======================== 3. Get All Users ========================
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.findAll({ attributes: { exclude: ["password"] } }); // Exclude password for security
        res.json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users", error });
    }
});
exports.getAllUsers = getAllUsers;
// ======================== 4. Edit Profile ========================
const editProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;
        const imagePath = req.file ? req.file.path : null; // Update profile image if provided
        const updatedUser = yield user_model_1.default.update(Object.assign({ name, email, role }, (imagePath && { profileImage: imagePath })), { where: { id } });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Profile updated successfully" });
    }
    catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Error updating profile", error });
    }
});
exports.editProfile = editProfile;

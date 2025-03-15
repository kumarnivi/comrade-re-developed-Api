import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import nodemailer from "nodemailer";
import crypto from "crypto";


// Register User
export const register = async (req: any, res: any) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const imagePath = req.file ? req.file.path : null;

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage: imagePath, // Save image path
    });

    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login User
export const login = async (req: any, res: any) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
  
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      console.log("Received password:", password); // Debugging line
      console.log("Stored hashed password:", user.password); // Debugging line
  
      // Ensure passwords are properly compared
      const isMatch = await bcrypt.compare(password.toString(), user.password.toString());
  
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
  
      res.cookie("token", token, { httpOnly: true });
      res.json({ message: "Login successful", token , role:user.role });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Error logging in", error });
    }
  };
  

  // Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nivethikashivakumar56@gmail.com", // Replace with your email
    pass: "xnep zczr wocb dtxf",  // Replace with your email password
  },
});

// Store OTPs temporarily (use Redis or DB for production)
const otpStore: { [key: string]: { otp: string; expiresAt: number } } = {};

// ======================== 1. Forgot Password (Send OTP) ========================
export const forgotPassword = async (req: any, res: any) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Expires in 5 mins

    // Send email with OTP
    await transporter.sendMail({
      from: "nivethikashivakumar56@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. This OTP is valid for 5 minutes.`,
    });

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP", error });
  }
};

// ======================== 2. Verify OTP & Reset Password ========================
export const resetPassword = async (req: any, res: any) => {
  try {
    const { email, otp, newPassword } = req.body;
    const storedOtp = otpStore[email];

    if (!storedOtp || storedOtp.otp !== otp || storedOtp.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { email } });

    delete otpStore[email]; // Remove OTP after successful reset

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password", error });
  }
};

// ======================== 3. Get All Users ========================
export const getAllUsers = async (req: any, res: any) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } }); // Exclude password for security
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// ======================== 4. Edit Profile ========================
export const editProfile = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const imagePath = req.file ? req.file.path : null; // Update profile image if provided

    const updatedUser = await User.update(
      { name, email, role, ...(imagePath && { profileImage: imagePath }) },
      { where: { id } }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile", error });
  }
};


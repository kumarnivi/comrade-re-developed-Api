"use strict";
// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import User from '../models/user.model'; // Import User Model
// import dotenv from "dotenv";
// dotenv.config(); // Load environment variables
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = exports.checkAdminOrSuperAdmin = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    var _a, _b;
    const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) || ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1]);
    if (!token) {
        return res.status(400).json({ message: "No Token Provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid Token", error: err.message });
    }
};
exports.verifyToken = verifyToken;
// Allow `admin` and `superAdmin` to access all APIs
const checkAdminOrSuperAdmin = (req, res, next) => {
    const allowedRoles = ["admin", "superAdmin"];
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access Denied" });
    }
    next();
};
exports.checkAdminOrSuperAdmin = checkAdminOrSuperAdmin;
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied" });
        }
        next();
    };
};
exports.checkRole = checkRole;

// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import User from '../models/user.model'; // Import User Model
// import dotenv from "dotenv";
// dotenv.config(); // Load environment variables

// interface AuthRequest extends Request {
//   user?: any;
// }

// const isAdmin = async (req: AuthRequest, res: any, next: NextFunction) => {
//   try {
//     // Get token from headers
//     const authHeader = req.header('Authorization');
//     console.log('Authorization Header:', authHeader);

//     if (!authHeader) return res.status(401).json({ message: 'Unauthorized: No token provided' });

//     const token = authHeader.split(' ')[1];
//     console.log('Extracted Token:', token);

//     if (!token) return res.status(401).json({ message: 'Unauthorized: Invalid token format' });

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
//     console.log('Decoded Token:', decoded);

//     // Find user
//     const user = await User.findByPk(decoded.id);
//     console.log('User Found:', user);

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     // Check if user is admin
//     if (user.role !== 'admin') {
//       console.log('Access Denied: User is not an admin');
//       return res.status(403).json({ message: 'Forbidden: Admin access only' });
//     }

//     // Attach user to request
//     req.user = user;
//     console.log('User attached to request:', req.user);
    
//     next();
//   } catch (error) {
//     console.error('JWT Verification Error:', error);
//     res.status(401).json({ message: 'Unauthorized: Invalid token' });
//   }
// };

// export default isAdmin;


import { Request, Response, NextFunction } from "express";
import  Jwt  from "jsonwebtoken";

export const verifyToken = (req: any, res: any, next: any) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
      return res.status(400).json({ message: "No Token Provided" });
  }

 
  try {
      const decoded = Jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = decoded;
      next();
  } catch (err:any) {
      return res.status(401).json({ message: "Invalid Token", error: err.message });
  }
};


// Allow `admin` and `superAdmin` to access all APIs
export const checkAdminOrSuperAdmin = (req: any, res: any, next: any) => {
    const allowedRoles = ["admin", "superAdmin"];
  
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  };

export const checkRole = (roles:Array<string>) => {
    return (req:any, res:any, next:any) => {
        if(!roles.includes(req.user.role)) {
            return res.status(403).json({ message:"Access Denied" })
        }
       next()
 }
}
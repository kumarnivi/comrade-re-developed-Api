import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model'; // Import User Model

interface AuthRequest extends Request {
  user?: any;
}

const isAdmin = async (req: AuthRequest, res: any, next: any) => {
  try {
    // Get token from headers
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    
    // Find user
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access only' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export default isAdmin;

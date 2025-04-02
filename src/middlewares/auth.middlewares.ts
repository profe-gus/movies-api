import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/user.model';
import { JwtRequest } from '../interfaces/JwtRequest.interfaces';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.header('Authorization');
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        token = token.replace('Bearer ', '').trim();
        console.log('Token:', token); 
        const decoded = jwt.verify(token, JWT_SECRET) as JwtRequest['user'];
        req.body.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error); 
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const authorizeRoles = (allowedRoles: UserRole[]) => {
    return (req: JwtRequest, res: Response, next: NextFunction) => {
        const user = req.body.user;
        if (user && !allowedRoles.includes(user.role)) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        next();
    };
};
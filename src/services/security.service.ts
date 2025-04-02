import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

class SecurityService {
    async encryptPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    async comparePassword(plainPassword: string, hashedPassword: string){
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    async generateToken(id: string, email: string, role: string){
        const payload = { id, email, role };
        const secret = process.env.JWT_SECRET || 'secret'; 
        return jwt.sign(payload, secret, { expiresIn: '1h' });
    }
}

export const securityService = new SecurityService();
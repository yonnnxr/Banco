import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: number, email: string): string => {
    const secret = config.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET não definido nas variáveis de ambiente');
    }
    return jwt.sign(
        { userId, email },
        secret,
        { expiresIn: '24h' }
    );
};

export const verifyToken = (token: string): any => {
    const secret = config.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET não definido nas variáveis de ambiente');
    }
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};

export const generateAccountNumber = (): string => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
};

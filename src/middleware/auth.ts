import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { findUserByEmail } from '../repositories/BancoRepositories';

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
        conta: string;
    };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Token não fornecido',
                message: 'Token de autenticação é obrigatório'
            });
        }
        
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, config.JWT_SECRET) as any;
        
        if (!decoded || !decoded.userId || !decoded.email) {
            return res.status(401).json({
                error: 'Token inválido',
                message: 'Token de autenticação é inválido'
            });
        }
        
        const user = await findUserByEmail(decoded.email);
        if (!user) {
            return res.status(401).json({
                error: 'Usuário não encontrado',
                message: 'Usuário não existe mais'
            });
        }
        
        req.user = {
            userId: user.id,
            email: user.email,
            conta: user.conta
        };
        
        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Token inválido',
            message: 'Token de autenticação é inválido ou expirou'
        });
    }
};

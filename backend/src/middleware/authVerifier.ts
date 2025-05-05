import dotenv from 'dotenv';
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

dotenv.config({ path: '../.env' });

// Tipo para o payload do token JWT
interface UserPayload {
id: string;
email: string;
category: string;
[key: string]: any; // Permite outros campos se necessário
}

// Extende o tipo Request para incluir o campo `user`
declare module "express-serve-static-core" {
interface Request {
    user?: UserPayload;
}
}

// Middleware para verificar o token JWT
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.header("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
        res.status(401).json({ message: "Acesso negado!" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
        req.user = decoded;
        next();
    } catch (err: any) {
        res.status(400).json({ message: "Token inválido!", error: err.message });
    }
};

// Middleware para verificar a categoria do usuário
export const verifyCategory = (category: string) => (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.category !== category) {
        res.status(403).json({ message: "Acesso negado! Permissão insuficiente." });
        return;
    }
    next();
};
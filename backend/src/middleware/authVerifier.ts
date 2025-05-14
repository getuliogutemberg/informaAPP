import dotenv from 'dotenv';
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

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
export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.header("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
        res.status(401).json({ message: "Acesso negado! Token não fornecido." });
        return;
    }

    try {
        // 1. Decodifica APENAS para extrair o `id`, mas sem confiar ainda
        const unverifiedPayload = jwt.decode(token) as UserPayload | null;

        if (!unverifiedPayload?.id) {
        res.status(400).json({ message: "Token inválido! Estrutura incorreta." });
        return;
        }

        // 2. Busca o usuário para obter o `jwtSecret`
        const user = await User.findById(unverifiedPayload.id);
        if (!user || !user.jwtSecret) {
        res.status(401).json({ message: "Usuário não autorizado!" });
        return;
        }

        // 3. Agora sim, verifica o token com a chave do usuário
        const verifiedPayload = jwt.verify(token, user.jwtSecret) as UserPayload;

        // 4. Injeta o payload no request
        req.user = verifiedPayload;
        next();
    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
        res.status(401).json({ message: "Token expirado!", error: err.message });
        } else if (err.name === "JsonWebTokenError") {
        res.status(400).json({ message: "Token inválido!", error: err.message });
        } else {
        res.status(500).json({ message: "Erro na verificação do token", error: err.message });
        }
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
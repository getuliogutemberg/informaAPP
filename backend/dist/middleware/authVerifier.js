"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCategory = exports.verifyToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
dotenv_1.default.config({ path: '../.env' });
// Middleware para verificar o token JWT
const verifyToken = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
        res.status(401).json({ message: "Acesso negado! Token não fornecido." });
        return;
    }
    try {
        // 1. Decodifica APENAS para extrair o `id`, mas sem confiar ainda
        const unverifiedPayload = jsonwebtoken_1.default.decode(token);
        if (!unverifiedPayload?.id) {
            res.status(400).json({ message: "Token inválido! Estrutura incorreta." });
            return;
        }
        // 2. Busca o usuário para obter o `jwtSecret`
        const user = await User_1.default.findByPk(unverifiedPayload.id);
        if (!user || !user.jwtSecret) {
            res.status(401).json({ message: "Usuário não autorizado!" });
            return;
        }
        // 3. Agora sim, verifica o token com a chave do usuário
        const verifiedPayload = jsonwebtoken_1.default.verify(token, user.jwtSecret);
        // 4. Injeta o payload no request
        req.user = verifiedPayload;
        next();
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            res.status(401).json({ message: "Token expirado!", error: err.message });
        }
        else if (err.name === "JsonWebTokenError") {
            res.status(400).json({ message: "Token inválido!", error: err.message });
        }
        else {
            res.status(500).json({ message: "Erro na verificação do token", error: err.message });
        }
    }
};
exports.verifyToken = verifyToken;
// Middleware para verificar a categoria do usuário
const verifyCategory = (category) => (req, res, next) => {
    if (!req.user || req.user.category !== category) {
        res.status(403).json({ message: "Acesso negado! Permissão insuficiente." });
        return;
    }
    next();
};
exports.verifyCategory = verifyCategory;

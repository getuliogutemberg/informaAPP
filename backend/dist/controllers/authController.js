"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const tokenUtils_1 = require("../utils/tokenUtils");
class AuthController {
    async register(req, res) {
        try {
            const { name, email, password, category, className, status, position } = req.body;
            if (!name || !email || !password || !category || !className) {
                res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
                return;
            }
            const userExists = await User_1.default.findOne({ where: { email } });
            if (userExists) {
                res.status(400).json({ message: 'Email já cadastrado!' });
                return;
            }
            const newStatus = status === 'cadastro' ? '' : 'pedido de acesso';
            const isActive = status === 'cadastro';
            const hashedPassword = await bcryptjs_1.default.hash(password, 12);
            const newUser = await User_1.default.create({
                name,
                email,
                password: hashedPassword,
                category,
                className,
                status: newStatus,
                isActive,
                position // <- obrigatório no model
            });
            res.status(201).json({
                message: status === 'cadastro' ? 'Usuário registrado com sucesso!' : 'Registro solicitado',
                ...(status === 'cadastro' && { user: newUser })
            });
        }
        catch (err) {
            res.status(500).json({
                message: 'Erro no servidor!',
                error: err.message
            });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ message: "Email e senha são obrigatórios!" });
                return;
            }
            const user = await User_1.default.findOne({ where: { email } });
            if (!user) {
                res.status(400).json({ message: "Usuário não encontrado!" });
                return;
            }
            const isMatch = await bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                res.status(400).json({ message: "Senha incorreta!" });
                return;
            }
            const accessToken = (0, tokenUtils_1.generateAccessToken)(user);
            const refreshToken = (0, tokenUtils_1.generateRefreshToken)(user);
            user.refreshToken = refreshToken;
            await user.save();
            res.json({ message: "Login bem-sucedido!", accessToken, refreshToken, route: "/", user });
        }
        catch (err) {
            res.status(500).json({ message: "Erro no servidor!", error: err.message });
        }
    }
    async refresh(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(401).json({ message: "Refresh token é obrigatório!" });
                return;
            }
            const decoded = jsonwebtoken_1.default.decode(refreshToken);
            if (!decoded?.id) {
                res.status(403).json({ message: "Refresh token inválido!" });
                return;
            }
            if (decoded.exp && Date.now() >= decoded.exp * 1000) {
                res.status(403).json({ message: "Refresh token expirado!" });
                return;
            }
            const user = await User_1.default.findOne({ where: { id: decoded.id, refreshToken } });
            if (!user) {
                res.status(403).json({ message: "Refresh token não associado a usuário!" });
                return;
            }
            const newAccessToken = (0, tokenUtils_1.generateAccessToken)(user);
            res.json({ accessToken: newAccessToken });
        }
        catch (err) {
            res.status(500).json({ message: "Erro no servidor!", error: err.message });
        }
    }
    async logout(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: "Usuário não autenticado!" });
                return;
            }
            await User_1.default.update({ refreshToken: null }, { where: { id: userId } });
            res.json({ message: "Logout bem-sucedido!" });
        }
        catch (err) {
            res.status(500).json({ message: "Erro no servidor!", error: err.message });
        }
    }
    async me(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: "Usuário não autenticado!" });
                return;
            }
            const user = await User_1.default.findByPk(userId, {
                attributes: { exclude: ['password', 'refreshToken'] }
            });
            if (!user) {
                res.status(404).json({ message: "Usuário não encontrado!" });
                return;
            }
            res.json(user);
        }
        catch (err) {
            res.status(500).json({ message: "Erro no servidor!", error: err.message });
        }
    }
    async admin(_req, res) {
        res.json({ message: "Acesso permitido ao administrador!" });
    }
}
exports.default = new AuthController();

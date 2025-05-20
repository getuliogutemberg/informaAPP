import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils";

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, category, className, status,position } = req.body;

      if (!name || !email || !password || !category || !className) {
        res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
        return;
      }

      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        res.status(400).json({ message: 'Email já cadastrado!' });
        return;
      }

      const newStatus = status === 'cadastro' ? '' : 'pedido de acesso';
      const isActive = status === 'cadastro';

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        category,
        className,
        status: newStatus,
        isActive,
        position  // <- obrigatório no model
      });
      res.status(201).json({
        message: status === 'cadastro' ? 'Usuário registrado com sucesso!' : 'Registro solicitado',
        ...(status === 'cadastro' && { user: newUser })
      });

    } catch (err: any) {
      res.status(500).json({
        message: 'Erro no servidor!',
        error: err.message
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: "Email e senha são obrigatórios!" });
        return;
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(400).json({ message: "Usuário não encontrado!" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Senha incorreta!" });
        return;
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      user.refreshToken = refreshToken;
      await user.save();

      res.json({ message: "Login bem-sucedido!", accessToken, refreshToken, route: "/", user });
    } catch (err: any) {
      res.status(500).json({ message: "Erro no servidor!", error: err.message });
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(401).json({ message: "Refresh token é obrigatório!" });
        return;
      }

      const decoded = jwt.decode(refreshToken) as { id: string; exp: number } | null;
      if (!decoded?.id) {
        res.status(403).json({ message: "Refresh token inválido!" });
        return;
      }

      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        res.status(403).json({ message: "Refresh token expirado!" });
        return;
      }

      const user = await User.findOne({ where: { id: decoded.id, refreshToken } });
      if (!user) {
        res.status(403).json({ message: "Refresh token não associado a usuário!" });
        return;
      }

      const newAccessToken = generateAccessToken(user);
      res.json({ accessToken: newAccessToken });
    } catch (err: any) {
      res.status(500).json({ message: "Erro no servidor!", error: err.message });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ message: "Usuário não autenticado!" });
        return;
      }

      await User.update({ refreshToken: null }, { where: { id: userId } });
      res.json({ message: "Logout bem-sucedido!" });
    } catch (err: any) {
      res.status(500).json({ message: "Erro no servidor!", error: err.message });
    }
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ message: "Usuário não autenticado!" });
        return;
      }

      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password', 'refreshToken'] }
      });

      if (!user) {
        res.status(404).json({ message: "Usuário não encontrado!" });
        return;
      }

      res.json(user);
    } catch (err: any) {
      res.status(500).json({ message: "Erro no servidor!", error: err.message });
    }
  }

  async admin(_req: Request, res: Response): Promise<void> {
    res.json({ message: "Acesso permitido ao administrador!" });
  }
}

export default new AuthController();

import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils"; 
import { generateUsers } from "../utils/userGenerator";

dotenv.config({ path: '../../.env' });

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  category: string;
  className: string;
  status?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface UpdatePasswordBody {
  currentPassword: string;
  newPassword: string;
}

class UserController {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, category, className, status }: RegisterBody = req.body;
      
      if (!name || !email || !password || !category || !className) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
      }

      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: "Email já cadastrado!" });

      const newStatus = status === "cadastro" ? "" : "pedido de acesso";
      const isActive = status === "cadastro";

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({ 
        name, 
        email, 
        password: hashedPassword, 
        category, 
        className, 
        status: newStatus, 
        isActive 
      });
      
      await newUser.save();

      return res.status(201).json({ 
        message: status === "cadastro" ? 'Usuário registrado com sucesso!' : 'Registro solicitado', 
        user: status === "cadastro" ? newUser : undefined 
      });
    } catch (err: unknown) {
      const error = err as Error;
      return res.status(500).json({ message: "Erro no servidor!", error: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password }: LoginBody = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios!" });
      }

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Usuário não encontrado!" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Senha incorreta!" });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      user.refreshToken = refreshToken;
      await user.save();

      return res.json({ 
        message: "Login bem-sucedido!", 
        accessToken, 
        refreshToken, 
        route: '/', 
        user 
      });
    } catch (err: unknown) {
      const error = err as Error;
      return res.status(500).json({ message: "Erro no servidor!", error: error.message });
    }
  }

  async getUsers(req: Request, res: Response): Promise<Response> {
    try {
      const { category } = req.query;
      let filter: { category?: string } = {};
      if (category) filter.category = category as string;

      let existingUsers = await User.find(filter);
      if (existingUsers.length === 0) {
        const groups = ["A", "B", "C"];
        const tags = ["1", "2", "3", "4"];
        const generatedUsers = generateUsers(groups, tags);

        const usersToInsert = Object.values(generatedUsers).flat();
        if (usersToInsert.length > 0) await User.insertMany(usersToInsert);
        existingUsers = await User.find(filter);
      }

      return res.status(200).json(existingUsers);
    } catch (err: unknown) {
      const error = err as Error;
      return res.status(500).json({ 
        error: "Erro ao obter os usuários", 
        message: error.message 
      });
    }
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, category, className }: RegisterBody = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({ 
        name, 
        email, 
        password: hashedPassword, 
        category, 
        className, 
        isActive: true 
      });
      
      await newUser.save();
      return res.status(201).json(newUser);
    } catch (err: unknown) {
      const error = err as Error;
      return res.status(500).json({ 
        message: "Erro ao criar usuário", 
        error: error.message 
      });
    }
  }

  async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true }
      );
      
      if (!updatedUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      return res.json(updatedUser);
    } catch (err: unknown) {
      const error = err as Error;
      return res.status(500).json({ 
        message: "Erro ao atualizar usuário", 
        error: error.message 
      });
    }
  }

  async updatePassword(req: Request, res: Response): Promise<Response> {
    try {
      const { currentPassword, newPassword }: UpdatePasswordBody = req.body;
      const user = await User.findById(req.params.id);
      
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Senha atual incorreta" });

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      await user.save();

      return res.json({ message: "Senha alterada com sucesso" });
    } catch (err: unknown) {
      const error = err as Error;
      return res.status(500).json({ 
        message: "Erro ao alterar senha", 
        error: error.message 
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      
      if (!deletedUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      return res.status(204).send();
    } catch (err: unknown) {
      const error = err as Error;
      return res.status(500).json({ 
        message: "Erro ao excluir usuário", 
        error: error.message 
      });
    }
  }
}

export default new UserController();
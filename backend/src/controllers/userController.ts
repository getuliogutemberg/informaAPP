import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../models/User"; // Sequelize Model
import { generateUsers } from "../utils/userGenerator";

dotenv.config({ path: '../../.env' });

interface RegisterBody {
  id: string;
  name: string;
  email: string;
  password: string;
  category: string;
  className: string;
  position:[number, number];
  status?: string;
}

interface UpdatePasswordBody {
  currentPassword: string;
  newPassword: string;
}

class UserController {
  async getUsers(req: Request, res: Response): Promise<Response> {
    try {
      const { category } = req.query;
      const where: any = {};

      if (category) where.category = category;

      let existingUsers = await User.findAll({ where });

      // if (existingUsers.length === 0) {
      //   // Geração dos usuários usando sua função
      //   const groups = ["A", "B", "C"];
      //   const tags = ["1", "2", "3", "4"];
      //   const generatedUsers = generateUsers(groups, tags);

      //   const usersToInsert = Object.values(generatedUsers).flat();

      //   if (usersToInsert.length > 0) {
      //     // Bulk create users no Sequelize
      //     await User.bulkCreate(usersToInsert);
      //   }

      //   existingUsers = await User.findAll({ where });
      // }

      return res.status(200).json(existingUsers);
    } catch (err: unknown) {
      const error = err as Error;
      return res.status(500).json({
        error: "Erro ao obter os usuários",
        message: error.message,
      });
    }
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const {id, name, email, password, category, className,position }: RegisterBody = req.body;

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await User.create({
        id,
        name,
        email,
        password: hashedPassword,
        category,
        className,
        isActive: true,
        position
      });

      return res.status(201).json(newUser);
    } catch (err: unknown) {
      const error = err as Error;
      return res.status(500).json({
        message: "Erro ao criar usuário",
        error: error.message,
      });
    }
  }

  async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const [affectedRows, [updatedUser]] = await User.update(req.body, {
        where: { id: req.params.id },
        returning: true,
      });

      if (affectedRows === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.json(updatedUser);
    } catch (err: unknown) {
      const error = err as Error;
      return res.status(500).json({
        message: "Erro ao atualizar usuário",
        error: error.message,
      });
    }
  }

  async updatePassword(req: Request, res: Response): Promise<Response> {
    try {
      const { currentPassword, newPassword }: UpdatePasswordBody = req.body;

      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Senha atual incorreta" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      user.password = hashedPassword;
      await user.save();

      return res.json({ message: "Senha alterada com sucesso" });
    } catch (err: unknown) {
      const error = err as Error;
      return res.status(500).json({
        message: "Erro ao alterar senha",
        error: error.message,
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const deletedUser = await User.destroy({
        where: { id: req.params.id },
      });

      if (deletedUser === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.status(204).send();
    } catch (err: unknown) {
      const error = err as Error;
      return res.status(500).json({
        message: "Erro ao excluir usuário",
        error: error.message,
      });
    }
  }
}

export default new UserController();

require("dotenv").config({ path: '../../.env' });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); 
const { generateAccessToken, generateRefreshToken } = require("../utils/tokenUtils");
const { generateUsers } = require("../utils/userGenerator");

class UserController {
  async register(req, res) {
    try {
      const { name, email, password, category, className, status } = req.body;
      if (!name || !email || !password || !category || !className) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
      }

      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: "Email já cadastrado!" });

      const newStatus = status === "cadastro" ? "" : "pedido de acesso";
      const isActive = status === "cadastro";

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({ name, email, password: hashedPassword, category, className, status: newStatus, isActive });
      await newUser.save();

      res.status(201).json({ message: status === "cadastro" ? 'Usuário registrado com sucesso!' : 'Registro solicitado', user: status === "cadastro" ? newUser : undefined });
    } catch (err) {
      res.status(500).json({ message: "Erro no servidor!", error: err.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
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

      res.json({ message: "Login bem-sucedido!", accessToken, refreshToken, route: '/', user });
    } catch (err) {
      res.status(500).json({ message: "Erro no servidor!", error: err.message });
    }
  }

  async getUsers(req, res) {
    try {
      const { category } = req.query;
      let filter = {};
      if (category) filter.category = category;

      let existingUsers = await User.find(filter);
      if (existingUsers.length === 0) {
        const groups = ["A", "B", "C"];
        const tags = ["1", "2", "3", "4"];
        const generatedUsers = generateUsers(groups, tags);

        const usersToInsert = Object.values(generatedUsers).flat();
        if (usersToInsert.length > 0) await User.insertMany(usersToInsert);
        existingUsers = await User.find(filter);
      }

      res.status(200).json(existingUsers);
    } catch (err) {
      res.status(500).json({ error: "Erro ao obter os usuários", message: err.message });
    }
  }

  async createUser(req, res) {
    try {
      const { name, email, password, category, className } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({ name, email, password: hashedPassword, category, className, isActive: true });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json({ message: "Erro ao criar usuário", error: err.message });
    }
  }

  async updateUser(req, res) {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: "Erro ao atualizar usuário", error: err.message });
    }
  }

  async updatePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Senha atual incorreta" });

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      await user.save();

      res.json({ message: "Senha alterada com sucesso" });
    } catch (err) {
      res.status(500).json({ message: "Erro ao alterar senha", error: err.message });
    }
  }

  async deleteUser(req, res) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Erro ao excluir usuário", error: err.message });
    }
  }
}

module.exports = new UserController();
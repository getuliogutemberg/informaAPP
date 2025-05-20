"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User")); // Sequelize Model
dotenv_1.default.config({ path: '../../.env' });
class UserController {
    async getUsers(req, res) {
        try {
            const { category } = req.query;
            const where = {};
            if (category)
                where.category = category;
            let existingUsers = await User_1.default.findAll({ where });
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
        }
        catch (err) {
            const error = err;
            return res.status(500).json({
                error: "Erro ao obter os usuários",
                message: error.message,
            });
        }
    }
    async createUser(req, res) {
        try {
            const { id, name, email, password, category, className, position } = req.body;
            const hashedPassword = await bcryptjs_1.default.hash(password, 12);
            const newUser = await User_1.default.create({
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
        }
        catch (err) {
            const error = err;
            return res.status(500).json({
                message: "Erro ao criar usuário",
                error: error.message,
            });
        }
    }
    async updateUser(req, res) {
        try {
            const [affectedRows, [updatedUser]] = await User_1.default.update(req.body, {
                where: { id: req.params.id },
                returning: true,
            });
            if (affectedRows === 0) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
            return res.json(updatedUser);
        }
        catch (err) {
            const error = err;
            return res.status(500).json({
                message: "Erro ao atualizar usuário",
                error: error.message,
            });
        }
    }
    async updatePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await User_1.default.findByPk(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
            const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Senha atual incorreta" });
            }
            const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
            user.password = hashedPassword;
            await user.save();
            return res.json({ message: "Senha alterada com sucesso" });
        }
        catch (err) {
            const error = err;
            return res.status(500).json({
                message: "Erro ao alterar senha",
                error: error.message,
            });
        }
    }
    async deleteUser(req, res) {
        try {
            const deletedUser = await User_1.default.destroy({
                where: { id: req.params.id },
            });
            if (deletedUser === 0) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
            return res.status(204).send();
        }
        catch (err) {
            const error = err;
            return res.status(500).json({
                message: "Erro ao excluir usuário",
                error: error.message,
            });
        }
    }
}
exports.default = new UserController();

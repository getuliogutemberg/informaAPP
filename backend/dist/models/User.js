"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database")); // Ajuste o caminho conforme necessário
// Classe User
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    RG: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    className: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    refreshToken: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true, // Permite null
    },
    position: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.FLOAT), // FLOAT para números decimais
        defaultValue: [0, 0]
    },
    customIcon: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 'https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent.png'
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: ''
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    jwtSecret: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize: database_1.default,
    modelName: 'User',
    tableName: 'users',
    schema: 'internal',
    timestamps: true
});
exports.default = User;

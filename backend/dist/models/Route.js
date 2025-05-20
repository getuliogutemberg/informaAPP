"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database")); // Adjust path if necessary
class Route extends sequelize_1.Model {
}
Route.init({
    id: {
        type: sequelize_1.DataTypes.UUID, // ou outro tipo que estiver usando
        primaryKey: true, // <<-- ESSENCIAL
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
    },
    path: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true // Added unique constraint based on Mongoose schema
    },
    component: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    requiredRole: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        defaultValue: []
    },
    pageId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    reportId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    workspaceId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    icon: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    }
}, {
    sequelize: database_1.default,
    modelName: 'Route',
    tableName: 'routes',
    schema: 'internal',
    timestamps: true,
});
exports.default = Route;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("./config/database"));
const env = (process.env.NODE_ENV || 'development');
const cfg = database_1.default[env];
// Cria a instância com base na config
const sequelize = new sequelize_1.Sequelize(cfg.database, cfg.username, cfg.password, {
    host: cfg.host,
    dialect: cfg.dialect,
    logging: cfg.logging,
    dialectOptions: cfg.dialectOptions,
    pool: cfg.pool,
});
exports.default = sequelize;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (user) => {
    // console.log(user.jwtSecret)
    if (!user.jwtSecret) {
        // throw new Error("jwtSecret do usuário não está definido");
        user.jwtSecret = '123456789';
    }
    const payload = {
        id: user.id,
        category: user.category,
        className: user.className,
    };
    return jsonwebtoken_1.default.sign(payload, user.jwtSecret, { expiresIn: "15m" });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    // console.log(user)
    if (!user.jwtSecret) {
        throw new Error("jwtSecret do usuário não está definido");
    }
    const payload = {
        id: user.id,
    };
    return jsonwebtoken_1.default.sign(payload, user.jwtSecret, { expiresIn: "7d" });
};
exports.generateRefreshToken = generateRefreshToken;

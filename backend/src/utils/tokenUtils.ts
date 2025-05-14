import jwt from "jsonwebtoken";
import crypto from "crypto";
import { IUser } from "../models/User";

// Interface para o payload do token de acesso
interface AccessTokenPayload {
  id: string;
  category: string;
  className: string;
}

// Interface para o payload do refresh token
interface RefreshTokenPayload {
  id: string;
}

// Extendendo a interface IUser para garantir que _id existe
interface UserWithId extends IUser {
  _id: any;
}

// Função para gerar token de acesso
export const generateAccessToken = (user: UserWithId): string => {

  if (!user.jwtSecret){
    const jwtSecret = crypto.randomBytes(32).toString("hex");
    user.jwtSecret = jwtSecret;
  }

  // Convertendo _id para string (funciona para ObjectId e string)
  const userId = user._id.toString ? user._id.toString() : String(user._id);

  const payload: AccessTokenPayload = {
    id: userId,
    category: user.category,
    className: user.className
  };

  return jwt.sign(payload, user.jwtSecret, { expiresIn: "15m" });
};

// Função para gerar refresh token
export const generateRefreshToken = (user: UserWithId): string => {
  if (!user.jwtSecret) {
    throw new Error("jwtSecret do usuário não está definido");
  }

  const userId = user._id.toString ? user._id.toString() : String(user._id);

  const payload: RefreshTokenPayload = {
    id: userId
  };

  return jwt.sign(payload, user.jwtSecret, { expiresIn: "7d" });
};

export default {
  generateAccessToken,
  generateRefreshToken
};
import jwt from "jsonwebtoken";
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
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET não está definido no ambiente");
  }

  // Convertendo _id para string (funciona para ObjectId e string)
  const userId = user._id.toString ? user._id.toString() : String(user._id);

  const payload: AccessTokenPayload = {
    id: userId,
    category: user.category,
    className: user.className
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
};

// Função para gerar refresh token
export const generateRefreshToken = (user: UserWithId): string => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET não está definido no ambiente");
  }

  const userId = user._id.toString ? user._id.toString() : String(user._id);

  const payload: RefreshTokenPayload = {
    id: userId
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export default {
  generateAccessToken,
  generateRefreshToken
};
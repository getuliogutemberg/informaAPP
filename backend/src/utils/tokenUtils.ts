import jwt from "jsonwebtoken";
import { IUserAttributes } from "../models/User";
import crypto from "crypto";
import User from "../models/User";
import { or } from "sequelize";

// Interface para o payload do token de acesso
interface AccessTokenPayload {
  id: string;
  category?: string;
  className?: string;
}

// Função para gerar uma chave JWT única para o usuário
export const generateUserJWTSecret = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Função para garantir que o usuário tenha uma chave JWT
const ensureUserJWTSecret = async (user: IUserAttributes): Promise<string> => {
  if (!user.jwtSecret || user.jwtSecret == "123456789") {
    const newSecret = generateUserJWTSecret();
    await User.update({ jwtSecret: newSecret }, { where: { id: user.id } });
    return newSecret;
  }

  return user.jwtSecret;
};

// Função para gerar token de acesso
export const generateAccessToken = async (user: IUserAttributes): Promise<string> => {
  const secret = await ensureUserJWTSecret(user);

  const payload: AccessTokenPayload = {
    id: String(user.id),
    ...(user.category && { category: user.category }),
    ...(user.className && { className: user.className })
  };

  return jwt.sign(
    payload,
    secret,
    { expiresIn: "1m" }
  );
};

// Função para gerar token de refresh
export const generateRefreshToken = async (user: IUserAttributes): Promise<string> => {
  const secret = await ensureUserJWTSecret(user);

  return jwt.sign(
    { id: user.id },
    secret,
    { expiresIn: "7d" }
  );
};
import jwt from "jsonwebtoken";
import { IUserAttributes } from "../models/User";

// Payload do access token
interface AccessTokenPayload {
  id: string;
  category: string;
  className: string;
}

// Payload do refresh token
interface RefreshTokenPayload {
  id: string;
}

export const generateAccessToken = (user: IUserAttributes): string => {
  // console.log(user.jwtSecret)
  if (!user.jwtSecret) {
    // throw new Error("jwtSecret do usuário não está definido");
    user.jwtSecret = '123456789';
  }

  const payload: AccessTokenPayload = {
    id: user.id,
    category: user.category,
    className: user.className,
  };

  return jwt.sign(payload, user.jwtSecret, { expiresIn: "15m" });
};

export const generateRefreshToken = (user: IUserAttributes): string => {
  // console.log(user)
  if (!user.jwtSecret) {
    throw new Error("jwtSecret do usuário não está definido");
  }

  const payload: RefreshTokenPayload = {
    id: user.id,
  };

  return jwt.sign(payload, user.jwtSecret, { expiresIn: "7d" });
};

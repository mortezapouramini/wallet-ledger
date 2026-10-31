import { Response } from "express";
import jwt from "jsonwebtoken";
import { authConfig } from "../configs/auth.config";

type JwtPayload = {
  id: string;
  email: string;
};

export const signAccessToken = (data: JwtPayload): string =>
  jwt.sign(data, authConfig.jwtSecret, {
    algorithm: "HS256",
    expiresIn: authConfig.accessTokenTtlSeconds,
  });

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie(authConfig.cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: authConfig.accessTokenTtlSeconds * 1000,
  });
};

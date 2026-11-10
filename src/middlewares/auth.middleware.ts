import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { authConfig } from "../configs/auth.config";
import { AccessToken } from "../modules/users/types";
import { appError } from "./errorHandler.middleware";

export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const accessToken: AccessToken | unknown = req.cookies[authConfig.cookieName];
  if (!accessToken || typeof accessToken !== "string") {
    return next(appError("Invalid token", 401));
  }
  try {
    const decoded = jwt.verify(accessToken, authConfig.jwtSecret, {
      algorithms: ["HS256"],
    });

    if (typeof decoded === "string" || !decoded.id) {
      return next(appError("Invalid token", 401));
    }

    req.user = {
      id: decoded.id,
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(appError("Token expired", 401));
    }
    if (error instanceof JsonWebTokenError) {
      return next(appError("Invalid token", 401));
    }
  }
};

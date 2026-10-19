import type { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../types/index";

export class AppError extends Error {
  public readonly code: number;
  public details?: Record<string, unknown>;

  constructor(
    message: string,
    code: number,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "AppError";
    this.code =
      Number.isInteger(code) && code >= 400 && code < 600 ? code : 500;
    this.details = details;
  }
}

export const appError = (
  message: string,
  code: number,
  details?: Record<string, unknown>,
) => {
  return new AppError(message, code, details);
};

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) return next(error);

  if (error instanceof AppError) {
    const response: ErrorResponse = {
      success: false,
      body: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    };
    return res.status(error.code).json(response);
  }

  console.error(error);
  const response: ErrorResponse = {
    success: false,
    body: { code: 500, message: "Internal server error" },
  };
  res.status(500).json(response);
};

import type { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../types/index";

interface BodyParserError extends Error {
  status: number;
  type: string;
}

const isBodyParserError = (error: unknown): error is BodyParserError =>
  error instanceof Error &&
  "status" in error &&
  typeof error.status === "number" &&
  "type" in error &&
  typeof error.type === "string";

const bodyParserMessages: Record<string, string> = {
  "entity.parse.failed": "Malformed JSON body",
  "entity.too.large": "Request body too large",
  "charset.unsupported": "Unsupported charset",
  "encoding.unsupported": "Unsupported content encoding",
  "request.size.invalid": "Invalid request size",
  "request.aborted": "Request aborted",
};

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

  if (
    isBodyParserError(error) &&
    Object.hasOwn(bodyParserMessages, error.type) &&
    error.status >= 400 &&
    error.status < 500
  ) {
    const response: ErrorResponse = {
      success: false,
      body: {
        code: error.status,
        message: bodyParserMessages[error.type],
      },
    };
    return res.status(error.status).json(response);
  }

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

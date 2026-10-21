import type { NextFunction, Request, Response } from "express";
import z from "zod";
import { appError } from "./errorHandler.middleware";
export const validateBody =
  (schema: z.ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (result.error) {
      throw appError("Validation failed", 422, z.flattenError(result.error));
    }
    req.body = result.data;
    next();
  };

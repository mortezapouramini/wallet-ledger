import type { Response } from "express";
import type { SuccessResponse } from "../types";

export function sendSuccess<T>(
  res: Response<SuccessResponse<T>>,
  data: T,
  status: 200 | 201,
) {
  res.status(status).json({ success: true, data });
}

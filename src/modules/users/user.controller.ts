import type { Request, Response } from "express";
import type { NewUser, User, VerifyCode } from "./types";
import { registerUserService, verifyEmailService } from "./user.service";
import { SuccessResponse } from "../../types/index";
import { sendSuccess } from "../../shared/respond.shared";

export const registerUser = async (
  req: Request<{}, {}, NewUser>,
  res: Response<SuccessResponse<VerifyCode>>,
) => {
  const verifyCode = 123
  sendSuccess(res, verifyCode, 201);
};

const verifyEmail = async (req: Request, res: Response) => {
  const newUser = await verifyEmailService(req.body);
  sendSuccess(res, newUser, 201);
};

import type { Request, Response } from "express";
import type { RegisterInput, User, VerifyEmailInput } from "./types";
import { registerUserService, verifyEmailService } from "./user.service";
import { SuccessResponse } from "../../types/index";
import { sendSuccess } from "../../shared/respond.shared";

export const registerUser = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response<SuccessResponse<string>>,
) => {
  await registerUserService(req.body);
  sendSuccess(
    res,
    `We have sent a verify link to ${req.body.email} `,
    200,
  );
};

export const verifyEmail = async (
  req: Request<{}, {}, VerifyEmailInput>,
  res: Response<SuccessResponse<User>>,
) => {
  const newUser = await verifyEmailService(req.body);
  sendSuccess(res, newUser, 201);
};

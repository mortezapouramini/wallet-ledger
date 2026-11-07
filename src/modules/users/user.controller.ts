import type { Request, Response } from "express";
import type {
  LoginInput,
  RegisterInput,
  User,
  VerifyEmailInput,
} from "./types";
import {
  loginUserService,
  registerUserService,
  verifyEmailService,
} from "./user.service";
import { SuccessResponse } from "../../types/index";
import { sendSuccess } from "../../shared/respond.shared";
import { setAuthCookie, signAccessToken } from "../../shared/auth.shared";

export const registerUser = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response<SuccessResponse<string>>,
) => {
  await registerUserService(req.body);
  sendSuccess(res, `We have sent a verify link to ${req.body.email} `, 200);
};

export const verifyEmail = async (
  req: Request<{}, {}, VerifyEmailInput>,
  res: Response<SuccessResponse<User>>,
) => {
  const newUser = await verifyEmailService(req.body);
  setAuthCookie(res, signAccessToken({ id: newUser.id, email: newUser.email }));
  sendSuccess(res, newUser, 201);
};

export const loginUser = async (
  req: Request<{}, {}, LoginInput>,
  res: Response<SuccessResponse<User>>,
) => {
  const { user, accessToken } = await loginUserService(req.body);
  setAuthCookie(res, accessToken);
  sendSuccess(res, user, 200);
};

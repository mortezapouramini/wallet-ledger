import type { CookieOptions, Request, Response } from "express";
import type { NewUser, User, VerifyCode } from "./types";
import { registerUserService, verifyEmailService } from "./user.service";
import { SuccessResponse } from "../../types/index";
import { sendSuccess } from "../../shared/respond.shared";

export const registerUser = async (
  req: Request<{}, {}, NewUser>,
  res: Response<SuccessResponse<string>>,
) => {
  const pendingUserUUID = await registerUserService(req.body);
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 5 * 60 * 1000,
    path: "/api/v1/users/verify-email",
  };
  res.cookie("pendingUserUUID", pendingUserUUID, cookieOptions);
  sendSuccess(
    res,
    `We have sent a verification code to ${req.body.email}`,
    200,
  );
};

export const verifyEmail = async (
  req: Request<{}, {}, Record<string, VerifyCode>>,
  res: Response<SuccessResponse<User>>,
) => {
  const { verifyCode } = req.body;
  const { pendingUserUUID } = req.cookies;
  const newUser = await verifyEmailService(verifyCode, pendingUserUUID);
  sendSuccess(res, newUser, 201);
};

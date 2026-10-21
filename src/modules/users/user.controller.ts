import type { Request, Response } from "express";
import type { NewUser, User } from "./types";
import { registerUserService } from "./user.service";
import { SuccessResponse } from "../../types/index";
import { sendSuccess } from "../../shared/respond.shared";

export const registerUser = async (
  req: Request<{}, {}, NewUser>,
  res: Response<SuccessResponse<User>>,
) => {
  const newUser = await registerUserService(req.body);
  sendSuccess(res, newUser, 201);
};

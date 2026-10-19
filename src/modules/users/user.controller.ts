import { NextFunction, Request, Response } from "express";
import { registerUserService } from "./user.service";
import { NewUser, User } from "./types";

export const registerUser = async (
  req: Request<{},{}, NewUser>,
  res: Response<User>,
  next: NextFunction,
) => {
    // Validate the request body
  try {
    const newUser = await registerUserService(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

import type { Router } from "express";
import express from "express";
import { loginUser, registerUser, verifyEmail } from "./user.controller";
import { validateBody } from "../../middlewares/validator.middleware";
import {
  loginUserSchema,
  registerUserSchema,
  verifyEmailSchema,
} from "./user.schema";
export const userRoutes: Router = express.Router();

userRoutes
  .post("/register", validateBody(registerUserSchema), registerUser)
  .post("/verify-email", validateBody(verifyEmailSchema), verifyEmail)
  .post("/login", validateBody(loginUserSchema), loginUser);

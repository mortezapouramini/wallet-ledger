import type { Router } from "express";
import express from "express";
import { registerUser, verifyEmail } from "./user.controller";
import { validateBody } from "../../middlewares/validator.middleware";
import { registerUserSchema, verifyEmailSchema } from "./user.schema";
export const userRoutes: Router = express.Router();

userRoutes
  .post("/register", validateBody(registerUserSchema), registerUser)
  .post("/verify-email", validateBody(verifyEmailSchema), verifyEmail);

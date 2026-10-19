import type { Router } from "express";
import express from "express";
import { registerUser } from "./user.controller";
export const userRoutes: Router = express.Router();

userRoutes.post("/register", registerUser);

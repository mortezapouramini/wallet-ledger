import z from "zod";
import { registerUserSchema } from "./user.schema";

export type NewUser = z.infer<typeof registerUserSchema>;

export interface NewUserRecord {
  name: string;
  email: string;
  passwordHash: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CatchPendingUserData{
  name: string;
  email: string;
  passwordHash: string;
  verifyCode: number;
  attempts: string;
}

export type VerifyCode = number;
export type PendingUUID = string;

import z from "zod";
import { pendingUserSchema, registerUserSchema } from "./user.schema";

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



export type PendingUserRecord = z.infer<typeof pendingUserSchema>;

export type VerifyCode = number;
export type PendingUUID = string;

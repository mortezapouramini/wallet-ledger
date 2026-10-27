import z from "zod";
import { pendingUserSchema, registerUserSchema, verifyEmailSchema } from "./user.schema";


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
export type RegisterInput = z.infer<typeof registerUserSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type PendingUserRecord = z.infer<typeof pendingUserSchema>;


import z from "zod";
import {
  loginUserSchema,
  pendingUserSchema,
  registerUserSchema,
  verifyEmailSchema,
} from "./user.schema";

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
export interface UserWithPassword extends User {
  passwordHash: string;
}
export type AccessToken = string;
export type UserWithToken = {
  user : User;
  accessToken: AccessToken;
};
export type RegisterInput = z.infer<typeof registerUserSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type PendingUserRecord = z.infer<typeof pendingUserSchema>;
export type LoginInput = z.infer<typeof loginUserSchema>;

import argon2 from "argon2";
import { appError } from "../../middlewares/errorHandler.middleware";
import type { NewUser, User } from "./types";
import { createUser, findUserByEmail } from "./user.repository";

export const registerUserService = async (userData: NewUser): Promise<User> => {
  const existingUser = await findUserByEmail(userData.email);
  if (existingUser) {
    throw appError("Invalid credentials", 400);
  }

  const passwordHash = await argon2.hash(userData.password);

  const newUser = await createUser({ ...userData, password: passwordHash });
  return newUser;
};

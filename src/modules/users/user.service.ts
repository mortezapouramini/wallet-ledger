import argon2 from "argon2";
import { appError } from "../../middlewares/errorHandler.middleware";
import type { NewUser, User } from "./types";
import { createUser } from "./user.repository";
import { DatabaseError } from "pg";

export const registerUserService = async (userData: NewUser): Promise<User> => {
  const passwordHash = await argon2.hash(userData.password);
  try {
    return await createUser({ ...userData, password: passwordHash });
  } catch (error) {
    if (error instanceof DatabaseError && error.code === "23505") {
      throw appError("Invalid credentials", 409);
    }
    throw error;
  }
};

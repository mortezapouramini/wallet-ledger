import argon2 from "argon2";
import { appError } from "../../middlewares/errorHandler.middleware";
import type { NewUser, User } from "./types";
import { createUser, findUserByEmail } from "./user.repository";
import { DatabaseError } from "pg";

export const registerUserService = async (userData: NewUser): Promise<User | undefined> => {
  const passwordHash = await argon2.hash(userData.password);
  try {
    const newUser = await createUser({ ...userData, password: passwordHash });
    return newUser;
  } catch (error) {
    if (error instanceof DatabaseError && error.code === "23505") {
      throw appError("Invalid credentials", 409);
    }
  }
};

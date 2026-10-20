import argon2 from "argon2";
import type { NewUser, User } from "./types";
import { createUser } from "./user.repository";

export const registerUserService = async (userData: NewUser): Promise<User> => {
  const passwordHash = await argon2.hash(userData.password);
  return await createUser({ ...userData, password: passwordHash });
};

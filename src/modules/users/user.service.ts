import type { NewUser, User } from "./types";
import argon2 from "argon2";
import { createAccount, createUser } from "./user.repository";
import { withTransaction } from "../../configs/database.config";

export const registerUserService = async (userData: NewUser): Promise<User> => {
  const passwordHash = await argon2.hash(userData.password);
  return withTransaction(async (client) => {
    const user = await createUser(client, {
      name: userData.name,
      email: userData.email,
      passwordHash,
    });
    await createAccount(client, user.id);
    return user;
  });
};

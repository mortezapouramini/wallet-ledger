import type { NewUser, PendingUUID, User, VerifyCode } from "./types";
import argon2 from "argon2";
import { createAccount, createUser, findUserByEmail } from "./user.repository";
import { withTransaction } from "../../configs/database.config";
import { appError } from "../../middlewares/errorHandler.middleware";
import { redis } from "../../configs/redis.config";
import crypto from "crypto";
import { sendMail } from "../../configs/mail.config";

export const registerUserService = async (
  userData: NewUser,
): Promise<PendingUUID> => {
  const user = await findUserByEmail(userData.email);
  if (user) {
    throw appError("Email is already exists", 400);
  }
  const existUUID = await redis.get(`pending:email:${userData.email}`);
  if (existUUID) {
    return existUUID;
  }

  const passwordHash = await argon2.hash(userData.password);
  const pendingUserUUID = crypto.randomUUID();
  const verifyCode = crypto.randomInt(90000) + 10000;

  const catchUserData = {
    name: userData.name,
    email: userData.email,
    passwordHash,
    verifyCode,
    attempts: "0",
  };

  await redis.hSet(`pending:${pendingUserUUID}`, catchUserData);
  await redis.expire(`pending:${pendingUserUUID}`, 5 * 60);
  await redis.set(`pending:email:${userData.email}`, pendingUserUUID, {
    expiration: { type: "EX", value: 5 * 60 },
  });

  await sendMail(userData.email, "Verify code", verifyCode.toString());

  return pendingUserUUID;
};

export const verifyEmailService = async (
  verifyCode: VerifyCode,
  pendingUserUUID: PendingUUID,
): Promise<User> => {
  const pendingUser = await redis.hGetAll(`pending:${pendingUserUUID}`);
  if (Object.keys(pendingUser).length === 0) {
    throw appError("Registeration timeout", 404);
  }
  if (Number(verifyCode) !== Number(pendingUser.verifyCode)) {
    if (Number(pendingUser.attempts) >= 3) {
      await redis.del(`pending:${pendingUserUUID}`);
      await redis.del(`pending:email:${pendingUser.email}`);
      throw appError("Too many requests", 429);
    }
    await redis.hIncrBy(`pending:${pendingUserUUID}`, "attempts", 1);
    throw appError("Invalid verification code", 400);
  }
  return withTransaction(async (client) => {
    const user = await createUser(client, {
      name: pendingUser.name,
      email: pendingUser.email,
      passwordHash: pendingUser.passwordHash,
    });
    await createAccount(client, user.id);
    return user;
  });
};

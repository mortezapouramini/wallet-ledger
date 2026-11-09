import type {
  AccessToken,
  LoginInput,
  PendingUserRecord,
  RegisterInput,
  User,
  UserWithToken,
  VerifyEmailInput,
} from "./types";
import argon2 from "argon2";
import {
  createAccount,
  createUser,
  findUserByEmail,
  findUserWithPasswordByEmail,
} from "./user.repository";
import { withTransaction } from "../../configs/database.config";
import { appError } from "../../middlewares/errorHandler.middleware";
import { redis } from "../../configs/redis.config";
import crypto from "crypto";
import { pendingUserSchema } from "./user.schema";
import { emailQueue } from "../../queues/email.queue";
import { signAccessToken } from "../../shared/auth.shared";

const PENDING_TTL_SECONDS = 15 * 60;
const SEND_LIMIT_WINDOW_SECONDS = 60 * 60;
const MAX_SENDS_PER_WINDOW = 5;

const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");
const pendingKey = (token: string) => `pending:token:${hashToken(token)}`;
const sendCountKey = (email: string) => `pending:sends:${email}`;

export const registerUserService = async (
  userData: RegisterInput,
): Promise<void> => {
  const user = await findUserByEmail(userData.email);
  if (user) {
    throw appError("Email already exists", 409);
  }
  const [, sends] = await redis
    .multi()
    .set(sendCountKey(userData.email), "0", {
      condition: "NX",
      expiration: { type: "EX", value: SEND_LIMIT_WINDOW_SECONDS },
    })
    .incr(sendCountKey(userData.email))
    .exec();
  if (Number(sends) > MAX_SENDS_PER_WINDOW) {
    throw appError(
      "Too many verification emails requested. Try again later",
      429,
    );
  }

  const token = crypto.randomBytes(32).toString("base64url");
  const record: PendingUserRecord = {
    name: userData.name,
    email: userData.email,
  };
  const key = pendingKey(token);
  await redis.multi().hSet(key, record).expire(key, PENDING_TTL_SECONDS).exec();

  const link = `${process.env.APP_URL}/verify-email?token=${token}`;

  try {
    await emailQueue.add("verify-email", { email: userData.email, link });
  } catch (error) {
    await redis.del(key);
    throw error;
  }
};

export const verifyEmailService = async (
  input: VerifyEmailInput,
): Promise<User> => {
  const key = pendingKey(input.token);
  const [data] = await redis.multi().hGetAll(key).del(key).exec();
  const parsed = pendingUserSchema.safeParse(data);
  if (!parsed.success) {
    throw appError("Invalid or expired link", 400);
  }
  const pendingUser = parsed.data;
  const passwordHash = await argon2.hash(input.password);

  return withTransaction(async (client) => {
    const user = await createUser(client, {
      name: pendingUser.name,
      email: pendingUser.email,
      passwordHash,
    });
    await createAccount(client, user.id);
    return user;
  });
};

const dummyHash = argon2.hash(crypto.randomBytes(16).toString("hex"));

export const loginUserService = async (
  userData: LoginInput,
): Promise<UserWithToken> => {
  const row = await findUserWithPasswordByEmail(userData.email);
  if (!row) {
    await argon2.verify(await dummyHash, userData.password); // Prevent timing attacks
    throw appError("Invalid email or password", 401);
  }
  const { passwordHash, ...user } = row;

  const isValidPassword = await argon2.verify(passwordHash, userData.password);
  if (!isValidPassword) throw appError("Invalid email or password", 401);
  const accessToken = signAccessToken({ id: user.id});
  return { user, accessToken };
};

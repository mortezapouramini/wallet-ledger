import type { PoolClient } from "pg";
import type { NewUserRecord, User } from "./types";
import { DatabaseError } from "pg";
import { databasePool } from "../../configs/database.config";
import { appError } from "../../middlewares/errorHandler.middleware";

export const createUser = async (
  client: PoolClient,
  userData: NewUserRecord,
): Promise<User> => {
  try {
    const newUserResult = await client.query<User>(
      `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email`,
      [userData.name, userData.email, userData.passwordHash],
    );
    return newUserResult.rows[0];
  } catch (error) {
    if (
      error instanceof DatabaseError &&
      error.code === "23505" &&
      error.constraint === "users_email_key"
    ) {
      throw appError("Email already in use", 409);
    }
    throw error;
  }
};

export const createAccount = async (
  client: PoolClient,
  userId: string,
): Promise<void> => {
  await client.query(
    `INSERT INTO accounts (user_id, owner_type , label) VALUES ($1, $2, $3) `,
    [userId, "user", "main"],
  );
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await databasePool.query<User>(
    `SELECT id, name, email FROM users WHERE email = $1`,
    [email],
  );
  return result.rows[0] || null;
};

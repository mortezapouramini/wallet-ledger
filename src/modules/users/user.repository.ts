import { databasePool } from "../../configs/database.config";
import { NewUser, User } from "./types";

export const createUser = async (userData: NewUser): Promise<User> => {
  const result = await databasePool.query(
    `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email`,
    [userData.name, userData.email, userData.password],
  );
  return result.rows[0];
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await databasePool.query<User>(
    `SELECT id, name, email FROM users WHERE email = $1`,
    [email],
  );
  return result.rows[0] || null;
};

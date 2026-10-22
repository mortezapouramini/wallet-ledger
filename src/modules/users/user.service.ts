import type { NewUser, User, VerifyCode } from "./types";
import argon2 from "argon2";
import { createAccount, createUser } from "./user.repository";
import { withTransaction } from "../../configs/database.config";

export const registerUserService = async (userData: NewUser): Promise<VerifyCode> => {
  /**
   * check userExists if not => contniue
   * hashing password
   * create verifyCode
   * save VerifyCode and userData with passwordHash in redis
   * return verifyCode
   */
  const passwordHash = await argon2.hash(userData.password);

  return 123
};

export const verifyEmailService = async (verifyCode : VerifyCode) => {
  /**
   * get verifyCode from redis
   * check stored verifyCode in redis isEqual to sended code if yes continue else increment attempts
   * get userData from redis
   * save in database with transaction
   */
  const userData : NewUser = {name : 'g', email : 'g' , password : 'g'}
  const passwordHash = 'g'
  return withTransaction(async (client) => {
    const user = await createUser(client, {
      name: userData.name,
      email: userData.email,
      passwordHash,
    });
    await createAccount(client, user.id);
    return user;
  });
} 
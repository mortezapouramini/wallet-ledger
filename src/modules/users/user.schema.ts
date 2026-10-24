import z from "zod";
export const registerUserSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(8).max(128),
});


export const pendingUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  passwordHash: z.string(),
  verifyCode: z.string(),
  attempts: z.string(),
});
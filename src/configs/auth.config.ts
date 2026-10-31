const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be set and at least 32 characters long");
}

export const authConfig = {
  jwtSecret,
  accessTokenTtlSeconds: Number(process.env.JWT_EXPIRES_IN_SECONDS) || 60 * 60,
  cookieName: "access_token",
};
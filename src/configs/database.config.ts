import { Pool } from "pg";
import type { PoolClient } from "pg";

export const databasePool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

databasePool.on("connect", () => {
  console.log("Database connected successfully");
});
databasePool.on("error", (err) => {
  console.error("Database error:", err);
});

export const withTransaction = async <T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> => {
  const client = await databasePool.connect();
  let discardClient = false;
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      discardClient = true;
      console.error("ROLLBACK failed:", rollbackError);
    }
    throw error;
  } finally {
    client.release(discardClient);
  }
};

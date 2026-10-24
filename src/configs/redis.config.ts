import { createClient } from "redis";

export const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    connectTimeout: 5000,
    reconnectStrategy(retries, cause) {
      const delay = Math.min(retries * 200, 3000);

      console.warn(`Redis reconnect attempt ${retries}: ${cause.message}`);

      return delay;
    },
  },
});

redis.on("error", (err) => {
  console.log(`Redis client error : ${err}`);
});

redis.on("ready", () => {
  console.log(`Redis is ready`);
});
redis.on("reconnecting", () => {
  console.log(`Redis is reconnecting`);
});

export const connectRedis = async (): Promise<void> => {
  if (redis.isOpen) return;
  await redis.connect();
};

export const disconnectRedis = async (): Promise<void> => {
  if (redis.isOpen) {
    await redis.close();
  }
};

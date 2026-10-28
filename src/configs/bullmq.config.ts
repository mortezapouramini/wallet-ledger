import { createNodeRedisClient } from "bullmq";
import { redis } from "./redis.config";

export const redisConnection = createNodeRedisClient(redis);

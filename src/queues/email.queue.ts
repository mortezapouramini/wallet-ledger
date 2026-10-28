import { Queue } from "bullmq";
import { redisConnection } from "../configs/bullmq.config";
import { VerifyEmailJobData } from "../types/jobs.types";

export const emailQueue = new Queue<VerifyEmailJobData, void, "verify-email">(
  "emails",
  {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: 5,
      backoff: { type: "exponential", delay: 1000 },
      delay: 2000,
      removeOnComplete: 1000,
      removeOnFail: 1000,
    },
  },
);

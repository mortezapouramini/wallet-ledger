import { Worker } from "bullmq";
import { sendMail } from "../configs/mail.config";
import { VerifyEmailJobData } from "../types/jobs.types";
import { redisConnection } from "../configs/bullmq.config";

const verifyEmailMessage = (link: string) =>
  `Open this link to verify your email and choose a password:\n${link}\n\nIf you did not request this, ignore this email.`;

export const verifyEmailWorker = new Worker<
  VerifyEmailJobData,
  void,
  "verify-email"
>(
  "emails",
  async (job) => {
    await sendMail(
      job.data.email,
      "Verify your email",
      verifyEmailMessage(job.data.link),
    );
    console.log(`Verify link sent to ${job.data.email}`);
  },
  {
    connection: redisConnection,
    concurrency: 5,
  },
);

verifyEmailWorker.on("active", (job) => {
  console.log(`Job ${job.name} is activated`);
});
verifyEmailWorker.on("completed", (job) => {
  console.log(`Job ${job.name} with ID : ${job.id} is completed`);
});
verifyEmailWorker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed:`, error);
});
verifyEmailWorker.on("error", (error) => {
  console.error("Email worker error:", error);
});

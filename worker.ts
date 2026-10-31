import "dotenv/config";
import { connectRedis, disconnectRedis } from "./src/configs/redis.config";
import { verifyEmailWorker } from "./src/workers/email.worker";

async function startWorkers() {
  await connectRedis();
  await verifyEmailWorker.waitUntilReady();
  console.log("Workers is ready");
}

const shutdown = async (signal: string) => {
  console.log(`${signal} received, closing worker...`);
  await verifyEmailWorker.close();
  await disconnectRedis();
  process.exit(0);
};
process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

startWorkers().catch(console.error);

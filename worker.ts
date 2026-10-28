import "dotenv/config";
import { connectRedis } from "./src/configs/redis.config";
import { verifyEmailWorker } from "./src/workers/email.worker";

async function startWorkers() {
  await connectRedis();
  await verifyEmailWorker.waitUntilReady();
  console.log("Workers is ready");
}

startWorkers().catch(console.error);

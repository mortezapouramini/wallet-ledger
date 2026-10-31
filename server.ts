import "dotenv/config";
import { app } from "./app";
import { connectRedis, disconnectRedis } from "./src/configs/redis.config";
import { emailQueue } from "./src/queues/email.queue";
import { databasePool } from "./src/configs/database.config";


const port = process.env.SERVER_PORT || 8000;
const main = async () => {
  await connectRedis();

  const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });

  let shutingDown = false;
  const shutDown = (signal: string) => {
    if (shutingDown) return;

    shutingDown = true;
    console.log(`${signal} received, shutting down...`);

    setTimeout(() => {
      console.error("Shutdown timed out, forcing exit");
      process.exit(1);
    }, 10_000).unref();

    const idleSweep = setInterval(() => {
      server.closeIdleConnections();
    }, 200);

    server.close(async (error) => {
      clearInterval(idleSweep);
      try {
        await emailQueue.close();
        await databasePool.end();
        await disconnectRedis();
      } finally {
        console.log("Shutdown complete");
        process.exit(error ? 1 : 0);
      }
    });
  };
  process.on("SIGINT", () => shutDown("SIGINT"));
  process.on("SIGTERM", () => shutDown("SIGTERM"));
};

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

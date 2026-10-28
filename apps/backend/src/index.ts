import "dotenv/config";
import "./types/express";
import app from "./app";
import { env } from "./config/env";
import { assertSafeProductionSecrets } from "./config/productionSecrets";
import { logger } from "./lib/logger";
import { connectPrisma, disconnectPrisma } from "./lib/prisma";
import { registerHandlers } from "./lib/registerHandlers";
import { runGracefulShutdown } from "./lib/shutdown";

const start = async () => {
  assertSafeProductionSecrets({
    nodeEnv: process.env.NODE_ENV,
    jwtSecret: env.jwtSecret,
  });

  await connectPrisma();
  registerHandlers();

  const server = app.listen(env.port, () => {
    logger.info("Server running", { port: env.port });
  });

  let shuttingDown = false;

  const shutdown = async (signal: string) => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;

    await runGracefulShutdown({
      signal,
      server,
      disconnect: disconnectPrisma,
      exit: (code) => process.exit(code),
    });
  };

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
};

void start();

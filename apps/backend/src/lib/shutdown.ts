import { logger } from "./logger";

/** Stay under Render's ~30s SIGTERM window. */
export const SHUTDOWN_TIMEOUT_MS = 10_000;

export type HttpServerLike = {
  close: (callback?: (err?: Error) => void) => void;
};

export const closeHttpServer = (
  server: HttpServerLike,
  timeoutMs = SHUTDOWN_TIMEOUT_MS,
): Promise<"closed" | "timeout"> => {
  return new Promise((resolve) => {
    let settled = false;

    const finish = (result: "closed" | "timeout") => {
      if (settled) {
        return;
      }
      settled = true;
      resolve(result);
    };

    const timer = setTimeout(() => {
      finish("timeout");
    }, timeoutMs);

    server.close((err) => {
      clearTimeout(timer);
      if (err) {
        logger.error("HTTP server close failed", { err });
      }
      finish("closed");
    });
  });
};

export const runGracefulShutdown = async (options: {
  signal: string;
  server: HttpServerLike;
  disconnect: () => Promise<void>;
  exit: (code: number) => void;
  timeoutMs?: number;
}): Promise<void> => {
  const { signal, server, disconnect, exit, timeoutMs } = options;

  logger.info("Shutting down", { signal });

  const closeResult = await closeHttpServer(server, timeoutMs);
  if (closeResult === "timeout") {
    logger.warn("HTTP server close timed out; continuing shutdown", {
      timeoutMs: timeoutMs ?? SHUTDOWN_TIMEOUT_MS,
    });
  }

  try {
    await disconnect();
  } catch (error) {
    logger.error("Failed to disconnect Prisma", { err: error });
    exit(1);
    return;
  }

  exit(0);
};

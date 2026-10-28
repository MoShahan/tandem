import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

import { logger } from "./logger";
import { closeHttpServer, runGracefulShutdown } from "./shutdown";

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("closeHttpServer", () => {
  it("resolves closed when the close callback runs", async () => {
    const server = {
      close: (callback?: (err?: Error) => void) => {
        callback?.();
      },
    };

    await expect(closeHttpServer(server, 1_000)).resolves.toBe("closed");
  });

  it("resolves timeout when close never calls back", async () => {
    vi.useFakeTimers();
    const server = {
      close: () => undefined,
    };

    const pending = closeHttpServer(server, 1_000);
    await vi.advanceTimersByTimeAsync(1_000);

    await expect(pending).resolves.toBe("timeout");
  });
});

describe("runGracefulShutdown", () => {
  it("waits for close then disconnects Prisma before exit", async () => {
    const order: string[] = [];
    const server = {
      close: (callback?: (err?: Error) => void) => {
        order.push("close");
        callback?.();
      },
    };
    const disconnect = vi.fn(async () => {
      order.push("disconnect");
    });
    const exit = vi.fn((code: number) => {
      order.push(`exit:${code}`);
    });

    await runGracefulShutdown({
      signal: "SIGTERM",
      server,
      disconnect,
      exit,
    });

    expect(logger.info).toHaveBeenCalledWith("Shutting down", {
      signal: "SIGTERM",
    });
    expect(order).toEqual(["close", "disconnect", "exit:0"]);
  });

  it("still disconnects after a close timeout", async () => {
    vi.useFakeTimers();
    const disconnect = vi.fn().mockResolvedValue(undefined);
    const exit = vi.fn();
    const pending = runGracefulShutdown({
      signal: "SIGTERM",
      server: { close: () => undefined },
      disconnect,
      exit,
      timeoutMs: 500,
    });

    await vi.advanceTimersByTimeAsync(500);
    await pending;

    expect(logger.warn).toHaveBeenCalled();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(exit).toHaveBeenCalledWith(0);
  });

  it("exits 1 when Prisma disconnect fails", async () => {
    const exit = vi.fn();

    await runGracefulShutdown({
      signal: "SIGINT",
      server: {
        close: (callback?: (err?: Error) => void) => {
          callback?.();
        },
      },
      disconnect: async () => {
        throw new Error("pool");
      },
      exit,
    });

    expect(exit).toHaveBeenCalledWith(1);
  });
});

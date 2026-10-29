import { describe, expect, it, vi } from "vitest";

import { errorHandler } from "./errorHandler";
import { createAppRateLimiter, writeRateLimiter } from "./rateLimit";
import { AppError } from "../utils/AppError";

import type { NextFunction, Request, Response } from "express";

vi.mock("../lib/logger", () => ({
  logger: {
    error: vi.fn(),
  },
}));

const runLimiter = (
  limiter: ReturnType<typeof createAppRateLimiter>,
  req: Partial<Request>,
) =>
  new Promise<unknown>((resolve) => {
    const headers: Record<string, string> = {};
    const res = {
      setHeader: (name: string, value: string) => {
        headers[name] = value;
        return res;
      },
      getHeader: (name: string) => headers[name],
    } as unknown as Response;

    limiter(req as Request, res, (error?: unknown) => {
      resolve(error);
    });
  });

describe("createAppRateLimiter", () => {
  it("allows requests under the limit and blocks after", async () => {
    const limiter = createAppRateLimiter({
      windowMs: 60_000,
      limit: 2,
      message: "Too many requests. Try again later.",
    });
    const req = { ip: "203.0.113.10", method: "GET" };

    await expect(runLimiter(limiter, req)).resolves.toBeUndefined();
    await expect(runLimiter(limiter, req)).resolves.toBeUndefined();

    const blocked = await runLimiter(limiter, req);
    expect(blocked).toBeInstanceOf(AppError);
    expect((blocked as AppError).statusCode).toBe(429);
    expect((blocked as AppError).code).toBe("TOO_MANY_REQUESTS");
    expect((blocked as AppError).message).toBe(
      "Too many requests. Try again later.",
    );
  });

  it("keys by IP so a second client is not blocked", async () => {
    const limiter = createAppRateLimiter({
      windowMs: 60_000,
      limit: 1,
      message: "Too many requests. Try again later.",
    });

    await expect(
      runLimiter(limiter, { ip: "203.0.113.11", method: "GET" }),
    ).resolves.toBeUndefined();
    await expect(
      runLimiter(limiter, { ip: "203.0.113.12", method: "GET" }),
    ).resolves.toBeUndefined();
  });
});

describe("writeRateLimiter", () => {
  it("does not count GET requests", async () => {
    await expect(
      runLimiter(writeRateLimiter, { ip: "203.0.113.13", method: "GET" }),
    ).resolves.toBeUndefined();
  });
});

describe("errorHandler", () => {
  it("returns 429 with TOO_MANY_REQUESTS", () => {
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    const res = { status, json } as unknown as Response;

    errorHandler(
      AppError.tooManyRequests("Too many requests. Try again later."),
      { path: "/api/v1/leads", method: "GET" } as Request,
      res,
      vi.fn() as NextFunction,
    );

    expect(status).toHaveBeenCalledWith(429);
    expect(json).toHaveBeenCalledWith({
      success: false,
      message: "Too many requests. Try again later.",
      data: { code: "TOO_MANY_REQUESTS", details: undefined },
    });
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../lib/prisma", () => ({
  pingDatabase: vi.fn(),
}));

import { pingDatabase } from "../lib/prisma";
import { mockReq, mockRes } from "../test/helpers";
import { AppError } from "../utils/AppError";

import { getHealth, getHealthReady } from "./health.controller";

import type { NextFunction } from "express";

describe("getHealth", () => {
  it("returns ok without touching the database", () => {
    const { res, json } = mockRes();

    getHealth(mockReq(), res);

    expect(json).toHaveBeenCalledWith({ ok: true });
    expect(pingDatabase).not.toHaveBeenCalled();
  });
});

describe("getHealthReady", () => {
  beforeEach(() => {
    vi.mocked(pingDatabase).mockReset();
  });

  it("returns ok when Postgres answers", async () => {
    vi.mocked(pingDatabase).mockResolvedValue();
    const { res, json } = mockRes();
    const next = vi.fn();

    await getHealthReady(mockReq(), res, next as unknown as NextFunction);

    expect(json).toHaveBeenCalledWith({ ok: true, db: true });
    expect(next).not.toHaveBeenCalled();
  });

  it("forwards 503 when Postgres is down", async () => {
    vi.mocked(pingDatabase).mockRejectedValue(new Error("connect"));
    const { res, json } = mockRes();
    const next = vi.fn();

    await getHealthReady(mockReq(), res, next as unknown as NextFunction);

    expect(json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(AppError));

    const error = next.mock.calls[0]?.[0];
    expect(error).toBeInstanceOf(AppError);
    expect(error).toMatchObject({
      statusCode: 503,
      code: "SERVICE_UNAVAILABLE",
    });
  });
});

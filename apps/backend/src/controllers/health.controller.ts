import { pingDatabase } from "../lib/prisma";
import { AppError } from "../utils/AppError";

import type { NextFunction, Request, Response } from "express";

export const getHealth = (_req: Request, res: Response) => {
  return res.json({ ok: true });
};

export const getHealthReady = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await pingDatabase();
    return res.json({ ok: true, db: true });
  } catch {
    next(AppError.serviceUnavailable("Database unavailable"));
  }
};

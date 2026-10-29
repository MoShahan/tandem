import { rateLimit } from "express-rate-limit";

import { AppError } from "../utils/AppError";

import type { Request } from "express";

type AppRateLimitOptions = {
  windowMs: number;
  limit: number;
  message: string;
  skip?: (req: Request) => boolean;
};

const isSafeMethod = (req: Request) => {
  const method = req.method.toUpperCase();
  return method === "GET" || method === "HEAD" || method === "OPTIONS";
};

export const AUTH_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  limit: 20,
} as const;

export const API_RATE_LIMIT = {
  windowMs: 60 * 1000,
  limit: 300,
} as const;

export const WRITE_RATE_LIMIT = {
  windowMs: 60 * 1000,
  limit: 60,
} as const;

export const createAppRateLimiter = ({
  windowMs,
  limit,
  message,
  skip,
}: AppRateLimitOptions) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    skip,
    validate: false,
    handler: (_req, _res, next) => {
      next(AppError.tooManyRequests(message));
    },
  });

export const authRateLimiter = createAppRateLimiter({
  ...AUTH_RATE_LIMIT,
  message: "Too many login or refresh attempts. Try again later.",
});

export const apiRateLimiter = createAppRateLimiter({
  ...API_RATE_LIMIT,
  message: "Too many requests. Try again later.",
});

export const writeRateLimiter = createAppRateLimiter({
  ...WRITE_RATE_LIMIT,
  message: "Too many changes. Try again later.",
  skip: isSafeMethod,
});

import { rateLimit } from "express-rate-limit";

import { AppError } from "../utils/AppError";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 20;

export const authRateLimiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: MAX_ATTEMPTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(
      AppError.tooManyRequests(
        "Too many login or refresh attempts. Try again later.",
      ),
    );
  },
});

import { parseDurationToMs } from "../lib/duration";

import { env } from "./env";

import type { CookieOptions } from "express";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

const sessionCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: env.cookieSecure,
  // SameSite=None requires Secure. Local HTTP uses COOKIE_SECURE=false, so Lax.
  // Production (COOKIE_SECURE=true) keeps None for Vercel ↔ Render until Plan 5.
  sameSite: env.cookieSecure ? "none" : "lax",
  path: "/",
});

export const accessTokenCookieOptions: CookieOptions = sessionCookieOptions();

export const refreshTokenCookieOptions: CookieOptions = sessionCookieOptions();

export const getAccessTokenMaxAge = (): number => {
  return parseDurationToMs(env.jwtExpiresIn);
};

export const getRefreshTokenMaxAge = (): number => {
  return parseDurationToMs(env.refreshTokenExpiresIn);
};

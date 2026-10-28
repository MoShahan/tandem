import { describe, expect, it } from "vitest";

import {
  createPgPoolConfig,
  PG_POOL_MAX,
  shouldUsePgSsl,
} from "./pgPoolConfig";

const LOCAL_URL = "postgresql://tandem:tandem@localhost:5432/tandem";
const NEON_POOLED_URL =
  "postgresql://neondb_owner:secret@ep-example-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require";
const NEON_DIRECT_NO_SSLMODE =
  "postgresql://neondb_owner:secret@ep-example.us-east-2.aws.neon.tech/neondb";

describe("shouldUsePgSsl", () => {
  it("skips SSL for local Docker in development", () => {
    expect(shouldUsePgSsl(LOCAL_URL, "development")).toBe(false);
  });

  it("enables SSL in production", () => {
    expect(shouldUsePgSsl(LOCAL_URL, "production")).toBe(true);
  });

  it("enables SSL when sslmode=require", () => {
    expect(shouldUsePgSsl(NEON_POOLED_URL, "development")).toBe(true);
  });

  it("enables SSL for neon.tech hosts even without sslmode", () => {
    expect(shouldUsePgSsl(NEON_DIRECT_NO_SSLMODE, "development")).toBe(true);
  });
});

describe("createPgPoolConfig", () => {
  it("caps the pool and omits ssl for local development", () => {
    expect(
      createPgPoolConfig({
        connectionString: LOCAL_URL,
        nodeEnv: "development",
      }),
    ).toEqual({
      connectionString: LOCAL_URL,
      max: PG_POOL_MAX,
    });
  });

  it("sets rejectUnauthorized false for Neon", () => {
    expect(
      createPgPoolConfig({
        connectionString: NEON_POOLED_URL,
        nodeEnv: "production",
      }),
    ).toEqual({
      connectionString: NEON_POOLED_URL,
      max: PG_POOL_MAX,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 30_000,
    });
  });

  it("strips channel_binding which node-pg does not honor", () => {
    const withBinding = `${NEON_POOLED_URL}&channel_binding=require`;
    expect(
      createPgPoolConfig({
        connectionString: withBinding,
        nodeEnv: "development",
      }).connectionString,
    ).toBe(NEON_POOLED_URL);
  });
});

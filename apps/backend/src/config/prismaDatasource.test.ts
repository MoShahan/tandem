import { describe, expect, it } from "vitest";

import { resolvePrismaDatasourceUrl } from "./prismaDatasource";

const LOCAL_URL = "postgresql://tandem:tandem@localhost:5432/tandem";
const DIRECT_URL =
  "postgresql://neondb_owner:secret@ep-example.us-east-2.aws.neon.tech/neondb?sslmode=require";
const POOLED_URL =
  "postgresql://neondb_owner:secret@ep-example-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require";

describe("resolvePrismaDatasourceUrl", () => {
  it("uses DATABASE_URL when DIRECT_URL is unset", () => {
    expect(resolvePrismaDatasourceUrl({ DATABASE_URL: LOCAL_URL })).toBe(
      LOCAL_URL,
    );
  });

  it("prefers DIRECT_URL so migrate does not hit the Neon pooler", () => {
    expect(
      resolvePrismaDatasourceUrl({
        DATABASE_URL: POOLED_URL,
        DIRECT_URL,
      }),
    ).toBe(DIRECT_URL);
  });

  it("ignores blank DIRECT_URL", () => {
    expect(
      resolvePrismaDatasourceUrl({
        DATABASE_URL: LOCAL_URL,
        DIRECT_URL: "  ",
      }),
    ).toBe(LOCAL_URL);
  });

  it("throws when neither URL is set", () => {
    expect(() => resolvePrismaDatasourceUrl({})).toThrow(/DATABASE_URL is required/);
  });
});

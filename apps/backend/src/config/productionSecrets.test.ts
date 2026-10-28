import { describe, expect, it } from "vitest";

import {
  assertSafeProductionSecrets,
  INSECURE_JWT_SECRET,
} from "./productionSecrets";

describe("assertSafeProductionSecrets", () => {
  it("allows change-me outside production", () => {
    expect(() =>
      assertSafeProductionSecrets({
        nodeEnv: "development",
        jwtSecret: INSECURE_JWT_SECRET,
      }),
    ).not.toThrow();
  });

  it("rejects change-me in production", () => {
    expect(() =>
      assertSafeProductionSecrets({
        nodeEnv: "production",
        jwtSecret: INSECURE_JWT_SECRET,
      }),
    ).toThrow(/JWT_SECRET must not be "change-me"/);
  });

  it("allows a real secret in production", () => {
    expect(() =>
      assertSafeProductionSecrets({
        nodeEnv: "production",
        jwtSecret: "a-long-random-secret",
      }),
    ).not.toThrow();
  });
});

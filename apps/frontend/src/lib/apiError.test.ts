import { describe, expect, it } from "vitest";

import { ApiClientError } from "@/lib/api-client";
import {
  getApiErrorDetails,
  getApiErrorMessage,
  isApiRejection,
} from "@/lib/apiError";

describe("getApiErrorMessage", () => {
  it("returns the API message from ApiClientError", () => {
    expect(
      getApiErrorMessage(
        new ApiClientError("Invalid email or password", "UNAUTHORIZED", undefined, 401),
        "Unable to sign in. Please try again.",
      ),
    ).toBe("Invalid email or password");
  });

  it("returns the message from a rejected thunk payload", () => {
    expect(
      getApiErrorMessage(
        { message: "Email is already in use", details: [{ field: "email", message: "Taken" }] },
        "Failed to create user",
      ),
    ).toBe("Email is already in use");
  });

  it("returns the fallback for network and empty bodies", () => {
    expect(
      getApiErrorMessage(
        new ApiClientError("An unexpected error occurred"),
        "Unable to sign in. Please try again.",
      ),
    ).toBe("Unable to sign in. Please try again.");
    expect(getApiErrorMessage({ message: "Rejected" }, "Failed to save")).toBe(
      "Failed to save",
    );
    expect(getApiErrorMessage(undefined, "Failed to save")).toBe("Failed to save");
  });

  it("returns the fallback for 5xx responses even when a message is present", () => {
    expect(
      getApiErrorMessage(
        new ApiClientError("Internal server error", "INTERNAL", undefined, 502),
        "Failed to save role",
      ),
    ).toBe("Failed to save role");
  });
});

describe("getApiErrorDetails", () => {
  it("reads field details from ApiClientError and thunk payloads", () => {
    const details = [{ field: "code", message: "Already taken" }];

    expect(
      getApiErrorDetails(new ApiClientError("Validation failed", "VALIDATION", details)),
    ).toEqual(details);
    expect(getApiErrorDetails({ message: "Validation failed", details })).toEqual(
      details,
    );
  });
});

describe("isApiRejection", () => {
  it("accepts serialized thunk errors with a message", () => {
    expect(isApiRejection({ name: "ApiClientError", message: "Forbidden" })).toBe(
      true,
    );
    expect(isApiRejection("boom")).toBe(false);
  });
});

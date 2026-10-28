import { describe, expect, it, vi } from "vitest";
import { Route, Routes } from "react-router-dom";

import { SessionExpiredHandler } from "./SessionExpiredHandler";
import { renderWithProviders } from "@/test/render";
import { authenticatedState } from "@/test/fixtures/auth";

const { mockNavigate, onSessionExpired } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  onSessionExpired: vi.fn<(handler: () => void | Promise<void>) => void>(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/lib/api-client", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api-client")>(
    "@/lib/api-client",
  );

  return {
    ...actual,
    registerSessionExpiredHandler: (handler: () => void | Promise<void>) => {
      onSessionExpired(handler);
      actual.registerSessionExpiredHandler(handler);
    },
  };
});

describe("SessionExpiredHandler", () => {
  it("logs out and navigates to login when session expires", async () => {
    mockNavigate.mockReset();
    onSessionExpired.mockClear();

    const { store } = renderWithProviders(
      <Routes>
        <Route path="/dashboard" element={<SessionExpiredHandler />} />
      </Routes>,
      {
        route: "/dashboard",
        preloadedState: authenticatedState(),
      },
    );

    const handler = onSessionExpired.mock.calls[0]?.[0];
    expect(handler).toEqual(expect.any(Function));
    await handler?.();

    expect(store.getState().auth.status).toBe("unauthenticated");
    expect(mockNavigate).toHaveBeenCalledWith("/login", {
      replace: true,
      state: { from: "/" },
    });
  });
});

import { beforeAll, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ApiClientError } from "@/lib/api-client";
import { LoginPage } from "./LoginPage";
import { authService } from "../authService";
import { mockAuthState } from "@/test/fixtures/auth";
import { renderWithProviders } from "@/test/render";

vi.mock("../authService", () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
    fetchMe: vi.fn(),
  },
}));

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
});

describe("LoginPage", () => {
  it("links to the public product guide", () => {
    renderWithProviders(<LoginPage />, {
      route: "/login",
      preloadedState: {
        auth: mockAuthState({ status: "unauthenticated" }),
      },
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    const guideLink = screen.getByRole("link", { name: "How Tandem works" });
    expect(guideLink).toHaveAttribute("href", "/guide");
  });

  it("shows the backend message when sign-in fails", async () => {
    vi.mocked(authService.login).mockRejectedValue(
      new ApiClientError(
        "Invalid email or password",
        "UNAUTHORIZED",
        undefined,
        401,
      ),
    );

    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, {
      route: "/login",
      preloadedState: {
        auth: mockAuthState({ status: "unauthenticated" }),
      },
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(
      await screen.findByText("Invalid email or password"),
    ).toBeInTheDocument();
  });
});

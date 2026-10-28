import { beforeAll, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { authenticatedState, mockAuthState } from "@/test/fixtures/auth";
import { renderWithProviders } from "@/test/render";

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

describe("NotFoundPage", () => {
  it("shows public recovery links when logged out", () => {
    renderWithProviders(<NotFoundPage />, {
      route: "/gude",
      preloadedState: {
        auth: mockAuthState({ status: "unauthenticated" }),
      },
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    expect(
      screen.getByRole("heading", { name: "Page not found" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute(
      "href",
      "/login",
    );
    expect(
      screen.getByRole("link", { name: "How Tandem works" }),
    ).toHaveAttribute("href", "/guide");
  });

  it("keeps authenticated users in the app shell", () => {
    renderWithProviders(<NotFoundPage />, {
      route: "/missing",
      preloadedState: authenticatedState(),
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    expect(
      screen.getByRole("heading", { name: "Page not found" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to app" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});

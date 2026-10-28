import { beforeAll, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LoginPage } from "./LoginPage";
import { mockAuthState } from "@/test/fixtures/auth";
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

describe("LoginPage", () => {
  it("links to the public product guide", () => {
    renderWithProviders(<LoginPage />, {
      route: "/login",
      preloadedState: {
        auth: mockAuthState({ status: "unauthenticated" }),
      },
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    const guideLinks = screen.getAllByRole("link", { name: "How Tandem works" });
    expect(guideLinks.length).toBeGreaterThan(0);
    expect(guideLinks[0]).toHaveAttribute("href", "/guide");
  });
});

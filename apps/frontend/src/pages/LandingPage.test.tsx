import { beforeAll, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LandingPage } from "@/pages/LandingPage";
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

describe("LandingPage", () => {
  it("offers log in and the public guide", () => {
    renderWithProviders(<LandingPage />, {
      route: "/",
      preloadedState: {
        auth: mockAuthState({ status: "unauthenticated" }),
      },
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    expect(
      screen.getByRole("heading", { name: "Streamline your sales operations" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Each lead has an owner and a stage/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "A sales pipeline with leads in New, Talking, Visit, and Closed",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "A lead list with an owner on each row",
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute(
      "href",
      "/login",
    );
    expect(
      screen.getByRole("link", { name: "How Tandem works" }),
    ).toHaveAttribute("href", "/guide");
    expect(screen.getByRole("link", { name: "Upcoming" })).toHaveAttribute(
      "href",
      "/upcoming",
    );
  });
});

import { beforeAll, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { GuidePage } from "./GuidePage";
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

const renderGuide = () =>
  renderWithProviders(<GuidePage />, {
    route: "/guide",
    wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
  });

describe("GuidePage", () => {
  it("explains leads, assignment, winning, and the executive role", () => {
    renderGuide();

    expect(
      screen.getByRole("heading", { name: "How Tandem works" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "What a lead is" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/a person, couple, or company/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/which salesperson is responsible/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/the sale happened/i)).toBeInTheDocument();
    expect(
      screen.getByText(/executive does not mean CEO/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Priya Shah").length).toBeGreaterThan(0);
    expect(
      screen.getByLabelText(/67 percent win rate/i),
    ).toBeInTheDocument();
  });

  it("is reachable without logging in and links to login", () => {
    renderGuide();

    const loginLinks = screen.getAllByRole("link", { name: "Log in" });
    expect(loginLinks.length).toBe(2);
    expect(loginLinks[0]).toHaveAttribute("href", "/login");
    expect(loginLinks[1]).toHaveAttribute("href", "/login");
    expect(
      screen.queryByRole("link", { name: "Back to login" }),
    ).not.toBeInTheDocument();
  });
});

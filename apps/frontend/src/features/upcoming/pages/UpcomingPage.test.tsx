import { beforeAll, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { UpcomingPage } from "./UpcomingPage";
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

describe("UpcomingPage", () => {
  it("lists upcoming features without login", () => {
    renderWithProviders(<UpcomingPage />, {
      route: "/upcoming",
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    expect(
      screen.getByRole("heading", { name: "Upcoming features" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Sending emails" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Email when a company is created" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Pipeline you name, per organization",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Work in more than one company" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Invite someone who already has a login",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Turn off access in one company only",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Forgot password / admin reset" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Sign in with Google / SSO" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Auto-assignment" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Faster notification badge (Redis)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Shorter wait for in-app alerts" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "More than one API server (Redis)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Don't lose alerts on restart (Redis)",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Retry failed alerts (Redis)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Clean out old bells and audit logs",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "iPhone and Android apps" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Your own domain" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Split the API into services" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "A database per company" }),
    ).toBeInTheDocument();
  });
});

import { beforeAll, describe, expect, it } from "vitest";
import { Route, Routes } from "react-router-dom";
import { screen } from "@testing-library/react";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { RootRoute } from "./RootRoute";
import { authenticatedState, mockAuthState, mockUser } from "@/test/fixtures/auth";
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

describe("RootRoute", () => {
  it("shows the marketing landing when logged out", () => {
    renderWithProviders(
      <Routes>
        <Route path="/" element={<RootRoute />} />
      </Routes>,
      {
        route: "/",
        preloadedState: {
          auth: mockAuthState({ status: "unauthenticated" }),
        },
        wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
      },
    );

    expect(
      screen.getByRole("heading", { name: "Streamline your sales operations" }),
    ).toBeInTheDocument();
  });

  it("sends authenticated users into the app", () => {
    renderWithProviders(
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/leads" element={<div>Leads page</div>} />
      </Routes>,
      {
        route: "/",
        preloadedState: authenticatedState({
          modules: ["sales"],
          user: mockUser({ permissions: ["leads:read"] }),
        }),
      },
    );

    expect(screen.getByText("Leads page")).toBeInTheDocument();
  });
});

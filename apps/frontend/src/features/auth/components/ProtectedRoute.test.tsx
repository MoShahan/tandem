import { describe, expect, it } from "vitest";
import { Route, Routes, useLocation } from "react-router-dom";
import { screen } from "@testing-library/react";

import { ProtectedRoute } from "./ProtectedRoute";
import { mockAuthState } from "@/test/fixtures/auth";
import { renderWithProviders } from "@/test/render";

describe("ProtectedRoute", () => {
  it("shows a skeleton while auth is loading", () => {
    renderWithProviders(
      <Routes>
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<div>Private page</div>} />
        </Route>
      </Routes>,
      {
        preloadedState: {
          auth: mockAuthState({ status: "loading" }),
        },
      },
    );

    expect(screen.queryByText("Private page")).not.toBeInTheDocument();
  });

  it("redirects unauthenticated users to login", () => {
    renderWithProviders(
      <Routes>
        <Route path="/private" element={<ProtectedRoute />}>
          <Route index element={<div>Private page</div>} />
        </Route>
        <Route path="/login" element={<div>Login page</div>} />
      </Routes>,
      {
        preloadedState: {
          auth: mockAuthState({ status: "unauthenticated" }),
        },
        route: "/private",
      },
    );

    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Private page")).not.toBeInTheDocument();
  });

  it("passes the original path and query to login", () => {
    const LoginFrom = () => {
      const location = useLocation();
      const from = (location.state as { from?: string } | null)?.from;

      return <div>from:{from ?? "none"}</div>;
    };

    renderWithProviders(
      <Routes>
        <Route path="/leads/:id" element={<ProtectedRoute />}>
          <Route index element={<div>Lead page</div>} />
        </Route>
        <Route path="/login" element={<LoginFrom />} />
      </Routes>,
      {
        preloadedState: {
          auth: mockAuthState({ status: "unauthenticated" }),
        },
        route: "/leads/abc-123?fromList=1",
      },
    );

    expect(screen.getByText("from:/leads/abc-123?fromList=1")).toBeInTheDocument();
  });

  it("renders child routes for authenticated users", () => {
    renderWithProviders(
      <Routes>
        <Route path="/private" element={<ProtectedRoute />}>
          <Route index element={<div>Private page</div>} />
        </Route>
      </Routes>,
      {
        preloadedState: {
          auth: mockAuthState({ status: "authenticated" }),
        },
        route: "/private",
      },
    );

    expect(screen.getByText("Private page")).toBeInTheDocument();
  });
});

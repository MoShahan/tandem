import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { HomePage } from "@/pages/HomePage";
import { authenticatedState } from "@/test/fixtures/auth";
import { renderWithProviders } from "@/test/render";

describe("HomePage", () => {
  it("explains the empty state and links to account", () => {
    renderWithProviders(<HomePage />, {
      route: "/home",
      preloadedState: authenticatedState({
        modules: [],
      }),
    });

    expect(
      screen.getByRole("heading", { name: "No features available" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Test Org has not enabled any modules you can access/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open account" })).toHaveAttribute(
      "href",
      "/account",
    );
  });
});

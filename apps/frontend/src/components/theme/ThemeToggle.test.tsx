import { beforeAll, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
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

describe("ThemeToggle", () => {
  it("keeps a visible border in light mode", async () => {
    renderWithProviders(<ThemeToggle />, {
      wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    });

    const toggle = await screen.findByRole("switch", {
      name: "Switch to dark mode",
    });
    expect(toggle.className).toContain("border");
    expect(toggle.className).toContain("border-neutral-300");
  });
});

import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import {
  SEARCH_DEBOUNCE_MS,
  useDebouncedSearch,
} from "./useDebouncedSearch";

describe("useDebouncedSearch", () => {
  it("commits the trimmed value after the debounce delay", () => {
    vi.useFakeTimers();
    const onSearchChange = vi.fn();

    renderHook(() => useDebouncedSearch("  acme  ", "", onSearchChange));

    expect(onSearchChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 1);
    expect(onSearchChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onSearchChange).toHaveBeenCalledTimes(1);
    expect(onSearchChange).toHaveBeenCalledWith("acme");

    vi.useRealTimers();
  });

  it("does not fire when the trimmed value already matches the committed search", () => {
    vi.useFakeTimers();
    const onSearchChange = vi.fn();

    renderHook(() => useDebouncedSearch("acme", "acme", onSearchChange));
    vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    expect(onSearchChange).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it("restarts the timer when the input changes", () => {
    vi.useFakeTimers();
    const onSearchChange = vi.fn();

    const { rerender } = renderHook(
      ({ value }) => useDebouncedSearch(value, "", onSearchChange),
      { initialProps: { value: "a" } },
    );

    vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 50);
    rerender({ value: "ab" });
    vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 50);
    expect(onSearchChange).not.toHaveBeenCalled();
    vi.advanceTimersByTime(50);
    expect(onSearchChange).toHaveBeenCalledWith("ab");

    vi.useRealTimers();
  });
});

import { useEffect, useRef } from "react";

export const SEARCH_DEBOUNCE_MS = 300;

export const useDebouncedSearch = (
  searchInput: string,
  committedSearch: string,
  onSearchChange: (search: string) => void,
  delayMs: number = SEARCH_DEBOUNCE_MS,
) => {
  const onSearchChangeRef = useRef(onSearchChange);
  onSearchChangeRef.current = onSearchChange;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (searchInput.trim() !== committedSearch.trim()) {
        onSearchChangeRef.current(searchInput.trim());
      }
    }, delayMs);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput, committedSearch, delayMs]);
};

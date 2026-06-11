import { describe, expect, it } from "vitest";
import { getInitialTheme, THEME_STORAGE_KEY } from "./theme";

describe("getInitialTheme", () => {
  it("uses the saved theme when it is valid", () => {
    expect(getInitialTheme("dark", false)).toBe("dark");
    expect(getInitialTheme("light", true)).toBe("light");
  });

  it("falls back to the system preference without a valid saved theme", () => {
    expect(getInitialTheme(null, true)).toBe("dark");
    expect(getInitialTheme("invalid", false)).toBe("light");
  });

  it("keeps the storage key stable", () => {
    expect(THEME_STORAGE_KEY).toBe("codereview-ai-theme");
  });
});

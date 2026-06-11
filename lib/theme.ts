export const THEME_STORAGE_KEY = "codereview-ai-theme";

export type ThemePreference = "light" | "dark";

export function getInitialTheme(
  savedTheme: string | null,
  prefersDark: boolean,
): ThemePreference {
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return prefersDark ? "dark" : "light";
}

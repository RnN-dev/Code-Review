"use client";

import { Activity, Moon, ShieldCheck, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { CodeInput } from "@/components/code-input";
import { LanguageSelect } from "@/components/language-select";
import { ModelSelect } from "@/components/model-select";
import { ReviewOutput } from "@/components/review-output";
import { getReviewResponseError } from "@/lib/review-errors";
import {
  getInitialTheme,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from "@/lib/theme";
import type { ReviewMode } from "@/lib/validation";

export default function Home() {
  const [language, setLanguage] = useState("TypeScript");
  const [mode, setMode] = useState<ReviewMode>("fast");
  const [completion, setCompletion] = useState("");
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<ThemePreference | null>(null);
  const activeTheme = theme ?? "light";

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = getInitialTheme(
        window.localStorage.getItem(THEME_STORAGE_KEY),
        prefersDark,
      );

      setTheme(initialTheme);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!theme) return;

    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  async function handleReview(code: string) {
    setCompletion("");
    setError(undefined);
    setIsLoading(true);

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          mode,
        }),
      });

      if (!response.ok) {
        throw new Error(await getReviewResponseError(response));
      }

      if (!response.body) {
        throw new Error(
          "A resposta da revisao veio vazia. Tente novamente em instantes.",
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let nextCompletion = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        nextCompletion += decoder.decode(value, { stream: true });
        setCompletion(nextCompletion);
      }

      const remainingText = decoder.decode();

      if (remainingText) {
        nextCompletion += remainingText;
        setCompletion(nextCompletion);
      }
    } catch (reviewError) {
      setError(
        reviewError instanceof Error
          ? reviewError
          : new Error("Nao consegui concluir a revisao agora."),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-zinc-100 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 lg:h-screen lg:overflow-hidden">
      <header className="shrink-0 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h1 className="text-xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50">
              CodeReview AI
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Cole um trecho de código e receba uma revisão técnica em tempo real.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <LanguageSelect value={language} onChange={setLanguage} />
            <ModelSelect value={mode} onChange={setMode} />
            <button
              type="button"
              aria-label={
                activeTheme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"
              }
              onClick={() =>
                setTheme((currentTheme) =>
                  (currentTheme ?? activeTheme) === "dark" ? "light" : "dark",
                )
              }
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950 focus:outline-none focus:ring-4 focus:ring-zinc-950/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-400 dark:hover:text-white dark:focus:ring-white/10"
            >
              {activeTheme === "dark" ? (
                <Sun aria-hidden size={18} />
              ) : (
                <Moon aria-hidden size={18} />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 py-5 sm:px-6 lg:min-h-0 lg:overflow-hidden lg:px-8">
        <section className="grid shrink-0 gap-3 md:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <ShieldCheck
              aria-hidden
              className="mt-0.5 text-emerald-600 dark:text-emerald-400"
              size={18}
            />
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Rate limit aplicado antes da chamada de IA: 10 revisões por hora por
              IP.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <Activity
              aria-hidden
              className="mt-0.5 text-sky-600 dark:text-sky-400"
              size={18}
            />
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              O texto aparece progressivamente, sem esperar a revisão inteira
              terminar.
            </p>
          </div>
        </section>

        <section className="grid min-h-0 gap-5 lg:flex-1 lg:grid-cols-[0.92fr_1.08fr] lg:overflow-hidden">
          <CodeInput onSubmit={handleReview} isLoading={isLoading} />
          <ReviewOutput markdown={completion} isLoading={isLoading} error={error} />
        </section>

        <footer className="shrink-0 pb-3 text-center text-xs text-zinc-500 dark:text-zinc-500">
          Modo atual: {mode === "fast" ? "rápido" : "completo"} com Gemini 2.5
          Flash.
        </footer>
      </div>
    </main>
  );
}

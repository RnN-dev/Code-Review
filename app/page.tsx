"use client";

import { useCompletion } from "@ai-sdk/react";
import { Activity, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { CodeInput } from "@/components/code-input";
import { LanguageSelect } from "@/components/language-select";
import { ModelSelect } from "@/components/model-select";
import { ReviewOutput } from "@/components/review-output";
import type { ReviewMode } from "@/lib/validation";

export default function Home() {
  const [language, setLanguage] = useState("TypeScript");
  const [mode, setMode] = useState<ReviewMode>("complete");

  const { complete, completion, error, isLoading, setCompletion } =
    useCompletion({
      api: "/api/review",
      streamProtocol: "text",
      experimental_throttle: 80,
    });

  async function handleReview(code: string) {
    setCompletion("");
    await complete("", {
      body: {
        code,
        language,
        mode,
      },
    });
  }

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h1 className="text-xl font-semibold tracking-normal text-zinc-950">
              CodeReview AI
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-500">
              Cole um trecho de código e receba uma revisão técnica em tempo real.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <LanguageSelect value={language} onChange={setLanguage} />
            <ModelSelect value={mode} onChange={setMode} />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <section className="grid gap-3 md:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3">
            <ShieldCheck aria-hidden className="mt-0.5 text-emerald-600" size={18} />
            <p className="text-sm leading-6 text-zinc-600">
              Rate limit aplicado antes da chamada de IA: 10 revisões por hora por IP.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3">
            <Activity aria-hidden className="mt-0.5 text-sky-600" size={18} />
            <p className="text-sm leading-6 text-zinc-600">
              O texto aparece progressivamente, sem esperar a revisão inteira terminar.
            </p>
          </div>
        </section>

        <section className="grid min-h-0 gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <CodeInput onSubmit={handleReview} isLoading={isLoading} />
          <ReviewOutput markdown={completion} isLoading={isLoading} error={error} />
        </section>

        <footer className="pb-3 text-center text-xs text-zinc-500">
          Modo atual: {mode === "fast" ? "rápido" : "completo"} com Gemini 2.5 Flash.
        </footer>
      </div>
    </main>
  );
}

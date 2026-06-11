"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyButton } from "./copy-button";

interface ReviewOutputProps {
  markdown: string;
  isLoading: boolean;
  error?: Error;
}

function getErrorMessage(error: Error) {
  const message = error.message.trim();

  if (message && !message.toLowerCase().includes("failed to fetch")) {
    return message;
  }

  if (error.message.includes("429")) {
    return "Você atingiu o limite de 10 revisões por hora. Espere um pouco e tente de novo.";
  }

  if (error.message.includes("400")) {
    return "O trecho enviado não passou na validação. Revise o código e tente novamente.";
  }

  return "Não consegui concluir a revisão agora. Tente novamente em instantes.";
}

export function ReviewOutput({ markdown, isLoading, error }: ReviewOutputProps) {
  if (error) {
    return (
      <section className="flex min-h-[520px] items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm font-medium text-red-700 dark:border-red-950 dark:bg-red-950/30 dark:text-red-300 lg:h-full lg:min-h-0">
        {getErrorMessage(error)}
      </section>
    );
  }

  if (!markdown && isLoading) {
    return (
      <section
        aria-live="polite"
        className="flex min-h-[520px] flex-col rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 lg:h-full lg:min-h-0"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              Revisão
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Gemini está analisando o código.
            </p>
          </div>
          <div className="h-10 w-24 rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-950 dark:border-zinc-800 dark:border-t-zinc-50" />
          <p className="mx-auto max-w-sm text-center text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            A revisão pode levar alguns segundos. Assim que o primeiro trecho
            chegar, ele aparece aqui.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {[72, 94, 65, 88, 53, 79, 61].map((width) => (
            <div
              key={width}
              className="h-3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800"
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
      </section>
    );
  }

  if (!markdown) {
    return (
      <section className="flex min-h-[520px] items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900/70 lg:h-full lg:min-h-0">
        <div className="max-w-sm">
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
            Revisão
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            O resultado aparece aqui em tempo real, formatado em markdown e pronto
            para copiar.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-[520px] flex-col rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:h-full lg:min-h-0">
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <div>
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
            Revisão
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {isLoading ? "Recebendo resposta em tempo real." : "Revisão concluída."}
          </p>
        </div>
        <CopyButton text={markdown} />
      </div>

      <div className="review-markdown panel-scroll prose prose-zinc min-h-0 max-w-none flex-1 overflow-y-auto p-5 prose-headings:font-semibold prose-headings:text-zinc-950 prose-p:leading-7 prose-pre:rounded-md prose-pre:border prose-code:text-[0.9em] dark:prose-invert dark:prose-headings:text-zinc-50">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>
    </section>
  );
}

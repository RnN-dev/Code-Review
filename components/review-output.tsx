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
      <section className="flex min-h-[520px] items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm font-medium text-red-700">
        {getErrorMessage(error)}
      </section>
    );
  }

  if (!markdown && isLoading) {
    return (
      <section className="min-h-[520px] rounded-lg border border-zinc-200 bg-white p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="h-4 w-24 rounded bg-zinc-200" />
            <div className="mt-2 h-3 w-44 rounded bg-zinc-100" />
          </div>
          <div className="h-10 w-24 rounded bg-zinc-100" />
        </div>
        <div className="space-y-3">
          {[72, 94, 65, 88, 53, 79, 61].map((width) => (
            <div
              key={width}
              className="h-3 animate-pulse rounded bg-zinc-100"
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
      </section>
    );
  }

  if (!markdown) {
    return (
      <section className="flex min-h-[520px] items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
        <div className="max-w-sm">
          <h2 className="text-base font-semibold text-zinc-950">Revisão</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            O resultado aparece aqui em tempo real, formatado em markdown e pronto
            para copiar.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-[520px] flex-col rounded-lg border border-zinc-200 bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">Revisão</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {isLoading ? "Recebendo resposta em tempo real." : "Revisão concluída."}
          </p>
        </div>
        <CopyButton text={markdown} />
      </div>

      <div className="prose prose-zinc max-w-none flex-1 overflow-y-auto p-5 prose-headings:font-semibold prose-pre:border prose-pre:border-zinc-200 prose-pre:bg-zinc-50 prose-code:text-[0.9em]">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>
    </section>
  );
}

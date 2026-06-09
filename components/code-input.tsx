"use client";

import { SendHorizontal } from "lucide-react";
import { useRef, useState } from "react";

const MAX_CODE_LENGTH = 8000;

interface CodeInputProps {
  onSubmit: (code: string) => Promise<void> | void;
  isLoading: boolean;
}

export function CodeInput({ onSubmit, isLoading }: CodeInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [code, setCode] = useState("");
  const remaining = MAX_CODE_LENGTH - code.length;
  const isOverLimit = remaining < 0;
  const canSubmit = code.trim().length > 0 && !isOverLimit && !isLoading;

  function submit() {
    if (!canSubmit) return;
    onSubmit(code);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      submit();
    }
  }

  return (
    <section className="flex min-h-[520px] flex-col rounded-lg border border-zinc-200 bg-white">
      <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-950">Código</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Cole um trecho pequeno e peça uma revisão objetiva.
          </p>
        </div>
        <span className="rounded-md bg-zinc-100 px-2 py-1 font-mono text-xs text-zinc-600">
          Ctrl Enter
        </span>
      </div>

      <textarea
        ref={textareaRef}
        value={code}
        onChange={(event) => setCode(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        spellCheck={false}
        placeholder="Cole seu código aqui..."
        className="min-h-0 flex-1 resize-none bg-transparent p-5 font-mono text-sm leading-6 text-zinc-950 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-60"
      />

      <div className="flex flex-col gap-3 border-t border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p
          className={`text-sm ${isOverLimit ? "font-medium text-red-600" : "text-zinc-500"}`}
          aria-live="polite"
        >
          {isOverLimit
            ? `${Math.abs(remaining)} caracteres acima do limite.`
            : `${remaining} caracteres restantes.`}
        </p>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={submit}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-950/20 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
        >
          <SendHorizontal aria-hidden size={17} />
          {isLoading ? "Revisando" : "Revisar código"}
        </button>
      </div>
    </section>
  );
}

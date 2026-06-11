"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copyToClipboard() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={copyToClipboard}
      className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950 focus:outline-none focus:ring-4 focus:ring-zinc-950/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-400 dark:hover:text-white dark:focus:ring-white/10"
    >
      {copied ? <Check aria-hidden size={16} /> : <Copy aria-hidden size={16} />}
      <span>{copied ? "Copiado" : "Copiar"}</span>
    </button>
  );
}

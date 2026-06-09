"use client";

import { REVIEW_MODEL_OPTIONS } from "@/lib/models";
import type { ReviewMode } from "@/lib/validation";

interface ModelSelectProps {
  value: ReviewMode;
  onChange: (mode: ReviewMode) => void;
}

export function ModelSelect({ value, onChange }: ModelSelectProps) {
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="text-xs font-medium text-zinc-600">Modo</legend>
      <div className="grid h-11 grid-cols-2 rounded-md border border-zinc-300 bg-zinc-100 p-1">
        {REVIEW_MODEL_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            title={option.description}
            onClick={() => onChange(option.value)}
            className="rounded px-3 text-sm font-semibold text-zinc-600 transition hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950/20 aria-pressed:bg-white aria-pressed:text-zinc-950 aria-pressed:shadow-sm"
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

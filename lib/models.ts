import type { ReviewMode } from "./validation";

export const REVIEW_MODEL_OPTIONS = [
  {
    value: "fast",
    label: "Rapido",
    description: "Gemini 2.5 Flash com resposta mais curta.",
  },
  {
    value: "complete",
    label: "Completo",
    description: "Gemini 2.5 Flash com mais espaco para analise.",
  },
] as const;

const REVIEW_MODELS: Record<
  ReviewMode,
  {
    model: "gemini-2.5-flash";
    maxOutputTokens: number;
  }
> = {
  fast: {
    model: "gemini-2.5-flash",
    maxOutputTokens: 900,
  },
  complete: {
    model: "gemini-2.5-flash",
    maxOutputTokens: 1800,
  },
};

export function getReviewModelConfig(mode: ReviewMode) {
  return REVIEW_MODELS[mode];
}

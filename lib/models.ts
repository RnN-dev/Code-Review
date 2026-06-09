import type { ReviewMode } from "./validation";

export const REVIEW_MODEL_OPTIONS = [
  {
    value: "fast",
    label: "Rapido",
    description: "Resposta mais curta para uma primeira leitura.",
  },
  {
    value: "complete",
    label: "Completo",
    description: "Analise mais cuidadosa para revisar antes de enviar.",
  },
] as const;

const REVIEW_MODELS: Record<
  ReviewMode,
  {
    model: "gpt-5.5";
    maxOutputTokens: number;
  }
> = {
  fast: {
    model: "gpt-5.5",
    maxOutputTokens: 900,
  },
  complete: {
    model: "gpt-5.5",
    maxOutputTokens: 1800,
  },
};

export function getReviewModelConfig(mode: ReviewMode) {
  return REVIEW_MODELS[mode];
}

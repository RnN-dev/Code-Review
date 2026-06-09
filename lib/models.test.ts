import { describe, expect, it } from "vitest";
import { REVIEW_MODEL_OPTIONS, getReviewModelConfig } from "./models";

describe("review model config", () => {
  it("exposes fast and complete options for the UI", () => {
    expect(REVIEW_MODEL_OPTIONS).toEqual([
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
    ]);
  });

  it("returns complete config by default", () => {
    expect(getReviewModelConfig("complete")).toEqual({
      model: "gpt-5.5",
      maxOutputTokens: 1800,
    });
  });

  it("returns a concise config for fast mode", () => {
    expect(getReviewModelConfig("fast")).toEqual({
      model: "gpt-5.5",
      maxOutputTokens: 900,
    });
  });
});

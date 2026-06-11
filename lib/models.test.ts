import { describe, expect, it } from "vitest";
import { REVIEW_MODEL_OPTIONS, getReviewModelConfig } from "./models";

describe("review model config", () => {
  it("exposes fast and complete options for the UI", () => {
    expect(REVIEW_MODEL_OPTIONS).toEqual([
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
    ]);
  });

  it("returns complete config by default", () => {
    expect(getReviewModelConfig("complete")).toEqual({
      model: "gemini-2.5-flash",
      maxOutputTokens: 2600,
    });
  });

  it("returns a concise config for fast mode", () => {
    expect(getReviewModelConfig("fast")).toEqual({
      model: "gemini-2.5-flash",
      maxOutputTokens: 1400,
    });
  });
});

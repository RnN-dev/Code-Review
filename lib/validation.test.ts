import { describe, expect, it } from "vitest";
import { validateReviewRequest } from "./validation";

describe("validateReviewRequest", () => {
  it("accepts a valid review request", () => {
    const result = validateReviewRequest({
      code: "const total = items.length;",
      language: "TypeScript",
      mode: "complete",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        code: "const total = items.length;",
        language: "TypeScript",
        mode: "complete",
      },
    });
  });

  it("trims code and language before returning data", () => {
    const result = validateReviewRequest({
      code: "  function run() { return true; }  ",
      language: " JavaScript ",
      mode: "fast",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        code: "function run() { return true; }",
        language: "JavaScript",
        mode: "fast",
      },
    });
  });

  it("rejects empty code", () => {
    const result = validateReviewRequest({
      code: "   ",
      language: "TypeScript",
      mode: "complete",
    });

    expect(result).toEqual({
      ok: false,
      status: 400,
      message: "Cole um trecho de codigo antes de pedir a revisao.",
    });
  });

  it("rejects snippets above 8000 characters", () => {
    const result = validateReviewRequest({
      code: "x".repeat(8001),
      language: "TypeScript",
      mode: "complete",
    });

    expect(result).toEqual({
      ok: false,
      status: 400,
      message: "O trecho enviado passou de 8000 caracteres.",
    });
  });

  it("defaults to complete mode when mode is omitted", () => {
    const result = validateReviewRequest({
      code: "console.log('ok')",
      language: "JavaScript",
    });

    expect(result).toEqual({
      ok: true,
      data: {
        code: "console.log('ok')",
        language: "JavaScript",
        mode: "complete",
      },
    });
  });

  it("rejects invalid mode values", () => {
    const result = validateReviewRequest({
      code: "console.log('ok')",
      language: "JavaScript",
      mode: "slow",
    });

    expect(result).toEqual({
      ok: false,
      status: 400,
      message: "Modo de revisao invalido.",
    });
  });
});

const MAX_CODE_LENGTH = 8000;
const REVIEW_MODES = ["fast", "complete"] as const;

export type ReviewMode = (typeof REVIEW_MODES)[number];

export interface ReviewRequestData {
  code: string;
  language: string;
  mode: ReviewMode;
}

type ValidationResult =
  | { ok: true; data: ReviewRequestData }
  | { ok: false; status: 400; message: string };

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null;
}

function isReviewMode(input: unknown): input is ReviewMode {
  return REVIEW_MODES.includes(input as ReviewMode);
}

export function validateReviewRequest(input: unknown): ValidationResult {
  if (!isRecord(input)) {
    return {
      ok: false,
      status: 400,
      message: "Envie um corpo de requisicao valido.",
    };
  }

  if (typeof input.code !== "string" || input.code.trim().length === 0) {
    return {
      ok: false,
      status: 400,
      message: "Cole um trecho de codigo antes de pedir a revisao.",
    };
  }

  const code = input.code.trim();

  if (code.length > MAX_CODE_LENGTH) {
    return {
      ok: false,
      status: 400,
      message: "O trecho enviado passou de 8000 caracteres.",
    };
  }

  if (typeof input.language !== "string" || input.language.trim().length === 0) {
    return {
      ok: false,
      status: 400,
      message: "Escolha uma linguagem para a revisao.",
    };
  }

  const mode = input.mode ?? "complete";

  if (!isReviewMode(mode)) {
    return {
      ok: false,
      status: 400,
      message: "Modo de revisao invalido.",
    };
  }

  return {
    ok: true,
    data: {
      code,
      language: input.language.trim(),
      mode,
    },
  };
}

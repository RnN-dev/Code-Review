const GENERIC_REVIEW_ERROR =
  "Nao consegui concluir a revisao agora. Tente novamente em instantes.";

export async function getReviewResponseError(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const payload = (await response.json()) as { error?: unknown };
      const message = typeof payload.error === "string" ? payload.error.trim() : "";

      if (message) {
        return message;
      }
    } catch {
      return GENERIC_REVIEW_ERROR;
    }
  }

  if (response.status === 429) {
    return "Voce atingiu o limite de 10 revisoes por hora. Espere um pouco e tente de novo.";
  }

  if (response.status === 400) {
    return "O trecho enviado nao passou na validacao. Revise o codigo e tente novamente.";
  }

  return GENERIC_REVIEW_ERROR;
}

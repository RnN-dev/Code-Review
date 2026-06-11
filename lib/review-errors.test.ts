import { describe, expect, it } from "vitest";
import { getReviewResponseError } from "./review-errors";

describe("getReviewResponseError", () => {
  it("uses the JSON error returned by the review API", async () => {
    const response = Response.json(
      { error: "O limite de uso nao foi configurado no servidor." },
      { status: 500 },
    );

    await expect(getReviewResponseError(response)).resolves.toBe(
      "O limite de uso nao foi configurado no servidor.",
    );
  });

  it("keeps a useful fallback for non-JSON server failures", async () => {
    const response = new Response("Internal Server Error", { status: 500 });

    await expect(getReviewResponseError(response)).resolves.toBe(
      "Nao consegui concluir a revisao agora. Tente novamente em instantes.",
    );
  });
});

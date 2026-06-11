import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  return {
    limit: vi.fn(),
    streamText: vi.fn(),
    google: vi.fn((model: string) => ({ provider: "google", model })),
  };
});

vi.mock("@/lib/rate-limit", () => ({
  getRatelimit: () => ({
    limit: mocks.limit,
  }),
}));

vi.mock("@ai-sdk/google", () => ({
  google: mocks.google,
}));

vi.mock("ai", () => ({
  streamText: mocks.streamText,
}));

describe("POST /api/review", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 429 before calling Gemini when rate limit is exceeded", async () => {
    mocks.limit.mockResolvedValue({ success: false, remaining: 0 });
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/review", {
        method: "POST",
        body: JSON.stringify({
          code: "const ok = true;",
          language: "TypeScript",
          mode: "complete",
        }),
      }),
    );

    expect(response.status).toBe(429);
    await expect(response.json()).resolves.toEqual({
      error: "Limite de 10 revisoes por hora atingido. Tente novamente mais tarde.",
    });
    expect(mocks.streamText).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid code after rate limiting", async () => {
    mocks.limit.mockResolvedValue({ success: true, remaining: 9 });
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/review", {
        method: "POST",
        body: JSON.stringify({
          code: "",
          language: "TypeScript",
          mode: "complete",
        }),
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Cole um trecho de codigo antes de pedir a revisao.",
    });
    expect(mocks.limit).toHaveBeenCalledWith("anonymous");
    expect(mocks.streamText).not.toHaveBeenCalled();
  });

  it("streams a valid review and exposes the remaining quota", async () => {
    const streamResponse = new Response("stream");
    mocks.limit.mockResolvedValue({ success: true, remaining: 8 });
    mocks.streamText.mockReturnValue({
      toTextStreamResponse: () => streamResponse,
    });
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/review", {
        method: "POST",
        headers: { "x-forwarded-for": "203.0.113.10" },
        body: JSON.stringify({
          code: "const ok = true;",
          language: "TypeScript",
          mode: "fast",
        }),
      }),
    );

    expect(response).toBe(streamResponse);
    expect(response.headers.get("X-RateLimit-Remaining")).toBe("8");
    expect(mocks.google).toHaveBeenCalledWith("gemini-2.5-flash");
    expect(mocks.streamText).toHaveBeenCalledOnce();
  });
});

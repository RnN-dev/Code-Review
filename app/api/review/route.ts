import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getReviewModelConfig } from "@/lib/models";
import { REVIEW_SYSTEM_PROMPT } from "@/lib/prompts";
import { getRatelimit } from "@/lib/rate-limit";
import { validateReviewRequest } from "@/lib/validation";

export const runtime = "edge";

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "anonymous";
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  let limitResult: { success: boolean; remaining: number };

  try {
    limitResult = await getRatelimit().limit(ip);
  } catch {
    return jsonError(
      "O limite de uso nao foi configurado no servidor.",
      500,
    );
  }

  const { success, remaining } = limitResult;

  if (!success) {
    return jsonError(
      "Limite de 10 revisoes por hora atingido. Tente novamente mais tarde.",
      429,
    );
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return jsonError("Envie um JSON valido para revisar codigo.", 400);
  }

  const validation = validateReviewRequest(body);

  if (!validation.ok) {
    return jsonError(validation.message, validation.status);
  }

  const { code, language, mode } = validation.data;
  const modelConfig = getReviewModelConfig(mode);

  try {
    const result = streamText({
      model: openai(modelConfig.model),
      system: REVIEW_SYSTEM_PROMPT,
      maxOutputTokens: modelConfig.maxOutputTokens,
      messages: [
        {
          role: "user",
          content: `Revise este codigo ${language}:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        },
      ],
    });

    const response = result.toTextStreamResponse();
    response.headers.set("X-RateLimit-Remaining", String(remaining));

    return response;
  } catch {
    return jsonError(
      "Nao consegui iniciar a revisao agora. Tente novamente em instantes.",
      500,
    );
  }
}

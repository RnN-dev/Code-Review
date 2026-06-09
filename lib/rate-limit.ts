import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let cachedRatelimit: Ratelimit | null = null;

export function getRatelimit() {
  if (cachedRatelimit) {
    return cachedRatelimit;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error("Upstash Redis nao foi configurado.");
  }

  cachedRatelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    analytics: true,
    prefix: "codereview-ai",
  });

  return cachedRatelimit;
}

import { createHash } from "node:crypto";
import Redis from "ioredis";

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfter: number;
};

let redis: Redis | null = null;
let redisUnavailable = false;

function getRedis(): Redis | null {
  if (redisUnavailable || !process.env.REDIS_URL) return null;
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      lazyConnect: true,
    });
    redis.on("error", () => {
      redisUnavailable = true;
    });
  }
  return redis;
}

const memoryHits = new Map<string, { count: number; resetAt: number }>();

function memoryLimit(key: string, limit: number, windowSec: number): RateLimitResult {
  const now = Date.now();
  const entry = memoryHits.get(key);
  if (!entry || entry.resetAt <= now) {
    memoryHits.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  entry.count += 1;
  if (entry.count > limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true, remaining: limit - entry.count, retryAfter: 0 };
}

export async function rateLimit(
  key: string,
  limit: number,
  windowSec: number,
): Promise<RateLimitResult> {
  const client = getRedis();
  if (!client) return memoryLimit(key, limit, windowSec);

  try {
    const redisKey = `floppyy:gb:rl:${key}`;
    const count = await client.incr(redisKey);
    if (count === 1) await client.expire(redisKey, windowSec);
    if (count > limit) {
      const ttl = await client.ttl(redisKey);
      return { ok: false, remaining: 0, retryAfter: ttl > 0 ? ttl : windowSec };
    }
    return { ok: true, remaining: limit - count, retryAfter: 0 };
  } catch {
    return memoryLimit(key, limit, windowSec);
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function hashIp(ip: string): string {
  const salt = process.env.GUESTBOOK_SALT ?? "floppyy-dev-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

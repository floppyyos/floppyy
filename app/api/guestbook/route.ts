import { guestbookStore } from "@/lib/guestbook/store";
import { clientIp, hashIp, rateLimit } from "@/lib/guestbook/ratelimit";
import { validateSubmission } from "@/lib/guestbook/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const POST_LIMIT = 5;
const POST_WINDOW_SEC = 60;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limitParam = Number(url.searchParams.get("limit"));
  const beforeParam = Number(url.searchParams.get("before"));

  try {
    const messages = await guestbookStore().list({
      limit: Number.isFinite(limitParam) && limitParam > 0 ? limitParam : undefined,
      before: Number.isFinite(beforeParam) && beforeParam > 0 ? beforeParam : undefined,
    });
    return Response.json(
      { messages },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[guestbook] GET failed:", error);
    return Response.json({ error: "Failed to load messages." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = (payload ?? {}) as Record<string, unknown>;

  // Honeypot: bots fill hidden fields. Pretend success and drop it silently.
  if (typeof data.website === "string" && data.website.trim() !== "") {
    return Response.json({ ok: true }, { status: 202 });
  }

  const validation = validateSubmission({
    nick: data.nick,
    body: data.body,
    status: data.status,
  });
  if (!validation.ok) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  const ipHash = hashIp(clientIp(request));
  const limit = await rateLimit(ipHash, POST_LIMIT, POST_WINDOW_SEC);
  if (!limit.ok) {
    return Response.json(
      { error: `Slow down — try again in ${limit.retryAfter}s.` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  try {
    const message = await guestbookStore().add({
      nick: validation.nick,
      body: validation.body,
      status: validation.status,
      ipHash,
    });
    return Response.json({ message }, { status: 201 });
  } catch (error) {
    console.error("[guestbook] POST failed:", error);
    return Response.json({ error: "Failed to post message." }, { status: 500 });
  }
}

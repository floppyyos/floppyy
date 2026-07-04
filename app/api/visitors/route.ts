import { getVisitors, incrementVisitors } from "@/lib/counter/store";
import { clientIp, hashIp, rateLimit } from "@/lib/guestbook/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEDUP_WINDOW_SEC = 60 * 60 * 12;

export async function GET() {
  try {
    return Response.json({ count: await getVisitors() }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[visitors] GET failed:", error);
    return Response.json({ error: "Failed to load counter." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ipHash = hashIp(clientIp(request));
    const fresh = await rateLimit(`visit:${ipHash}`, 1, DEDUP_WINDOW_SEC);
    const count = fresh.ok ? await incrementVisitors() : await getVisitors();
    return Response.json({ count }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[visitors] POST failed:", error);
    return Response.json({ error: "Failed to update counter." }, { status: 500 });
  }
}

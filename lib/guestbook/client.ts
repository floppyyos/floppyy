import { MAX_PAGE_SIZE, type GuestbookMessage } from "./types";

let cachedMessages: GuestbookMessage[] | null = null;
let cacheAt = 0;
let inFlight: Promise<GuestbookMessage[]> | null = null;

let cachedHistory: GuestbookMessage[] | null = null;
let historyAt = 0;
let historyInFlight: Promise<GuestbookMessage[]> | null = null;

const CACHE_TTL_MS = 2_500;
const HISTORY_TTL_MS = 30_000;
const HISTORY_MAX_PAGES = 40;

async function requestPage(params?: { before?: number; limit?: number }): Promise<GuestbookMessage[]> {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.before) query.set("before", String(params.before));
  const serialized = query.toString();
  const suffix = serialized ? `?${serialized}` : "";

  const response = await fetch(`/api/guestbook${suffix}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Guestbook request failed");
  const data = (await response.json()) as { messages?: GuestbookMessage[] };
  return data.messages ?? [];
}

export async function fetchGuestbookMessages(options?: { force?: boolean }): Promise<GuestbookMessage[]> {
  const now = Date.now();
  if (!options?.force && cachedMessages && now - cacheAt < CACHE_TTL_MS) return cachedMessages;
  if (inFlight) return inFlight;

  inFlight = requestPage()
    .then((messages) => {
      cachedMessages = messages;
      cacheAt = Date.now();
      return cachedMessages;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export async function fetchGuestbookHistory(options?: { force?: boolean }): Promise<GuestbookMessage[]> {
  const now = Date.now();
  if (!options?.force && cachedHistory && now - historyAt < HISTORY_TTL_MS) return cachedHistory;
  if (historyInFlight) return historyInFlight;

  historyInFlight = (async () => {
    const pages: GuestbookMessage[][] = [];
    let before: number | undefined;

    for (let page = 0; page < HISTORY_MAX_PAGES; page += 1) {
      const messages = await requestPage({ limit: MAX_PAGE_SIZE, before });
      if (messages.length === 0) break;
      pages.unshift(messages);
      if (messages.length < MAX_PAGE_SIZE) break;
      before = messages[0].id;
      if (!Number.isFinite(before) || before <= 1) break;
    }

    const history = pages.flat();
    cachedHistory = history;
    historyAt = Date.now();

    const newest = pages[pages.length - 1];
    if (newest) {
      cachedMessages = newest;
      cacheAt = Date.now();
    }
    return history;
  })().finally(() => {
    historyInFlight = null;
  });

  return historyInFlight;
}

export function mergeGuestbookMessages(
  current: GuestbookMessage[],
  incoming: GuestbookMessage[],
): GuestbookMessage[] {
  if (incoming.length === 0) return current;
  if (current.length === 0) return incoming;

  const windowStart = incoming[0].id;
  const windowEnd = incoming[incoming.length - 1].id;
  const outside = current.filter((m) => m.id < windowStart || m.id > windowEnd);
  const byId = new Map<number, GuestbookMessage>();
  for (const message of [...outside, ...incoming]) byId.set(message.id, message);
  return [...byId.values()].sort((a, b) => a.id - b.id);
}

export function rememberGuestbookMessage(message: GuestbookMessage): void {
  if (cachedMessages && !cachedMessages.some((item) => item.id === message.id)) {
    cachedMessages = [...cachedMessages, message];
    cacheAt = Date.now();
  }
  if (cachedHistory && !cachedHistory.some((item) => item.id === message.id)) {
    cachedHistory = [...cachedHistory, message];
    historyAt = Date.now();
  }
}

export function forgetGuestbookMessage(id: number): void {
  if (cachedMessages) {
    cachedMessages = cachedMessages.filter((message) => message.id !== id);
    cacheAt = Date.now();
  }
  if (cachedHistory) {
    cachedHistory = cachedHistory.filter((message) => message.id !== id);
    historyAt = Date.now();
  }
}

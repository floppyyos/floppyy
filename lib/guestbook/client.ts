import type { GuestbookMessage } from "./types";

let cachedMessages: GuestbookMessage[] | null = null;
let cacheAt = 0;
let inFlight: Promise<GuestbookMessage[]> | null = null;

const CACHE_TTL_MS = 2_500;

export async function fetchGuestbookMessages(options?: { force?: boolean }): Promise<GuestbookMessage[]> {
  const now = Date.now();
  if (!options?.force && cachedMessages && now - cacheAt < CACHE_TTL_MS) return cachedMessages;
  if (inFlight) return inFlight;

  inFlight = fetch("/api/guestbook", { cache: "no-store" })
    .then(async (response) => {
      if (!response.ok) throw new Error("Guestbook request failed");
      const data = (await response.json()) as { messages?: GuestbookMessage[] };
      cachedMessages = data.messages ?? [];
      cacheAt = Date.now();
      return cachedMessages;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export function rememberGuestbookMessage(message: GuestbookMessage): void {
  if (!cachedMessages) return;
  if (cachedMessages.some((item) => item.id === message.id)) return;
  cachedMessages = [...cachedMessages, message];
  cacheAt = Date.now();
}

export function forgetGuestbookMessage(id: number): void {
  if (!cachedMessages) return;
  cachedMessages = cachedMessages.filter((message) => message.id !== id);
  cacheAt = Date.now();
}

export const GUESTBOOK_CHANNEL = "#floppyy";

export const NICK_MAX_LENGTH = 20;
export const NICK_MIN_LENGTH = 1;
export const BODY_MAX_LENGTH = 500;
export const BODY_MIN_LENGTH = 1;
export const DEFAULT_PAGE_SIZE = 60;
export const MAX_PAGE_SIZE = 100;

export const USER_STATUSES = ["online", "ffc", "away", "na", "occupied", "dnd"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const STATUS_META: Record<UserStatus, { label: string; color: string }> = {
  online: { label: "Online", color: "#00b000" },
  ffc: { label: "Free for Chat", color: "#00c0c0" },
  away: { label: "Away", color: "#e0a000" },
  na: { label: "N/A", color: "#e07000" },
  occupied: { label: "Occupied", color: "#d02020" },
  dnd: { label: "Do Not Disturb", color: "#a00000" },
};

export function isUserStatus(value: unknown): value is UserStatus {
  return typeof value === "string" && (USER_STATUSES as readonly string[]).includes(value);
}

// Statuses offered in the composer dropdown. STATUS_META still covers every
// status so older messages using other values keep rendering correctly.
export const STATUS_OPTIONS: UserStatus[] = ["online", "dnd"];

export type GuestbookMessage = {
  id: number;
  nick: string;
  body: string;
  color: number;
  status: UserStatus;
  createdAt: string;
};

export const NICK_COLORS = [
  "#00007f",
  "#009300",
  "#7f0000",
  "#9c009c",
  "#fc7f00",
  "#00007f",
  "#009393",
  "#7f007f",
  "#3f3f3f",
  "#00557f",
  "#7f3f00",
  "#005f2f",
];

export function nickColorIndex(nick: string): number {
  let hash = 0;
  for (let i = 0; i < nick.length; i += 1) {
    hash = (hash * 31 + nick.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % NICK_COLORS.length;
}

export function nickColor(nick: string, index?: number): string {
  const i = typeof index === "number" ? index % NICK_COLORS.length : nickColorIndex(nick);
  return NICK_COLORS[i] ?? NICK_COLORS[0];
}

function stripControlChars(value: string): string {
  let out = "";
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (code === 9 || code >= 32) out += char;
  }
  return out;
}

export function sanitizeNick(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const cleaned = stripControlChars(raw).replace(/\s+/g, " ").trim();
  return cleaned.slice(0, NICK_MAX_LENGTH);
}

export function sanitizeBody(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const cleaned = stripControlChars(raw).replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  return cleaned.slice(0, BODY_MAX_LENGTH);
}

// Banned words (RU + EN) to keep the guestbook clean of spam and ads.
export const BANNED_WORDS = [
  // Russian
  "спам",
  "казино",
  "казик",
  "секс",
  "порно",
  "порн",
  "виагра",
  "ставка",
  "ставки",
  "бет",
  "беттинг",
  "букмекер",
  "гэмблинг",
  "покер",
  "рулетка",
  "джекпот",
  "слоты",
  "крипта",
  "криптовалюта",
  "форекс",
  "займ",
  "кредит",
  "заработок",
  "реклама",
  "проститутки",
  "наркотик",
  // English
  "spam",
  "casino",
  "sex",
  "porn",
  "porno",
  "viagra",
  "xxx",
  "nsfw",
  "bet",
  "bets",
  "betting",
  "gamble",
  "gambling",
  "poker",
  "roulette",
  "slots",
  "jackpot",
  "bookmaker",
  "bookie",
  "wager",
  "crypto",
  "forex",
  "loan",
  "nude",
  "escort",
  "onlyfans",
];

const BANNED_WORD_PATTERNS = BANNED_WORDS.map(
  (word) => new RegExp(`(^|[^\\p{L}\\p{N}])${word}([^\\p{L}\\p{N}]|$)`, "iu"),
);

// spam ("c4sino", "p0rn") still trips the filter.
const LEET_MAP: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "@": "a",
  $: "s",
};

function normalizeForFilter(text: string): string {
  return text
    .toLowerCase()
    .replace(/[013457@$]/g, (char) => LEET_MAP[char] ?? char);
}

export function containsBannedWord(text: string): boolean {
  const normalized = normalizeForFilter(text);
  return BANNED_WORD_PATTERNS.some((pattern) => pattern.test(normalized));
}

export type ValidationResult =
  | { ok: true; nick: string; body: string; status: UserStatus }
  | { ok: false; error: string };

export function validateSubmission(input: {
  nick: unknown;
  body: unknown;
  status: unknown;
}): ValidationResult {
  const nick = sanitizeNick(input.nick);
  const body = sanitizeBody(input.body);

  if (nick.length < NICK_MIN_LENGTH) return { ok: false, error: "Please enter a nickname." };
  if (body.length < BODY_MIN_LENGTH) return { ok: false, error: "Message cannot be empty." };

  if (containsBannedWord(nick) || containsBannedWord(body)) {
    return { ok: false, error: "Your message was blocked by the spam filter. Keep it friendly!" };
  }

  const status = isUserStatus(input.status) ? input.status : "online";
  return { ok: true, nick, body, status };
}

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

// Spam / advertising words (RU + EN). Matched with word boundaries so benign
// words that merely contain them (e.g. "better" vs "bet") are not blocked.
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

// Profanity / slurs (RU + EN). These are also matched in a "compacted" form,
// so obfuscation like "f u c k", "f.u.c.k", "sh1t" or "fuuuck" is caught too.
// Roots are used for the Russian mat so inflected forms are covered.
export const PROFANITY_WORDS = [
  // English
  "fuck",
  "fucker",
  "fucking",
  "motherfucker",
  "shit",
  "bullshit",
  "bitch",
  "cunt",
  "asshole",
  "dickhead",
  "bastard",
  "slut",
  "whore",
  "faggot",
  "nigger",
  "nigga",
  "wanker",
  "twat",
  "prick",
  "cock",
  "pussy",
  "dick",
  "jerk off",
  "jackoff",
  // Russian (mat) — roots cover inflected forms
  "хуй",
  "хуе",
  "хуё",
  "хуя",
  "хуйн",
  "пизд",
  "еба",
  "ебат",
  "ебан",
  "ебал",
  "ебло",
  "выеб",
  "заеб",
  "наеб",
  "уеб",
  "бляд",
  "блять",
  "бля",
  "сука",
  "суки",
  "сук",
  "гандон",
  "гондон",
  "мудак",
  "мудил",
  "долбоеб",
  "долбоёб",
  "залуп",
  "манда",
  "пидор",
  "пидар",
  "пидорас",
  "пидарас",
];

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

// Escape a word so it can be embedded safely in a RegExp.
function escapeForRegExp(word: string): string {
  return word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Lowercase + de-leet, keeping the original layout so word boundaries stay meaningful.
function normalizeForFilter(text: string): string {
  return text
    .toLowerCase()
    .replace(/[013457@$]/g, (char) => LEET_MAP[char] ?? char);
}

// ── Spam / advertising: hard block ──────────────────────────────────────────
const BANNED_WORD_PATTERNS = BANNED_WORDS.map(
  (word) => new RegExp(`(^|[^\\p{L}\\p{N}])${escapeForRegExp(word)}([^\\p{L}\\p{N}]|$)`, "iu"),
);

// Ads/spam are rejected outright — they shouldn't be softly masked.
export function containsSpam(text: string): boolean {
  const normalized = normalizeForFilter(text);
  return BANNED_WORD_PATTERNS.some((pattern) => pattern.test(normalized));
}

// ── Profanity: soft censor (mask with asterisks) ────────────────────────────
// Per-letter look-alikes so leetspeak ("sh1t", "f4ggot") is still masked.
const LEET_VARIANTS: Record<string, string> = {
  a: "a4@",
  b: "b8",
  e: "e3",
  g: "g9",
  i: "i1!|",
  l: "l1",
  o: "o0",
  s: "s5$",
  t: "t7",
  z: "z2",
};

// Separators tolerated *between* characters, so "f u c k" / "f.u.c.k" is caught.
const CHAR_SEPARATOR = "[\\s._\\-*+~]*";

function charClass(ch: string): string {
  const variants = LEET_VARIANTS[ch];
  return variants ? `[${variants}]` : escapeForRegExp(ch);
}

// A fuzzy pattern for one token: leet-tolerant, allows separators and repeats
// ("fuuuck", "f-u-c-k"). Spaces inside multi-word tokens are dropped.
function fuzzyWordPattern(word: string): string {
  return word
    .replace(/\s+/g, "")
    .split("")
    .map((ch) => `${charClass(ch)}+`)
    .join(CHAR_SEPARATOR);
}

// Cyrillic entries are treated as roots so inflected forms ("пиздец", "хуйня")
// get masked whole; Latin entries are matched as standalone words.
function isRoot(word: string): boolean {
  return /[а-яё]/i.test(word);
}

function buildCensorRegex(words: string[], allowSuffix: boolean): RegExp | null {
  if (words.length === 0) return null;
  const alternation = words.map(fuzzyWordPattern).join("|");
  const suffix = allowSuffix ? "[\\p{L}\\p{N}]*" : "";
  return new RegExp(
    `(?<![\\p{L}\\p{N}])(?:${alternation})${suffix}(?![\\p{L}\\p{N}])`,
    "giu",
  );
}

const PROFANITY_EXACT_RE = buildCensorRegex(
  PROFANITY_WORDS.filter((word) => !isRoot(word)),
  false,
);
const PROFANITY_ROOT_RE = buildCensorRegex(
  PROFANITY_WORDS.filter(isRoot),
  true,
);

function maskMatch(match: string): string {
  const letters = match.replace(/[^\p{L}\p{N}]/gu, "").length;
  return "*".repeat(Math.max(3, letters));
}

// Replaces any profanity with asterisks, leaving the rest of the text intact.
export function censorProfanity(text: string): string {
  let out = text;
  if (PROFANITY_EXACT_RE) out = out.replace(PROFANITY_EXACT_RE, maskMatch);
  if (PROFANITY_ROOT_RE) out = out.replace(PROFANITY_ROOT_RE, maskMatch);
  return out;
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

  // Ads / spam are rejected; profanity is softly masked instead of blocked.
  if (containsSpam(nick) || containsSpam(body)) {
    return { ok: false, error: "Your message was blocked by the spam filter. Keep it friendly!" };
  }

  const status = isUserStatus(input.status) ? input.status : "online";
  return { ok: true, nick: censorProfanity(nick), body: censorProfanity(body), status };
}

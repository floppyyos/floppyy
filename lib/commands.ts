import type { WindowId } from "./windows";

export const commands: Record<string, WindowId | "help"> = {
  about: "about",
  projects: "projects",
  games: "games",
  music: "music",
  winamp: "music",
  screensaver: "screensaver",
  defrag: "defrag",
  calculator: "calculator",
  calc: "calculator",
  msdos: "msdos",
  cmd: "msdos",
  paint: "paint",
  notepad: "notepad",
  computer: "computer",
  ie: "ie-browser",
  iexplore: "ie-browser",
  explorer: "ie-browser",
  netscape: "netscape",
  doom: "doom",
  pinball: "games",
  contact: "outlook",
  help: "help",
};

/** URL-like patterns that should open in the browser */
export function isUrl(value: string): boolean {
  const v = value.trim().toLowerCase();
  return (
    v.startsWith("http://") ||
    v.startsWith("https://") ||
    v.startsWith("www.") ||
    /^[a-z0-9-]+\.(com|net|org|io|gov|edu|co|uk|de|fr|ru|jp)(\/.*)?$/.test(v)
  );
}

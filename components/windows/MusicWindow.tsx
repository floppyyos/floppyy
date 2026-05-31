"use client";

import type { WindowComponentProps } from "@/lib/windows";
import { WinampPlayer } from "@/components/winamp/WinampPlayer";

export function MusicWindow({ playSound }: WindowComponentProps) {
  return <WinampPlayer playSound={playSound} />;
}

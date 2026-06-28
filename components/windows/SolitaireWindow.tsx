"use client";

import { Solitaire } from "@/components/games/Solitaire";
import type { WindowComponentProps } from "@/lib/windows";

export function SolitaireWindow({ playSound }: WindowComponentProps) {
  return <Solitaire playSound={playSound} />;
}

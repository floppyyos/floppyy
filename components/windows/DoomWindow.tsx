"use client";

import type { WindowComponentProps } from "@/lib/windows";
import { Doom } from "@/components/games/Doom";

export function DoomWindow({ playSound }: WindowComponentProps) {
  return (
    <div className="flex h-full flex-col bg-black">
      <Doom playSound={playSound} />
    </div>
  );
}

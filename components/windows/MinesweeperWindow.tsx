"use client";

import { Minesweeper } from "@/components/games/Minesweeper";
import type { WindowComponentProps } from "@/lib/windows";

export function MinesweeperWindow({ playSound }: WindowComponentProps) {
  return (
    <div className="flex h-full items-start justify-center bg-[#c0c0c0] p-[6px]">
      <Minesweeper playSound={playSound} />
    </div>
  );
}

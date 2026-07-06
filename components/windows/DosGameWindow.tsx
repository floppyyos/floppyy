"use client";

import type { WindowComponentProps } from "@/lib/windows";
import { DOS_GAMES, type DosGameId, JsDosGame } from "@/components/games/JsDosGame";

function isDosGameId(id: string): id is DosGameId {
  return id in DOS_GAMES;
}

export function DosGameWindow({ window, playSound }: WindowComponentProps) {
  const game = isDosGameId(window.id) ? DOS_GAMES[window.id] : DOS_GAMES.doom;
  return (
    <div className="flex h-full flex-col bg-black">
      <JsDosGame bundleUrl={game.bundle} playSound={playSound} />
    </div>
  );
}

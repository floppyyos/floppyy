"use client";

import { DOS_GAMES, JsDosGame } from "@/components/games/JsDosGame";

export function Doom({ playSound }: { playSound: (name: string) => void }) {
  return <JsDosGame bundleUrl={DOS_GAMES.doom.bundle} playSound={playSound} />;
}

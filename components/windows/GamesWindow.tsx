"use client";

import { useState } from "react";
import type { WindowComponentProps } from "@/lib/windows";
import { Minesweeper } from "@/components/games/Minesweeper";
import { Solitaire } from "@/components/games/Solitaire";
import { DOS_GAMES, JsDosGame } from "@/components/games/JsDosGame";

type GameTab = "mines" | "solitaire" | "doom" | "duke3d" | "wolf3d" | "dune2" | "warcraft";

const TABS: [GameTab, string][] = [
  ["mines", "Minesweeper"],
  ["solitaire", "Solitaire"],
  ["doom", "Doom"],
  ["duke3d", "Duke 3D"],
  ["wolf3d", "Wolfenstein"],
  ["dune2", "Dune II"],
  ["warcraft", "WarCraft"],
];

function payloadToTab(payload?: string): GameTab {
  if (payload && TABS.some(([id]) => id === payload)) return payload as GameTab;
  return "mines";
}

export function GamesWindow({ playSound, window }: WindowComponentProps) {
  const [tab, setTab] = useState<GameTab>(() => payloadToTab(window.payload));
  const [prevPayload, setPrevPayload] = useState(window.payload);

  // Sync the active tab when the window is re-opened with a different payload.
  if (window.payload !== prevPayload) {
    setPrevPayload(window.payload);
    setTab(payloadToTab(window.payload));
  }

  const dosGame = tab in DOS_GAMES ? DOS_GAMES[tab as keyof typeof DOS_GAMES] : null;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex flex-wrap gap-1">
        {TABS.map(([id, label]) => (
          <button key={id} className={`win-button ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>
      <div className="win-bevel-inset min-h-0 flex-1 overflow-auto bg-[#c0c0c0] p-3">
        {tab === "mines" && <Minesweeper playSound={playSound} />}
        {tab === "solitaire" && <Solitaire playSound={playSound} />}
        {dosGame && <JsDosGame key={tab} bundleUrl={dosGame.bundle} playSound={playSound} />}
      </div>
    </div>
  );
}

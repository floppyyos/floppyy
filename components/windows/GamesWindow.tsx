"use client";

import { useEffect, useState } from "react";
import type { WindowComponentProps } from "@/lib/windows";
import { Minesweeper } from "@/components/games/Minesweeper";
import { Solitaire } from "@/components/games/Solitaire";
import { Snake } from "@/components/games/Snake";
import { Doom } from "@/components/games/Doom";

type GameTab = "mines" | "solitaire" | "snake" | "doom";

function payloadToTab(payload?: string): GameTab {
  if (payload === "solitaire" || payload === "snake" || payload === "doom") return payload;
  return "mines";
}

export function GamesWindow({ playSound, window }: WindowComponentProps) {
  const [tab, setTab] = useState<GameTab>(() => payloadToTab(window.payload));

  useEffect(() => {
    setTab(payloadToTab(window.payload));
  }, [window.payload]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex gap-1">
        {[
          ["mines", "Minesweeper"],
          ["solitaire", "Solitaire"],
          ["snake", "Snake"],
          ["doom", "Doom"],
        ].map(([id, label]) => (
          <button key={id} className={`win-button ${tab === id ? "active" : ""}`} onClick={() => setTab(id as GameTab)}>
            {label}
          </button>
        ))}
      </div>
      <div className="win-bevel-inset min-h-0 flex-1 overflow-auto bg-[#c0c0c0] p-3">
        {tab === "mines" && <Minesweeper playSound={playSound} />}
        {tab === "solitaire" && <Solitaire playSound={playSound} />}
        {tab === "snake" && <Snake playSound={playSound} />}
        {tab === "doom" && <Doom playSound={playSound} />}
      </div>
    </div>
  );
}

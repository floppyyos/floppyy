"use client";

import type { ScreensaverMode } from "@/hooks/useScreensaver";
import { PipesScreensaver } from "./PipesScreensaver";
import { StarfieldScreensaver } from "./StarfieldScreensaver";

export function ScreensaverOverlay({ mode, onExit }: { mode: ScreensaverMode; onExit: () => void }) {
  return (
    <div className="fixed inset-0 z-[9000]" onPointerMove={onExit} onPointerDown={onExit} onKeyDown={onExit} tabIndex={0}>
      {mode === "pipes" && <PipesScreensaver />}
      {mode === "stars" && <StarfieldScreensaver />}
    </div>
  );
}

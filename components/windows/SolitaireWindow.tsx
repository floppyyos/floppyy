"use client";

import { Solitaire } from "@/components/games/Solitaire";
import type { WindowComponentProps } from "@/lib/windows";

export function SolitaireWindow({ playSound, window: win, closeWindow }: WindowComponentProps) {
  const mobileScale = win.width < 560 ? Math.max(0.48, Math.min(1, (win.width - 18) / 720)) : 1;
  const scaled = mobileScale < 1;

  if (!scaled) {
    return <Solitaire playSound={playSound} onExit={() => closeWindow(win.instanceId)} />;
  }

  return (
    <div className="h-full overflow-auto bg-[#c0c0c0]">
      <div style={{ width: 720 * mobileScale, height: 500 * mobileScale }}>
        <div
          style={{
            width: 720,
            height: 500,
            transform: `scale(${mobileScale})`,
            transformOrigin: "top left",
          }}
        >
          <Solitaire playSound={playSound} onExit={() => closeWindow(win.instanceId)} />
        </div>
      </div>
    </div>
  );
}

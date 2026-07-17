"use client";

import { Solitaire } from "@/components/games/Solitaire";
import type { WindowComponentProps } from "@/lib/windows";

export function SolitaireWindow({ playSound, window: win, closeWindow }: WindowComponentProps) {
  const mobileBaseWidth = 590;
  const mobileScale = win.width < 560 ? Math.max(0.58, Math.min(1, (win.width - 18) / mobileBaseWidth)) : 1;
  const scaled = mobileScale < 1;

  if (!scaled) {
    return <Solitaire playSound={playSound} onExit={() => closeWindow(win.instanceId)} />;
  }

  return (
    <div className="overflow-auto bg-[#c0c0c0]">
      <div style={{ width: mobileBaseWidth * mobileScale, height: 500 * mobileScale }}>
        <div
          style={{
            width: mobileBaseWidth,
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

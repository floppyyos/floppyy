"use client";

import { useLayoutEffect, useRef } from "react";
import { Minesweeper } from "@/components/games/Minesweeper";
import type { WindowComponentProps } from "@/lib/windows";

// Chrome overhead around the game board: wrapper padding (12) + window frame
// content padding (8) + frame border (6) for width; title bar (20) + gaps for height.
const CHROME_W = 26;
const CHROME_H = 47;

export function MinesweeperWindow({ playSound, window: win, closeWindow, resizeWindow }: WindowComponentProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const instanceId = win.instanceId;

  // Snap the window to the exact size of the current board (Beginner / Intermediate /
  // Expert / Custom) whenever the board's intrinsic size changes.
  useLayoutEffect(() => {
    const el = boardRef.current;
    if (!el || !resizeWindow) return;
    const apply = () => resizeWindow(instanceId, el.offsetWidth + CHROME_W, el.offsetHeight + CHROME_H);
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, [resizeWindow, instanceId]);

  return (
    <div className="flex h-full items-start justify-center overflow-auto bg-[#c0c0c0] p-[6px]">
      <div ref={boardRef} className="inline-block">
        <Minesweeper playSound={playSound} onExit={() => closeWindow(instanceId)} />
      </div>
    </div>
  );
}

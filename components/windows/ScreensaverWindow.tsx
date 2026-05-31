"use client";

import type { WindowComponentProps } from "@/lib/windows";

export function ScreensaverWindow({ startScreensaver }: WindowComponentProps) {
  return (
    <div className="space-y-3">
      <div className="win-bevel-inset bg-white p-3">
        Choose a screensaver. Any mouse movement or key press exits.
      </div>
      <div className="grid gap-2">
        <button className="win-button text-left" onClick={() => startScreensaver("stars")}>
          ★ Starfield
        </button>
        <button className="win-button text-left" onClick={() => startScreensaver("pipes")}>
          ║ 3D Pipes
        </button>
      </div>
    </div>
  );
}

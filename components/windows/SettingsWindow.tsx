"use client";

import type { WindowComponentProps } from "@/lib/windows";

export function SettingsWindow({ startScreensaver, notify }: WindowComponentProps) {
  return (
    <div className="grid gap-3">
      <div className="win-bevel-inset bg-white p-3">
        <h3 className="mb-2 font-bold">Display</h3>
        <div className="flex items-center gap-3">
          <span className="inline-block h-10 w-14 bg-[#008080]" />
          <span>Color scheme: Floppyy Standard, delightfully teal.</span>
        </div>
      </div>
      <div className="win-bevel-inset bg-white p-3">
        <h3 className="mb-2 font-bold">Sound</h3>
        <button className="win-button" onClick={() => notify("Sound scheme: Clicky Little Computer")}>
          Test Sound
        </button>
      </div>
      <div className="win-bevel-inset bg-white p-3">
        <h3 className="mb-2 font-bold">Screensaver</h3>
        <div className="flex flex-wrap gap-2">
          <button className="win-button" onClick={() => startScreensaver("stars")}>
            Starfield
          </button>
          <button className="win-button" onClick={() => startScreensaver("pipes")}>
            3D Pipes
          </button>
          <button className="win-button" onClick={() => startScreensaver("maze")}>
            3D Maze
          </button>
          <button className="win-button" onClick={() => startScreensaver("mystify")}>
            Mystify
          </button>
          <button className="win-button" onClick={() => startScreensaver("flying-windows")}>
            Flying Windows
          </button>
        </div>
      </div>
    </div>
  );
}

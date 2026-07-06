"use client";

import { useEffect, useState } from "react";

const PLAYER_URL = "/game-assets/player.html";

export const DOS_GAMES = {
  doom: { title: "DOOM", bundle: "/game-assets/doom/doom.jsdos" },
  duke3d: { title: "Duke Nukem 3D", bundle: "/game-assets/duke3d/duke3d.jsdos" },
  wolf3d: { title: "Wolfenstein 3D", bundle: "/game-assets/wolf3d/wolf3d.jsdos" },
  dune2: { title: "Dune II", bundle: "/game-assets/dune2/dune2.jsdos" },
  warcraft: { title: "WarCraft: Orcs & Humans", bundle: "/game-assets/warcraft/warcraft.jsdos" },
} as const;

export type DosGameId = keyof typeof DOS_GAMES;

function detectMobile(): boolean {
  if (typeof window === "undefined") return false;
  const coarse = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  const noHover = window.matchMedia?.("(hover: none)")?.matches ?? false;
  const narrow = window.innerWidth < 1024;
  return (coarse || noHover) && narrow;
}

export function JsDosGame({
  bundleUrl,
  playSound,
}: {
  bundleUrl: string;
  playSound?: (name: string) => void;
}) {
  const [isMobile, setIsMobile] = useState<boolean>(detectMobile);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(detectMobile());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (isMobile) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-black p-6 text-center font-mono text-white">
        <span className="text-4xl">🖥️</span>
        <p className="text-base font-bold text-yellow-400">Desktop only</p>
        <p className="max-w-xs text-xs leading-relaxed text-gray-300">
          This game needs a keyboard and mouse. Open Floppyy on a desktop or laptop computer to play.
        </p>
      </div>
    );
  }

  const src = `${PLAYER_URL}?bundle=${encodeURIComponent(bundleUrl)}`;

  return (
    <div className="relative flex h-full w-full flex-col bg-black">
      <iframe
        key={bundleUrl}
        src={src}
        title="DOS game"
        className="min-h-0 flex-1 border-0"
        allow="autoplay; fullscreen; gamepad"
        allowFullScreen
        onLoad={() => {
          setLoaded(true);
          playSound?.("click");
        }}
      />

      {!loaded && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black font-mono text-red-600">
          <pre className="text-[10px] leading-tight sm:text-xs">
{`
 ██████╗  ██████╗ ███████╗
 ██╔══██╗██╔═══██╗██╔════╝
 ██║  ██║██║   ██║███████╗
 ██║  ██║██║   ██║╚════██║
 ██████╔╝╚██████╔╝███████║
 ╚═════╝  ╚═════╝ ╚══════╝
`}
          </pre>
          <p className="animate-pulse text-xs text-gray-400">Loading game…</p>
        </div>
      )}
    </div>
  );
}

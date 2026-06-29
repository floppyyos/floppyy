"use client";

import type { WindowComponentProps } from "@/lib/windows";
import { WinampPlayer } from "@/components/winamp/WinampPlayer";

export function MusicWindow({ playSound, window, closeWindow, minimizeWindow, muted }: WindowComponentProps) {
  return (
    <WinampPlayer
      playSound={playSound}
      muted={muted}
      onClose={() => closeWindow(window.instanceId)}
      onMinimize={() => minimizeWindow?.(window.instanceId)}
    />
  );
}

"use client";

import type { WindowComponentProps } from "@/lib/windows";
import { WinampPlayer } from "@/components/winamp/WinampPlayer";

export function MusicWindow({ playSound, window, closeWindow, minimizeWindow }: WindowComponentProps) {
  return (
    <WinampPlayer
      playSound={playSound}
      onClose={() => closeWindow(window.instanceId)}
      onMinimize={() => minimizeWindow?.(window.instanceId)}
    />
  );
}

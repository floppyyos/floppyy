"use client";

import { useState } from "react";
import { useClock } from "@/hooks/useClock";

export function SystemTray({
  internetConnected,
  muted,
  volume,
  onVolumeChange,
  onDisconnectRequest,
  onMcAfeeOpen,
  onToggleMute,
  onClockOpen,
}: {
  internetConnected: boolean;
  muted: boolean;
  volume: number;
  onVolumeChange: (value: number) => void;
  onDisconnectRequest: () => void;
  onMcAfeeOpen: () => void;
  onToggleMute: () => void;
  onClockOpen: () => void;
}) {
  const time = useClock();
  const [volOpen, setVolOpen] = useState(false);

  // useClock re-renders every second, so this stays current for the tooltip.
  const fullDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="ml-auto flex h-[22px] items-center gap-[6px] px-[8px] text-[11px]"
      style={{ boxShadow: "inset -1px -1px #ffffff, inset 1px 1px #808080" }}
    >
      {internetConnected && (
        <button
          aria-label="Disconnect Internet"
          className="desktop-icon-button flex items-center"
          title={"Internet: Connected\nSpeed: 56 kbps"}
          onDoubleClick={(event) => {
            event.stopPropagation();
            onDisconnectRequest();
          }}
        >
          <img src="/icons/connection.png" alt="" width={16} height={16} draggable={false} style={{ imageRendering: "pixelated" }} />
        </button>
      )}
      <button
        aria-label="McAfee Download Scan Properties"
        className="desktop-icon-button flex items-center"
        title="McAfee Download Scan"
        onDoubleClick={(event) => {
          event.stopPropagation();
          onMcAfeeOpen();
        }}
      >
        <img src="/icons/McAfee.png" alt="" width={16} height={16} draggable={false} style={{ imageRendering: "pixelated" }} />
      </button>

      {/* Volume */}
      <div className="relative flex items-center">
        <button
          aria-label="Volume"
          className="desktop-icon-button relative flex items-center"
          title={muted ? "Volume: Muted" : `Volume: ${Math.round(volume * 100)}%`}
          onClick={() => setVolOpen((open) => !open)}
        >
          <img src="/icons/speaker.png" alt="" width={16} height={16} draggable={false} style={{ imageRendering: "pixelated" }} />
          {muted && (
            <span className="pointer-events-none absolute left-[9px] top-[2px] text-[10px] font-bold leading-none text-[#ff0000]">
              ×
            </span>
          )}
        </button>

        {volOpen && (
          <>
            <div className="fixed inset-0 z-[4990]" onClick={() => setVolOpen(false)} />
            <div
              className="win-bevel absolute bottom-[26px] right-0 z-[5000] flex flex-col items-center gap-[6px] bg-[#c0c0c0] px-[10px] py-[10px]"
              onClick={(event) => event.stopPropagation()}
            >
              <span className="text-[10px] font-bold">Volume</span>
              <input
                type="range"
                min={0}
                max={100}
                value={muted ? 0 : Math.round(volume * 100)}
                onChange={(event) => onVolumeChange(Number(event.target.value) / 100)}
                aria-label="Volume level"
                style={{ writingMode: "vertical-lr", direction: "rtl", height: 90, width: 22 }}
              />
              <label className="flex items-center gap-[4px] text-[10px]">
                <input type="checkbox" checked={muted} onChange={onToggleMute} />
                Mute
              </label>
            </div>
          </>
        )}
      </div>

      <button
        className="desktop-icon-button min-w-[52px] text-center tabular-nums"
        title={`${fullDate}\nDouble-click to open Date/Time`}
        aria-label={`Time ${time}, ${fullDate}. Double-click to open Date and Time properties.`}
        onDoubleClick={(event) => {
          event.stopPropagation();
          onClockOpen();
        }}
      >
        {time}
      </button>
    </div>
  );
}

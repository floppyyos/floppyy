"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
              className="win-bevel absolute bottom-[26px] right-0 z-[5000] flex flex-col items-center bg-[#c0c0c0] px-[8px] pb-[8px] pt-[6px]"
              onClick={(event) => event.stopPropagation()}
            >
              <span className="mb-[6px] text-[11px] font-bold">Volume</span>
              <Win98VolumeSlider
                value={muted ? 0 : Math.round(volume * 100)}
                onChange={(v) => onVolumeChange(v / 100)}
              />
              <div className="my-[7px] h-px w-full bg-[#808080] shadow-[0_1px_#ffffff]" />
              <label className="flex cursor-default items-center gap-[5px] self-start text-[11px]">
                <input
                  type="checkbox"
                  checked={muted}
                  onChange={onToggleMute}
                />
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

function Win98VolumeSlider({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const TRACK_H = 104;
  const THUMB_H = 12;
  const TRAVEL = TRACK_H - THUMB_H;
  const TICKS = 6;

  const clamp = (n: number) => Math.max(0, Math.min(100, n));

  const valueFromClientY = useCallback((clientY: number) => {
    const el = trackRef.current;
    if (!el) return value;
    const rect = el.getBoundingClientRect();
    const y = clientY - rect.top - THUMB_H / 2;
    const ratio = y / TRAVEL;
    return clamp(Math.round((1 - ratio) * 100));
  }, [TRAVEL, value]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => onChange(valueFromClientY(e.clientY));
    const onUp = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, onChange, valueFromClientY]);

  const thumbTop = (1 - value / 100) * TRAVEL;

  return (
    <div
      className="relative flex cursor-default select-none"
      style={{ height: TRACK_H, width: 46 }}
      ref={trackRef}
      role="slider"
      aria-label="Volume level"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      tabIndex={0}
      onPointerDown={(e) => {
        e.preventDefault();
        setDragging(true);
        onChange(valueFromClientY(e.clientY));
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowRight") { e.preventDefault(); onChange(clamp(value + 5)); }
        if (e.key === "ArrowDown" || e.key === "ArrowLeft") { e.preventDefault(); onChange(clamp(value - 5)); }
      }}
    >
      <div className="absolute left-0 top-0 flex flex-col justify-between" style={{ height: TRACK_H, paddingTop: THUMB_H / 2, paddingBottom: THUMB_H / 2 }}>
        {Array.from({ length: TICKS }).map((_, i) => (
          <div key={i} className="h-px w-[5px] bg-[#404040]" />
        ))}
      </div>
      <div className="absolute right-0 top-0 flex flex-col justify-between" style={{ height: TRACK_H, paddingTop: THUMB_H / 2, paddingBottom: THUMB_H / 2 }}>
        {Array.from({ length: TICKS }).map((_, i) => (
          <div key={i} className="h-px w-[5px] bg-[#404040]" />
        ))}
      </div>

      <div
        className="absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          height: TRACK_H,
          width: 4,
          background: "#808080",
          boxShadow: "inset -1px -1px #ffffff, inset 1px 1px #0a0a0a",
        }}
      />

      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: thumbTop,
          height: THUMB_H,
          width: 26,
          background: "#c0c0c0",
          boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
        }}
      >
        <div className="absolute left-[3px] right-[3px] top-1/2 -translate-y-1/2 h-px bg-[#808080] shadow-[0_1px_#ffffff]" />
      </div>
    </div>
  );
}

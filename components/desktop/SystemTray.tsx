"use client";

import { useClock } from "@/hooks/useClock";

export function SystemTray({
  internetConnected,
  muted,
  onDisconnectRequest,
  onMcAfeeOpen,
  onToggleMute,
}: {
  internetConnected: boolean;
  muted: boolean;
  onDisconnectRequest: () => void;
  onMcAfeeOpen: () => void;
  onToggleMute: () => void;
}) {
  const time = useClock();
  return (
    <div
      className="ml-auto flex h-[22px] items-center gap-[6px] px-[8px] text-[11px]"
      style={{
        boxShadow: "inset -1px -1px #ffffff, inset 1px 1px #808080"
      }}
    >
      {internetConnected && (
        <button
          aria-label="Disconnect Floppyy Net"
          className="desktop-icon-button flex items-center"
          title="Floppyy Net: Connected"
          onDoubleClick={(event) => {
            event.stopPropagation();
            onDisconnectRequest();
          }}
        >
          <img
            src="/icons/connection.png"
            alt=""
            width={16}
            height={16}
            draggable={false}
            style={{ imageRendering: "pixelated" }}
          />
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
        <img
          src="/icons/McAfee.png"
          alt=""
          width={16}
          height={16}
          draggable={false}
          style={{ imageRendering: "pixelated" }}
        />
      </button>
      <button
        aria-label={muted ? "Unmute sound" : "Mute sound"}
        onClick={onToggleMute}
        className="desktop-icon-button relative flex items-center"
        title={muted ? "Sound: Off" : "Sound: On"}
      >
        <img
          src="/icons/speaker.png"
          alt=""
          width={16}
          height={16}
          draggable={false}
          style={{ imageRendering: "pixelated" }}
        />
        {muted && (
          <span className="pointer-events-none absolute left-[9px] top-[2px] text-[10px] font-bold leading-none text-[#ff0000]">
            ×
          </span>
        )}
      </button>
      <span className="min-w-[52px] text-center tabular-nums">{time}</span>
    </div>
  );
}

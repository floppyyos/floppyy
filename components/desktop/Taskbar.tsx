"use client";

import { DesktopWindow } from "@/lib/windows";
import { FloppyyIcon } from "./FloppyyIcon";
import { SystemTray } from "./SystemTray";

type Props = {
  windows: DesktopWindow[];
  activeId?: string;
  startOpen: boolean;
  internetConnected: boolean;
  muted: boolean;
  onStart: () => void;
  onTask: (instanceId: string) => void;
  onDisconnectRequest: () => void;
  onMcAfeeOpen: () => void;
  onToggleMute: () => void;
  onQuickLaunch?: (id: string) => void;
  onShowDesktop?: () => void;
};

export function Taskbar({ windows, activeId, startOpen, internetConnected, muted, onStart, onTask, onDisconnectRequest, onMcAfeeOpen, onToggleMute, onQuickLaunch, onShowDesktop }: Props) {
  return (
    <div
      className="fixed bottom-0 left-0 z-[4000] flex h-[28px] w-screen items-center gap-[3px] bg-[#c0c0c0] px-[2px]"
      style={{
        borderTop: "1px solid #ffffff",
        boxShadow: "inset 0 1px 0 #dfdfdf"
      }}
      onClick={(event) => event.stopPropagation()}
    >
      {/* Start Button */}
      <button
        className={`win-button flex h-[22px] items-center gap-[4px] px-[6px] font-bold text-[11px] ${startOpen ? "active" : ""}`}
        onClick={onStart}
        aria-label="Start"
        aria-pressed={startOpen}
      >
        <img
          src="/icons/win.png"
          alt=""
          width={16}
          height={16}
          draggable={false}
          style={{ imageRendering: "pixelated" }}
        />
        <span>Start</span>
      </button>

      {/* Divider */}
      <div className="h-[22px] w-[2px] flex-shrink-0" style={{ borderLeft: "1px solid #808080", borderRight: "1px solid #ffffff" }} />

      {/* Quick Launch area */}
      <div className="flex items-center gap-[2px] pr-[4px]">
        <button
          className="flex h-[20px] w-[20px] items-center justify-center hover:bg-white/20 active:translate-x-px active:translate-y-px"
          title="Show Desktop"
          onClick={onShowDesktop}
        >
          <FloppyyIcon type="desktop" size={16} />
        </button>
        <button
          className="flex h-[20px] w-[20px] items-center justify-center hover:bg-white/20 active:translate-x-px active:translate-y-px"
          title="My Computer"
          onClick={() => onQuickLaunch?.("computer")}
        >
          <FloppyyIcon type="computer" size={16} />
        </button>
        <button
          className="flex h-[20px] w-[20px] items-center justify-center hover:bg-white/20 active:translate-x-px active:translate-y-px"
          title="Internet Explorer"
          onClick={() => onQuickLaunch?.("internet")}
        >
          <FloppyyIcon type="ie" size={16} />
        </button>
        <button
          className="flex h-[20px] w-[20px] items-center justify-center hover:bg-white/20 active:translate-x-px active:translate-y-px"
          title="Outlook Express"
          onClick={() => onQuickLaunch?.("outlook")}
        >
          <FloppyyIcon type="msoutlook" size={16} />
        </button>
      </div>

      {/* Divider */}
      <div className="h-[22px] w-[2px] flex-shrink-0" style={{ borderLeft: "1px solid #808080", borderRight: "1px solid #ffffff" }} />

      {/* Window buttons */}
      <div className="flex min-w-0 flex-1 gap-[2px] overflow-hidden">
        {windows.map((window) => (
          <button
            key={window.instanceId}
            className={`win-button taskbar-button flex h-[22px] min-w-[100px] max-w-[160px] items-center gap-[4px] truncate px-[4px] text-left text-[11px] ${
              activeId === window.instanceId && !window.minimized ? "active" : ""
            }`}
            onClick={() => onTask(window.instanceId)}
            aria-label={`Focus ${window.title}`}
          >
            <FloppyyIcon type={window.icon} size={16} />
            <span className="truncate">{window.title}</span>
          </button>
        ))}
      </div>

      {/* System Tray */}
      <SystemTray
        internetConnected={internetConnected}
        muted={muted}
        onDisconnectRequest={onDisconnectRequest}
        onMcAfeeOpen={onMcAfeeOpen}
        onToggleMute={onToggleMute}
      />
    </div>
  );
}

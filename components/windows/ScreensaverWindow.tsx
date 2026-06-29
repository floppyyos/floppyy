"use client";

import { useState } from "react";
import type { WindowComponentProps } from "@/lib/windows";

type Mode = "pipes" | "stars" | "maze" | "mystify" | "flying-windows";

const OPTIONS: { value: Mode; label: string }[] = [
  { value: "flying-windows", label: "Flying Windows" },
  { value: "stars", label: "Starfield Simulation" },
  { value: "pipes", label: "3D Pipes" },
  { value: "maze", label: "3D Maze" },
  { value: "mystify", label: "Mystify Your Mind" },
];

const TABS = ["Background", "Screen Saver", "Appearance", "Settings"];

function MonitorPreview({ mode }: { mode: Mode }) {
  const bevelRaised =
    "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf";
  return (
    <div className="flex flex-col items-center">
      {/* monitor shell */}
      <div className="bg-[#c0c0c0] p-[10px] pb-[14px]" style={{ width: 188, boxShadow: bevelRaised }}>
        {/* sunken screen frame */}
        <div className="field-border bg-black p-[2px]">
          <div className="relative overflow-hidden" style={{ height: 104, background: "#000" }}>
            <PreviewContent mode={mode} />
          </div>
        </div>
      </div>
      {/* neck */}
      <div className="h-[8px] w-[58px] bg-[#c0c0c0]" style={{ boxShadow: bevelRaised }} />
      {/* base */}
      <div className="h-[6px] w-[96px] bg-[#c0c0c0]" style={{ boxShadow: bevelRaised }} />
    </div>
  );
}

function PreviewContent({ mode }: { mode: Mode }) {
  if (mode === "stars") {
    const dots = Array.from({ length: 26 });
    return (
      <div className="absolute inset-0">
        {dots.map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              width: (i % 3) + 1,
              height: (i % 3) + 1,
              opacity: 0.5 + ((i % 5) / 10),
            }}
          />
        ))}
      </div>
    );
  }
  if (mode === "flying-windows") {
    return (
      <div className="absolute inset-0">
        {[
          { left: "12%", top: "20%", s: 14 },
          { left: "55%", top: "10%", s: 20 },
          { left: "70%", top: "55%", s: 12 },
          { left: "30%", top: "60%", s: 24 },
          { left: "45%", top: "38%", s: 16 },
        ].map((w, i) => (
          <img
            key={i}
            src="/icons/win.png"
            alt=""
            draggable={false}
            style={{ position: "absolute", left: w.left, top: w.top, width: w.s, height: w.s, imageRendering: "pixelated" }}
          />
        ))}
      </div>
    );
  }
  if (mode === "pipes") {
    return (
      <svg viewBox="0 0 184 104" className="absolute inset-0 h-full w-full">
        <path d="M20 80 L20 40 L60 40 L60 70 L110 70" fill="none" stroke="#39d0d0" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M120 20 L120 55 L150 55 L150 90" fill="none" stroke="#d04ad0" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M40 95 L90 95 L90 30" fill="none" stroke="#d0c040" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (mode === "maze") {
    return (
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: i % 3 === 0 ? "#8a1f1f" : i % 3 === 1 ? "#b0b0b0" : "#6a1414",
              boxShadow: "inset -1px -1px rgba(0,0,0,0.5), inset 1px 1px rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    );
  }
  // mystify
  return (
    <svg viewBox="0 0 184 104" className="absolute inset-0 h-full w-full">
      <polygon points="30,20 150,35 120,90 40,70" fill="none" stroke="#33ffff" strokeWidth="2" />
      <polygon points="60,15 160,60 90,95 25,55" fill="none" stroke="#ff44ff" strokeWidth="2" />
    </svg>
  );
}

export function ScreensaverWindow({
  startScreensaver,
  setDefaultScreensaver,
  closeWindow,
  window: win,
  notify,
  playSound,
}: WindowComponentProps) {
  const [selected, setSelected] = useState<Mode>("flying-windows");
  const [waitMinutes, setWaitMinutes] = useState(1);
  const [passwordProtected, setPasswordProtected] = useState(false);

  const apply = () => {
    setDefaultScreensaver?.(selected);
    playSound("click");
  };

  return (
    <div className="flex h-full flex-col bg-[#c0c0c0] p-[10px] text-[11px]">
      {/* Tab strip */}
      <div className="relative z-[2] flex gap-[2px] px-[2px]">
        {TABS.map((tab) => {
          const active = tab === "Screen Saver";
          return (
            <div
              key={tab}
              className={`px-[10px] text-[11px] ${active ? "relative z-[3] bg-[#c0c0c0] pt-[4px] pb-[5px]" : "mt-[2px] bg-[#c0c0c0] pt-[2px] pb-[3px]"}`}
              style={{
                boxShadow: "inset 1px 1px #ffffff, inset -1px -1px #808080, inset -2px 0 #404040",
              }}
            >
              {tab}
            </div>
          );
        })}
      </div>

      {/* Body panel */}
      <div
        className="-mt-px flex flex-1 flex-col bg-[#c0c0c0] p-[12px]"
        style={{ boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf" }}
      >
        <div className="mb-[12px] flex justify-center">
          <MonitorPreview mode={selected} />
        </div>

        {/* Screen Saver group */}
        <fieldset className="mb-[10px] border border-[#808080] px-[10px] pb-[10px] pt-[2px]">
          <legend className="px-[4px]">Screen Saver</legend>
          <div className="flex items-center gap-[6px]">
            <select
              value={selected}
              onChange={(event) => setSelected(event.target.value as Mode)}
              className="field-border h-[21px] flex-1 bg-white px-[4px] text-[11px] text-black"
            >
              {OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              className="win-button min-w-[72px]"
              onClick={() => notify("Screen saver settings are not available.")}
            >
              Settings...
            </button>
            <button className="win-button min-w-[72px]" onClick={() => startScreensaver(selected)}>
              Preview
            </button>
          </div>
          <div className="mt-[10px] flex items-center gap-[8px]">
            <label className="flex items-center gap-[5px]">
              <input
                type="checkbox"
                checked={passwordProtected}
                onChange={(event) => setPasswordProtected(event.target.checked)}
              />
              Password protected
            </label>
            <button className="win-button min-w-[68px]" aria-disabled={!passwordProtected} disabled={!passwordProtected}>
              Change...
            </button>
            <span className="ml-auto flex items-center gap-[5px]">
              Wait:
              <input
                type="number"
                min={1}
                max={60}
                value={waitMinutes}
                onChange={(event) => setWaitMinutes(Math.max(1, Number(event.target.value) || 1))}
                className="field-border h-[20px] w-[44px] bg-white px-[4px] text-right text-[11px] text-black"
              />
              minutes
            </span>
          </div>
        </fieldset>

        {/* Energy saving group (decorative) */}
        <fieldset className="border border-[#808080] px-[10px] pb-[10px] pt-[2px] text-[#808080]">
          <legend className="px-[4px] text-[#404040]">Energy saving features of monitor</legend>
          <div className="flex items-start gap-[10px]">
            <div
              className="mt-[2px] flex h-[34px] w-[44px] shrink-0 items-center justify-center text-[9px] font-bold italic"
              style={{
                background: "radial-gradient(circle at 50% 120%, #2e7d32 0 60%, #1b5e20 100%)",
                color: "#ffe14d",
                borderRadius: "0 0 22px 22px",
              }}
            >
              energy
            </div>
            <div className="flex-1">
              <label className="mb-[6px] flex items-center gap-[5px]">
                <input type="checkbox" disabled />
                Low-power standby
              </label>
              <label className="flex items-center gap-[5px]">
                <input type="checkbox" disabled />
                Shut off monitor
              </label>
            </div>
          </div>
        </fieldset>

        {/* Action buttons */}
        <div className="mt-auto flex justify-end gap-[6px] pt-[10px]">
          <button
            className="win-button min-w-[72px]"
            onClick={() => {
              apply();
              closeWindow(win.instanceId);
            }}
          >
            OK
          </button>
          <button className="win-button min-w-[72px]" onClick={() => closeWindow(win.instanceId)}>
            Cancel
          </button>
          <button className="win-button min-w-[72px]" onClick={apply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { WindowComponentProps } from "@/lib/windows";

type ConnectionPhase = "idle" | "dialing" | "verifying" | "connected";

const DIALUP_SOUNDS = ["dialup-01", "dialup-02", "dialup-03"] as const;

type InternetWindowProps = WindowComponentProps & {
  onConnected?: () => void;
};

export function InternetWindow({
  window: win,
  closeWindow,
  notify,
  playSound,
  fadeOutSound,
  onConnected,
}: InternetWindowProps) {
  const [phase, setPhase] = useState<ConnectionPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Ready to connect");
  const audioRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startConnection = () => {
    const sound = DIALUP_SOUNDS[Math.floor(Math.random() * DIALUP_SOUNDS.length)];
    audioRef.current = sound;
    playSound(sound);

    setPhase("dialing");
    setProgress(0);
    setStatusText("Dialing 613-520-1135...");

    timerRef.current = setTimeout(() => {
      setPhase("verifying");
      setStatusText("Verifying username and password...");
      setProgress(60);

      timerRef.current = setTimeout(() => {
        setPhase("connected");
        setStatusText("Connected at 33,600 bps");
        setProgress(100);

        if (audioRef.current && fadeOutSound) {
          fadeOutSound(audioRef.current, 1000);
        }

        timerRef.current = setTimeout(() => {
          onConnected?.();
          notify("Connected to Floppyy Net!");
          closeWindow(win.instanceId);
        }, 1200);
      }, 2000);
    }, 3500);
  };

  const cancelConnection = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (audioRef.current && fadeOutSound) fadeOutSound(audioRef.current, 300);
    setPhase("idle");
    setProgress(0);
    setStatusText("Ready to connect");
  };

  useEffect(() => {
    if (phase !== "dialing") return;
    const interval = setInterval(() => {
      setProgress((p) => Math.min(55, p + 3));
    }, 200);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className={`flex h-full flex-col bg-[#c0c0c0] p-[8px] text-[11px] select-none ${
        phase === "idle" ? "" : "cursor-loading"
      }`}
      aria-busy={phase === "dialing" || phase === "verifying"}
    >
      <div
        className="flex min-h-0 flex-1 flex-col bg-[#c0c0c0] px-[14px] pb-[14px] pt-[12px]"
        style={{
          boxShadow: "inset -1px -1px #ffffff, inset 1px 1px #808080",
        }}
      >
        <div className="mb-[14px] flex items-center gap-[8px]">
          <img
            src="/icons/dialup.png"
            alt=""
            width={32}
            height={32}
            draggable={false}
            style={{ imageRendering: "pixelated" }}
          />
          <span className="bg-[#000080] px-[4px] py-[1px] text-[12px] font-bold text-white">
            Floppyy Net
          </span>
        </div>

        <fieldset className="mb-[14px] border border-[#808080] px-[20px] pb-[10px] pt-[6px]">
          <legend className="px-[4px]">Phone number:</legend>
          <div className="mb-[8px] grid grid-cols-[78px_1fr] gap-[8px]">
            <div>
              <div className="mb-[2px] text-[#808080]">Area code:</div>
              <div className="relative h-[22px]">
                <input
                  readOnly
                  className="h-[22px] w-full bg-white px-[3px] pr-[18px] text-[11px]"
                  style={{ boxShadow: "inset -1px -1px #ffffff, inset 1px 1px #808080" }}
                  value=""
                />
                <div
                  className="absolute right-0 top-0 flex h-[22px] w-[18px] items-center justify-center bg-[#c0c0c0] text-[8px]"
                  style={{ boxShadow: "inset -1px -1px #404040, inset 1px 1px #ffffff" }}
                >
                  ▼
                </div>
              </div>
            </div>
            <div>
              <div className="mb-[2px]">Telephone number:</div>
              <input
                readOnly
                className="h-[22px] w-full bg-white px-[4px] text-[11px]"
                style={{ boxShadow: "inset -1px -1px #ffffff, inset 1px 1px #808080" }}
                value="613-520-1135"
              />
            </div>
          </div>

          <div className="mb-[9px]">
            <div className="mb-[2px] text-[#808080]">Country code:</div>
            <div className="relative h-[22px]">
              <input
                readOnly
                className="h-[22px] w-full bg-[#c0c0c0] px-[4px] pr-[18px] text-[11px] text-[#808080]"
                style={{ boxShadow: "inset -1px -1px #ffffff, inset 1px 1px #808080" }}
                value="Canada (1)"
              />
              <div
                className="absolute right-0 top-0 flex h-[22px] w-[18px] items-center justify-center bg-[#c0c0c0] text-[8px]"
                style={{ boxShadow: "inset -1px -1px #404040, inset 1px 1px #ffffff" }}
              >
                ▼
              </div>
            </div>
          </div>

          <label className="flex items-center gap-[6px]">
            <span
              className="h-[13px] w-[13px] bg-white"
              style={{ boxShadow: "inset -1px -1px #ffffff, inset 1px 1px #808080" }}
            />
            <span>Use area code and Dialing Properties</span>
          </label>
        </fieldset>

        <fieldset className="mb-[10px] border border-[#808080] px-[20px] pb-[15px] pt-[16px]">
          <legend className="px-[4px]">Connect using:</legend>
          <div className="flex items-center gap-[10px]">
            <img
              src="/icons/dialup.png"
              alt=""
              width={30}
              height={30}
              draggable={false}
              style={{ imageRendering: "pixelated" }}
            />
            <div className="relative h-[22px] flex-1">
              <input
                readOnly
                className="h-[22px] w-full bg-white px-[4px] pr-[18px] text-[11px]"
                style={{ boxShadow: "inset -1px -1px #ffffff, inset 1px 1px #808080" }}
                value="U.S. Robotics 56K Fax PCI"
              />
              <div
                className="absolute right-0 top-0 flex h-[22px] w-[18px] items-center justify-center bg-[#c0c0c0] text-[8px]"
                style={{ boxShadow: "inset -1px -1px #404040, inset 1px 1px #ffffff" }}
              >
                ▼
              </div>
            </div>
          </div>
          <div className="mt-[9px] flex justify-end">
            <button className="win-button min-w-[102px]">Configure...</button>
          </div>
        </fieldset>

        {phase !== "idle" && (
          <div className="mt-auto">
            <div className="mb-[3px]">{statusText}</div>
            <div
              className="h-[16px] w-full bg-white"
              style={{ boxShadow: "inset -1px -1px #ffffff, inset 1px 1px #808080" }}
            >
              <div className="h-full bg-[#000080] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="mt-[6px] flex justify-end gap-[7px]">
        {phase === "idle" ? (
          <>
            <button
              onClick={startConnection}
              className="win-button min-w-[74px] font-bold ring-1 ring-black ring-inset"
            >
              OK
            </button>
            <button
              onClick={() => closeWindow(win.instanceId)}
              className="win-button min-w-[74px]"
            >
              Cancel
            </button>
          </>
        ) : phase === "connected" ? (
          <button
            onClick={() => {
              if (audioRef.current && fadeOutSound) fadeOutSound(audioRef.current, 500);
              onConnected?.();
              notify("Connected to Floppyy Net!");
              closeWindow(win.instanceId);
            }}
            className="win-button min-w-[74px] font-bold"
          >
            OK
          </button>
        ) : (
          <button
            onClick={() => {
              cancelConnection();
              closeWindow(win.instanceId);
            }}
            className="win-button min-w-[74px]"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

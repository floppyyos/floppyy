"use client";

import { useEffect, useState } from "react";

/**
 * Easter egg: opening "My Computer" too many times in a row overwhelms the
 * system. A stack of error dialogs cascades onto the screen (each with the
 * classic error sound), the machine freezes, throws a Windows 98 blue screen
 * of death, and finally reboots the whole "OS" (a page reload).
 */

const TITLES = ["Error", "System Error", "Fatal Error", "MyComputer.exe"];

const MESSAGES = [
  "Fail.",
  "SYSTEM.exe has stopped responding.",
  "A fatal error has occurred. The system cannot handle this much enthusiasm.",
  "A fatal exception 0E has occurred at C0DE:F100PPY.",
  "Cannot find REASON.DLL. Reality will now reboot.",
  "Error: Success failed successfully.",
  "Out of memory. Out of patience. Out of luck.",
  "You clicked one too many times.",
  "Resource conflict detected: you vs. the 90s.",
  "This operation completed unsuccessfully.",
  "Windows is now confused. So are we.",
  "Insufficient nostalgia to continue.",
];

const TOTAL_DIALOGS = 12;
const SPAWN_INTERVAL = 170; // ms between each error popup
const FREEZE_BEFORE_BSOD = 1900; // ms the full stack sits frozen
const BSOD_DURATION = 6000; // ms before the reboot

function ErrorIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
      <circle cx="16" cy="16" r="14" fill="#d51b1b" stroke="#7a0d0d" strokeWidth="1" />
      <circle cx="16" cy="16" r="14" fill="none" stroke="#ff6b6b" strokeWidth="1" opacity="0.5" />
      <path d="M10 10 L22 22 M22 10 L10 22" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

function ErrorDialog({
  index,
  centered = false,
  title: titleOverride,
  message: messageOverride,
}: {
  index: number;
  centered?: boolean;
  title?: string;
  message?: string;
}) {
  const title = titleOverride ?? TITLES[index % TITLES.length];
  const message = messageOverride ?? MESSAGES[index % MESSAGES.length];
  const position = centered
    ? { left: "calc(50% - 150px)", top: "calc(50% - 80px)" }
    : { left: `calc(50% - 200px + ${index * 24}px)`, top: `calc(50% - 240px + ${index * 24}px)` };
  return (
    <div
      className="absolute w-[300px] select-none"
      style={{
        ...position,
        zIndex: index,
        background: "#c0c0c0",
        boxShadow:
          "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
        padding: 3,
      }}
    >
      <div className="flex h-[18px] items-center justify-between bg-gradient-to-r from-[#000080] to-[#1084d0] pl-[4px] pr-[2px]">
        <span className="truncate text-[11px] font-bold text-white">{title}</span>
        <span
          className="flex h-[14px] w-[16px] items-center justify-center text-[10px] leading-none text-black"
          style={{
            background: "#c0c0c0",
            boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
          }}
        >
          ✕
        </span>
      </div>

      <div className="flex items-center gap-[12px] px-[14px] py-[16px]">
        <ErrorIcon />
        <span className="text-[11px] leading-[15px] text-black">{message}</span>
      </div>

      <div className="flex justify-center pb-[12px]">
        <span
          className="win-button min-w-[72px] text-center text-[11px]"
          style={{ outline: "1px dotted #000", outlineOffset: "-4px" }}
        >
          OK
        </span>
      </div>
    </div>
  );
}

function BlueScreen() {
  return (
    <div className="fixed inset-0 z-[9600] flex items-center justify-center bg-[#0000aa] p-8 font-mono text-white">
      <div className="w-full max-w-[720px] text-[14px] leading-[22px]">
        <div className="mb-6 text-center">
          <span className="bg-[#a8a8a8] px-4 py-[2px] font-bold text-[#0000aa]">Floppyy</span>
        </div>

        <p className="mb-4">
          A fatal exception 0E has occurred at 0028:C000FL0P in VxD VMM(01) +
          00010E36. The current application will be terminated.
        </p>

        <p className="mb-2">*  A fatal error has occurred. The system cannot handle this much enthusiasm.</p>
        <p className="mb-2">*  Press any key to terminate the current application.</p>
        <p className="mb-4">
          *  Press CTRL+ALT+DEL again to restart your computer. You will lose any
          {"\n   "}unsaved information in all applications.
        </p>

        <p className="mb-8 animate-pulse text-center">Rebooting Floppyy<span className="tracking-widest">...</span></p>
      </div>
    </div>
  );
}

export function CrashSequence({
  playSound,
  onReboot,
  variant = "cascade",
  message,
}: {
  playSound: (sound: string) => void;
  onReboot: () => void;
  variant?: "cascade" | "fatal";
  message?: string;
}) {
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<"errors" | "bsod">("errors");

  const total = variant === "fatal" ? 1 : TOTAL_DIALOGS;
  const freezeDelay = variant === "fatal" ? 1300 : FREEZE_BEFORE_BSOD;

  useEffect(() => {
    if (phase !== "errors") return;

    if (shown >= total) {
      const timer = window.setTimeout(() => setPhase("bsod"), freezeDelay);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(
      () => {
        playSound("error");
        setShown((value) => value + 1);
      },
      shown === 0 ? 0 : SPAWN_INTERVAL,
    );
    return () => window.clearTimeout(timer);
  }, [shown, phase, playSound, total, freezeDelay]);

  useEffect(() => {
    if (phase !== "bsod") return;
    const timer = window.setTimeout(onReboot, BSOD_DURATION);
    return () => window.clearTimeout(timer);
  }, [phase, onReboot]);

  if (phase === "bsod") {
    return <BlueScreen />;
  }

  return (
    <div
      className="fixed inset-0 z-[9500]"
      style={{ cursor: "wait" }}
      // Swallow every interaction — the machine is busy dying.
      onPointerDown={(event) => event.preventDefault()}
      onContextMenu={(event) => event.preventDefault()}
      aria-hidden="true"
    >
      {Array.from({ length: shown }).map((_, i) =>
        variant === "fatal" ? (
          <ErrorDialog key={i} index={i} centered title="Fatal Error" message={message} />
        ) : (
          <ErrorDialog key={i} index={i} />
        ),
      )}
    </div>
  );
}

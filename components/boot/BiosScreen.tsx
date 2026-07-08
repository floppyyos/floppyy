"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type BootMode = "normal" | "logged" | "safe" | "command";

interface BiosScreenProps {
  onComplete: (mode: BootMode) => void;
}

const BIOS_LINES = [
  { text: "Award Modular BIOS v4.51PG, An Energy Star Ally", bold: true },
  { text: "Copyright (C) 1984-98, Floppyy, Inc." },
  { text: "" },
  { text: "ASUS P/I-P55T2P4 BIOS REV. 2.2" },
  { text: "Intel Celeron CPU at 300A MHz", highlight: true },
  { text: "Memory Test : 65536K OK" },
  { text: "" },
  { text: "Press DEL to enter SETUP", dim: true },
  { text: "Press F8 or ESC for boot menu", dim: true },
  { text: "" },
  { text: "Award Plug and Play BIOS Extension v1.0A" },
  { text: "Detecting IDE Primary Master   ... WDC AC21600H" },
  { text: "Detecting IDE Primary Slave    ... None" },
  { text: "Detecting IDE Secondary Master ... ATAPI CD-ROM" },
  { text: "Detecting IDE Secondary Slave  ... None" },
  { text: "Detecting Floppy Drive A       ... 1.44M, 3.5 in." },
  { text: "" },
  { text: "Keyboard detected" },
  { text: "Mouse initialized" },
  { text: "" },
  { text: "Booting from A:\\..." },
  { text: "Loading A:\\FLOPPYY\\FLOPPYY.EXE" },
  { text: "" },
  { text: "Starting Floppyy..." },
];

const RARE_BIOS_LINES = [
  "Detecting nostalgia cache ... OK",
  "Checking dial-up patience ... FAILED",
  "Loading clouds.bmp into memory ... OK",
  "Searching for lost bookmarks ... 12 found",
  "Calibrating pixel dust ... OK",
  "Floppy drive reports: still here",
];

const MENU_ITEMS = [
  "1. Normal",
  "2. Logged (\\BOOTLOG.TXT)",
  "3. Safe Mode",
  "4. Command prompt only",
];

const BOOTLOG_LINES = [
  "[BOOTLOG]",
  "BIOS initialized",
  "Memory test passed: 65536K",
  "Primary Master: WDC AC21600H",
  "CD-ROM detected",
  "Floppy Drive A: 1.44M, 3.5 in.",
  "Booting from A:\\",
  "Loaded A:\\FLOPPYY\\FLOPPYY.EXE",
  "Keyboard initialized",
  "Mouse initialized",
  "Floppyy shell loaded",
  "Desktop initialized",
];

export function BiosScreen({ onComplete }: BiosScreenProps) {
  const biosLines = useMemo(() => {
    if (Math.random() > 0.28) return BIOS_LINES;
    const rare = RARE_BIOS_LINES[Math.floor(Math.random() * RARE_BIOS_LINES.length)];
    return [...BIOS_LINES.slice(0, -1), { text: rare, highlight: true }, ...BIOS_LINES.slice(-1)];
  }, []);
  const [visibleLines, setVisibleLines] = useState(0);
  const [phase, setPhase] = useState<"bios" | "menu" | "bootlog" | "command" | "booting">("bios");
  const [menuChoice, setMenuChoice] = useState("");
  const [bootlogVisible, setBootlogVisible] = useState(0);
  const [f8Pressed, setF8Pressed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  const complete = useCallback(
    (mode: BootMode) => {
      if (completedRef.current) return;
      completedRef.current = true;
      onComplete(mode);
    },
    [onComplete],
  );

  useEffect(() => {
    if (phase !== "bios") return;
    const interval = setInterval(() => {
      setVisibleLines((v) => {
        if (v + 1 >= biosLines.length) clearInterval(interval);
        return Math.min(v + 1, biosLines.length);
      });
    }, 80);
    return () => clearInterval(interval);
  }, [phase, biosLines.length]);

  useEffect(() => {
    if (phase !== "bios") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "F8" || e.key === "Escape") {
        e.preventDefault();
        setF8Pressed(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase]);

  // Decide what happens once all BIOS lines have been printed. Keeping this in a
  // single effect (rather than spread across the typing interval) avoids a
  // synchronous setState-in-effect and lets the cleanup cancel the pending
  // auto-boot timer if F8/ESC is pressed during the countdown.
  useEffect(() => {
    if (phase !== "bios" || visibleLines < biosLines.length) return;
    if (f8Pressed) {
      const toMenu = setTimeout(() => setPhase("menu"), 300);
      return () => clearTimeout(toMenu);
    }
    const toBoot = setTimeout(() => {
      setPhase("booting");
      setTimeout(() => complete("normal"), 400);
    }, 500);
    return () => clearTimeout(toBoot);
  }, [phase, visibleLines, f8Pressed, complete, biosLines.length]);

  useEffect(() => {
    if (phase !== "menu") return;
    const handler = (e: KeyboardEvent) => {
      if (["1", "2", "3", "4"].includes(e.key)) {
        setMenuChoice(e.key);
        const modes: Record<string, BootMode> = { "1": "normal", "2": "logged", "3": "safe", "4": "command" };
        const mode = modes[e.key];
        setTimeout(() => {
          if (mode === "logged") {
            setPhase("bootlog");
          } else if (mode === "command") {
            setPhase("command");
          } else {
            setPhase("booting");
            setTimeout(() => complete(mode), 400);
          }
        }, 300);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, complete]);

  useEffect(() => {
    if (phase !== "bootlog") return;
    const interval = setInterval(() => {
      setBootlogVisible((v) => {
        const next = v + 1;
        if (next >= BOOTLOG_LINES.length) {
          clearInterval(interval);
          setTimeout(() => complete("normal"), 600);
          return BOOTLOG_LINES.length;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [phase, complete]);

  useEffect(() => {
    if (phase !== "command") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        complete("normal");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, complete]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  });

  return (
    <div
      ref={containerRef}
      onClick={() => {

        if (phase === "bios" && visibleLines >= biosLines.length && !f8Pressed) {
          setPhase("booting");
          setTimeout(() => complete("normal"), 200);
        }
      }}
      className="cursor-loading flex h-screen w-screen flex-col items-start overflow-hidden bg-black p-4 font-mono text-[14px] leading-[20px] text-[#aaaaaa]"
    >
      {(phase === "bios" || phase === "booting") && (
        <img
          src="/misc/Energy.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-[16px] top-[10px] h-auto w-[32vw] max-w-[250px] max-[640px]:w-[60px]"
          draggable={false}
          style={{
            imageRendering: "pixelated",
          }}
        />
      )}

      {biosLines.slice(0, visibleLines).map((line, i) => (
        <div
          key={i}
          className={[
            line.bold ? "text-white font-bold" : "",
            line.highlight ? "text-[#55ff55]" : "",
            line.dim ? "text-[#666666]" : "",
          ].join(" ")}
        >
          {line.text || "\u00a0"}
        </div>
      ))}

      {phase === "bios" && visibleLines < biosLines.length && (
        <span className="inline-block w-[8px] h-[14px] bg-[#aaaaaa] animate-pulse" />
      )}

      {phase === "menu" && (
        <div className="mt-4">
          <div className="text-white font-bold mb-2">Floppyy 98 Startup Menu</div>
          <div className="mb-2" />
          {MENU_ITEMS.map((item, i) => (
            <div key={i} className={menuChoice === String(i + 1) ? "text-[#55ff55] font-bold" : ""}>
              {item}
            </div>
          ))}
          <div className="mt-2" />
          <div>
            Enter a choice: <span className="text-white">{menuChoice}</span>
            {!menuChoice && <span className="inline-block w-[8px] h-[14px] bg-[#aaaaaa] animate-pulse ml-1 align-middle" />}
          </div>
          {!menuChoice && (
            <div className="mt-2 text-[#666666]">Use number keys to select an option.</div>
          )}
        </div>
      )}

      {phase === "bootlog" && (
        <div className="mt-2">
          {BOOTLOG_LINES.slice(0, bootlogVisible).map((line, i) => (
            <div key={i} className={i === 0 ? "text-white font-bold" : "text-[#55ff55]"}>
              {line}
            </div>
          ))}
        </div>
      )}

      {phase === "command" && (
        <div className="mt-4">
          <div className="text-white">Microsoft(R) WS-DOS</div>
          <div className="text-white">Copyright (C) 1984-98 Floppyy, Inc.</div>
          <div className="mt-2" />
          <div className="text-[#aaaaaa]">
            C:\&gt;<span className="inline-block w-[8px] h-[14px] bg-[#aaaaaa] animate-pulse ml-1 align-middle" />
          </div>
          <div className="mt-2 text-[#666666]">Press Enter to continue to desktop.</div>
        </div>
      )}

      {phase === "booting" && (
        <div className="mt-2 text-white animate-pulse">Loading Floppyy 98...</div>
      )}
    </div>
  );
}

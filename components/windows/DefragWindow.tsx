"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WindowComponentProps } from "@/lib/windows";

type BlockState = "free" | "used" | "fragmented" | "moving" | "optimized";

const COLS = 28;
const ROWS = 12;
const TOTAL = COLS * ROWS;

function generateBlocks(): BlockState[] {
  const blocks: BlockState[] = [];
  for (let i = 0; i < TOTAL; i++) {
    const r = Math.random();
    if (r < 0.15) blocks.push("free");
    else if (r < 0.35) blocks.push("fragmented");
    else blocks.push("used");
  }
  return blocks;
}

const BLOCK_COLORS: Record<BlockState, string> = {
  free: "#ffffff",
  used: "#00c8c8",
  fragmented: "#ff0000",
  moving: "#ffff00",
  optimized: "#0000c8",
};

export function DefragWindow({ playSound }: WindowComponentProps) {
  const [blocks, setBlocks] = useState<BlockState[]>(() => generateBlocks());
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showLegend, setShowLegend] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef(0);

  const stop = useCallback(() => {
    setRunning(false);
    setPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setBlocks(generateBlocks());
    setProgress(0);
    stepRef.current = 0;
    setRunning(true);
    setPaused(false);
  }, []);

  const pause = useCallback(() => {
    setPaused((p) => !p);
  }, []);

  // Defrag animation
  useEffect(() => {
    if (!running || paused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      stepRef.current += 1;
      const step = stepRef.current;

      setBlocks((prev) => {
        const next = [...prev];
        // Find a fragmented or used block and "move" it
        const fragIdx = next.findIndex((b, i) => i >= step - 3 && (b === "fragmented" || b === "used"));
        if (fragIdx !== -1 && fragIdx < TOTAL) {
          // Show moving animation
          if (next[fragIdx] === "fragmented") {
            next[fragIdx] = "moving";
          } else if (next[fragIdx] === "moving") {
            next[fragIdx] = "optimized";
          } else if (next[fragIdx] === "used") {
            next[fragIdx] = "optimized";
          }
        }

        // Convert previous moving blocks to optimized
        for (let i = 0; i < step - 1 && i < TOTAL; i++) {
          if (next[i] === "moving") next[i] = "optimized";
          if (next[i] === "fragmented") next[i] = "optimized";
          if (next[i] === "used") next[i] = "optimized";
          if (next[i] === "free" && Math.random() < 0.3) next[i] = "optimized";
        }

        return next;
      });

      const pct = Math.min(100, Math.round((step / TOTAL) * 100));
      setProgress(pct);

      if (step >= TOTAL) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setRunning(false);
        playSound("notification");
      }
    }, 60);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, paused, playSound]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      className={`flex h-full flex-col bg-[#c0c0c0] ${running && !paused ? "cursor-loading" : ""}`}
      aria-busy={running && !paused}
    >
      {/* Block grid */}
      <div className="flex-1 m-2 p-1 border-2 overflow-hidden" style={{ borderColor: "#808080 #dfdfdf #dfdfdf #808080" }}>
        <div
          className="grid gap-px h-full w-full bg-[#000080]"
          style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
        >
          {blocks.map((block, i) => (
            <div
              key={i}
              className="border border-[#000080]"
              style={{ backgroundColor: BLOCK_COLORS[block] }}
            />
          ))}
        </div>
      </div>

      {/* Status area */}
      <div className="px-3 pb-3">
        <div className="text-[11px] mb-1">
          {running
            ? paused
              ? "Paused."
              : "Defragmenting file system..."
            : progress >= 100
              ? "Defragmentation complete."
              : "Click Start to defragment Drive C."}
        </div>

        {/* Progress bar */}
        <div className="h-[16px] border-2 mb-2 bg-white" style={{ borderColor: "#808080 #dfdfdf #dfdfdf #808080" }}>
          <div
            className="h-full transition-all duration-100"
            style={{ width: `${progress}%`, background: "repeating-linear-gradient(90deg, #000080 0px, #000080 8px, #c0c0c0 8px, #c0c0c0 10px)" }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px]">{progress}% Complete</span>
          <div className="flex gap-2">
            {!running ? (
              <button onClick={start} className="win-button px-4 py-0.5 text-[11px] min-w-[60px]">
                Start
              </button>
            ) : (
              <button onClick={stop} className="win-button px-4 py-0.5 text-[11px] min-w-[60px]">
                Stop
              </button>
            )}
            <button
              onClick={pause}
              disabled={!running}
              className="win-button px-4 py-0.5 text-[11px] min-w-[60px] disabled:opacity-50"
            >
              {paused ? "Resume" : "Pause"}
            </button>
            <button onClick={() => setShowLegend((v) => !v)} className="win-button px-4 py-0.5 text-[11px] min-w-[60px]">
              Legend
            </button>
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="mt-2 p-2 border-2 text-[10px]" style={{ borderColor: "#808080 #dfdfdf #dfdfdf #808080" }}>
            <div className="grid grid-cols-2 gap-1">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border border-[#808080]" style={{ backgroundColor: BLOCK_COLORS.optimized }} />
                <span>Optimized</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border border-[#808080]" style={{ backgroundColor: BLOCK_COLORS.used }} />
                <span>Used</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border border-[#808080]" style={{ backgroundColor: BLOCK_COLORS.fragmented }} />
                <span>Fragmented</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border border-[#808080]" style={{ backgroundColor: BLOCK_COLORS.free }} />
                <span>Free space</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border border-[#808080]" style={{ backgroundColor: BLOCK_COLORS.moving }} />
                <span>Reading/Writing</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { WindowComponentProps } from "@/lib/windows";

type BlockState = "free" | "used" | "fragmented" | "moving" | "optimized";

const COLS = 42;
const ROWS = 22;
const TOTAL = COLS * ROWS;
const STREAK = 11; // width of the read/write head
const STEP = 4; // cells advanced per tick

function generateBlocks(): BlockState[] {
  const blocks: BlockState[] = [];
  for (let i = 0; i < TOTAL; i++) {
    const r = Math.random();
    if (r < 0.14) blocks.push("free");
    else if (r < 0.2) blocks.push("fragmented");
    else blocks.push("used");
  }
  return blocks;
}

const BLOCK_COLORS: Record<BlockState, string> = {
  free: "#ffffff",
  used: "#03c4c4",
  fragmented: "#ff0000",
  moving: "#0000e0",
  optimized: "#0000b0",
};

// Cyan tiles get a subtle raised bevel like the original defrag grid.
const CELL_BEVEL = "inset 1px 1px rgba(255,255,255,0.55), inset -1px -1px rgba(0,0,0,0.28)";

export function DefragWindow({ playSound }: WindowComponentProps) {
  const [blocks] = useState<BlockState[]>(() => generateBlocks());
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [detailsHidden, setDetailsHidden] = useState(false);
  const [head, setHead] = useState(0);
  const [showLegend, setShowLegend] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const done = head >= TOTAL + STREAK;
  const progress = Math.min(100, Math.round((head / TOTAL) * 100));

  const stop = useCallback(() => {
    setRunning(false);
    setPaused(false);
    setHead(0);
  }, []);

  const start = useCallback(() => {
    setHead(0);
    setRunning(true);
    setPaused(false);
  }, []);

  const pause = useCallback(() => setPaused((p) => !p), []);

  useEffect(() => {
    if (!running || paused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setHead((h) => {
        const next = h + STEP;
        if (next >= TOTAL + STREAK) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setRunning(false);
          playSound("notification");
          return TOTAL + STREAK;
        }
        return next;
      });
    }, 45);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, paused, playSound]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Derive each cell's displayed state from the sweeping write head.
  const displayState = (i: number): BlockState => {
    if (!running && head === 0) return blocks[i];
    if (i < head - STREAK) return "optimized";
    if (i < head) return "moving";
    return blocks[i];
  };

  const statusText = running
    ? paused
      ? "Paused."
      : "Defragmenting file system..."
    : done
      ? "Defragmentation complete."
      : "Click Start to defragment Drive C.";

  const CHUNKS = 22;
  const filledChunks = Math.round((progress / 100) * CHUNKS);

  return (
    <div
      className={`relative flex h-full flex-col bg-[#c0c0c0] ${running && !paused ? "cursor-loading" : ""}`}
      aria-busy={running && !paused}
    >
      {!detailsHidden && (
        <div
          className="mx-[6px] mt-[6px] flex min-h-0 flex-1 border-2"
          style={{ borderColor: "#808080 #ffffff #ffffff #808080" }}
        >
          <div className="relative min-h-0 flex-1 overflow-hidden bg-white p-[2px]">
            <div
              className="grid h-full w-full gap-px bg-[#dfe7e7]"
              style={{
                gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                gridTemplateRows: `repeat(${ROWS}, 1fr)`,
              }}
            >
              {blocks.map((_, i) => {
                const state = displayState(i);
                return (
                  <div
                    key={i}
                    style={{
                      backgroundColor: BLOCK_COLORS[state],
                      boxShadow: state === "free" ? undefined : CELL_BEVEL,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {detailsHidden && <div className="flex-1" />}

      <div className="flex items-end justify-between gap-[10px] px-[8px] pb-[8px] pt-[6px]">
        <div className="min-w-0 flex-1">
          <div className="mb-[4px] truncate text-[11px]">{statusText}</div>
          <div
            className="flex h-[13px] w-[190px] max-w-full items-stretch gap-[1px] border-2 bg-[#c0c0c0] p-[1px]"
            style={{ borderColor: "#808080 #ffffff #ffffff #808080" }}
          >
            {Array.from({ length: CHUNKS }).map((_, i) => (
              <div
                key={i}
                className="flex-1"
                style={{ background: i < filledChunks ? "#000080" : "transparent" }}
              />
            ))}
          </div>
          <div className="mt-[4px] text-[11px]">{progress}% Complete</div>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-[6px]">
          {!running ? (
            <button onClick={start} className="win-button h-[24px] min-w-[92px] text-[11px]">
              Start
            </button>
          ) : (
            <button onClick={stop} className="win-button h-[24px] min-w-[92px] text-[11px]">
              Stop
            </button>
          )}
          <button
            onClick={pause}
            disabled={!running}
            className="win-button h-[24px] min-w-[92px] text-[11px] disabled:opacity-50"
          >
            {paused ? "Resume" : "Pause"}
          </button>
          <button onClick={() => setShowLegend((v) => !v)} className="win-button h-[24px] min-w-[92px] text-[11px]">
            Legend
          </button>
          <button
            onClick={() => setDetailsHidden((v) => !v)}
            className="win-button h-[24px] min-w-[92px] text-[11px]"
          >
            {detailsHidden ? "Show Details" : "Hide Details"}
          </button>
        </div>
      </div>

      {showLegend && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10" onClick={() => setShowLegend(false)}>
          <div className="win-bevel bg-[#c0c0c0] p-[12px] text-[11px]" onClick={(e) => e.stopPropagation()}>
            <div className="mb-[8px] font-bold">Defragmenter Legend</div>
            <div className="grid grid-cols-1 gap-[6px]">
              <LegendRow color={BLOCK_COLORS.optimized} label="Contiguous (optimized) blocks" bevel />
              <LegendRow color={BLOCK_COLORS.fragmented} label="Fragmented / reading / writing" bevel />
              <LegendRow color={BLOCK_COLORS.free} label="Free space" />
            </div>
            <div className="mt-[12px] text-right">
              <button onClick={() => setShowLegend(false)} className="win-button h-[24px] min-w-[72px] text-[11px]">
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LegendRow({ color, label, bevel }: { color: string; label: string; bevel?: boolean }) {
  return (
    <div className="flex items-center gap-[6px]">
      <div
        className="h-[12px] w-[12px] border border-[#808080]"
        style={{ backgroundColor: color, boxShadow: bevel ? "inset 1px 1px rgba(255,255,255,0.55), inset -1px -1px rgba(0,0,0,0.28)" : undefined }}
      />
      <span>{label}</span>
    </div>
  );
}

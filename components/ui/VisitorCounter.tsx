"use client";

import { useEffect, useState } from "react";

type Seg = "a" | "b" | "c" | "d" | "e" | "f" | "g";

const SEG_POINTS: Record<Seg, string> = {
  a: "5,2 19,2 21,4 19,6 5,6 3,4",
  b: "18,5 20,3 22,5 22,19 20,21 18,19",
  c: "18,25 20,23 22,25 22,39 20,41 18,39",
  d: "5,38 19,38 21,40 19,42 5,42 3,40",
  e: "2,25 4,23 6,25 6,39 4,41 2,39",
  f: "2,5 4,3 6,5 6,19 4,21 2,19",
  g: "5,20 19,20 21,22 19,24 5,24 3,22",
};

const SEG_ORDER: Seg[] = ["a", "b", "c", "d", "e", "f", "g"];

const DIGIT_SEGMENTS: Record<string, Seg[]> = {
  "0": ["a", "b", "c", "d", "e", "f"],
  "1": ["b", "c"],
  "2": ["a", "b", "g", "e", "d"],
  "3": ["a", "b", "g", "c", "d"],
  "4": ["f", "g", "b", "c"],
  "5": ["a", "f", "g", "c", "d"],
  "6": ["a", "f", "g", "e", "c", "d"],
  "7": ["a", "b", "c"],
  "8": ["a", "b", "c", "d", "e", "f", "g"],
  "9": ["a", "b", "c", "d", "f", "g"],
};

const LIT = "#35ff6a";
const DIM = "#0f3a1d";

function SevenSegment({ char }: { char: string }) {
  const on = DIGIT_SEGMENTS[char] ?? [];
  return (
    <svg
      viewBox="0 0 24 44"
      width={14}
      height={26}
      className="block"
      style={{ imageRendering: "pixelated" }}
      aria-hidden="true"
    >
      {SEG_ORDER.map((seg) => {
        const lit = on.includes(seg);
        return (
          <polygon
            key={seg}
            points={SEG_POINTS[seg]}
            fill={lit ? LIT : DIM}
            style={lit ? { filter: "drop-shadow(0 0 1.5px #35ff6a)" } : undefined}
          />
        );
      })}
    </svg>
  );
}

let cachedCount: number | null = null;
let inFlight: Promise<number> | null = null;

function fetchVisitorCount(): Promise<number> {
  if (cachedCount != null) return Promise.resolve(cachedCount);
  if (inFlight) return inFlight;
  inFlight = (async () => {
    let alreadyCounted = false;
    try {
      alreadyCounted = globalThis.sessionStorage?.getItem("floppyy-counted") === "1";
    } catch {
    }
    const response = await fetch("/api/visitors", {
      method: alreadyCounted ? "GET" : "POST",
      cache: "no-store",
    });
    if (!response.ok) throw new Error("counter unavailable");
    const data = (await response.json()) as { count?: number };
    try {
      globalThis.sessionStorage?.setItem("floppyy-counted", "1");
    } catch {
      /* ignore */
    }
    cachedCount = Number(data.count) || 0;
    return cachedCount;
  })().catch((error) => {
    inFlight = null;
    throw error;
  });
  return inFlight;
}

function useVisitorCount(): number | null {
  const [count, setCount] = useState<number | null>(cachedCount);
  useEffect(() => {
    let active = true;
    fetchVisitorCount()
      .then((value) => {
        if (active) setCount(value);
      })
      .catch(() => {
      });
    return () => {
      active = false;
    };
  }, []);
  return count;
}

export function VisitorCounter({ minDigits = 6 }: { minDigits?: number }) {
  const count = useVisitorCount();
  const digits = (count != null ? String(count) : "").padStart(minDigits, "0");
  const chars = count != null ? [...digits] : Array.from({ length: minDigits }, () => "-");

  return (
    <div className="inline-flex flex-col items-center gap-[4px] font-mono">
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#000080]">
        You are visitor number
      </div>
      <div
        className="flex items-center gap-[3px] rounded-[2px] px-[6px] py-[4px]"
        style={{
          background: "#020a04",
          boxShadow: "inset 1px 1px #000, inset -1px -1px #1a1a1a, 0 0 0 1px #000",
        }}
        title={count != null ? `${count.toLocaleString()} visitors` : "Loading counter..."}
      >
        {chars.map((char, index) => (
          <span
            key={index}
            className="flex items-center justify-center"
            style={{ background: "#041207", padding: "2px 3px", borderRadius: "1px" }}
          >
            <SevenSegment char={char} />
          </span>
        ))}
      </div>
    </div>
  );
}

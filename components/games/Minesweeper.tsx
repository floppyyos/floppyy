"use client";

import { useEffect, useMemo, useState } from "react";

const cols = 16;
const rows = 16;
const totalMines = 40;
const totalCells = cols * rows;
const cellSize = 18;

type Face = "happy" | "pressed" | "lost" | "won";

function makeMines(seed: number) {
  const mines = new Set<number>();
  let value = seed || 1;

  while (mines.size < totalMines) {
    value = (value * 9301 + 49297) % 233280;
    mines.add(value % totalCells);
  }

  return mines;
}

function neighbors(index: number) {
  const x = index % cols;
  const y = Math.floor(index / cols);
  const result: number[] = [];

  for (let yy = y - 1; yy <= y + 1; yy += 1) {
    for (let xx = x - 1; xx <= x + 1; xx += 1) {
      if (xx === x && yy === y) continue;
      if (xx >= 0 && xx < cols && yy >= 0 && yy < rows) result.push(yy * cols + xx);
    }
  }

  return result;
}

function revealEmpty(start: number, counts: number[], mines: Set<number>, current: Set<number>) {
  const next = new Set(current);
  const queue = [start];

  while (queue.length) {
    const cell = queue.shift()!;
    if (next.has(cell) || mines.has(cell)) continue;
    next.add(cell);

    if (counts[cell] === 0) {
      neighbors(cell).forEach((neighbor) => {
        if (!next.has(neighbor)) queue.push(neighbor);
      });
    }
  }

  return next;
}

function LedCounter({ value }: { value: number }) {
  return (
    <div
      className="flex h-[30px] min-w-[60px] items-center justify-center bg-black px-[4px] font-mono text-[23px] font-bold leading-none text-[#ff1a1a]"
      style={{
        boxShadow: "inset 1px 1px #808080, inset -1px -1px #ffffff",
        textShadow: "0 0 2px #ff0000",
      }}
    >
      {String(Math.max(0, Math.min(999, value))).padStart(3, "0")}
    </div>
  );
}

function FaceButton({ face, onClick }: { face: Face; onClick: () => void }) {
  const mark = face === "lost" ? "×" : face === "won" ? "⌐" : face === "pressed" ? "o" : "";

  return (
    <button
      aria-label="Reset minesweeper"
      className="flex h-[30px] w-[30px] items-center justify-center bg-[#c0c0c0] p-0"
      style={{
        boxShadow: "inset -2px -2px #808080, inset 2px 2px #ffffff, inset -3px -3px #404040, inset 3px 3px #dfdfdf",
      }}
      onClick={onClick}
    >
      <span className="relative block h-[20px] w-[20px] rounded-full border border-[#808000] bg-[#ffff00]">
        <span className="absolute left-[5px] top-[5px] h-[3px] w-[3px] bg-black" />
        <span className="absolute right-[5px] top-[5px] h-[3px] w-[3px] bg-black" />
        {mark ? (
          <span className="absolute left-1/2 top-[9px] -translate-x-1/2 text-[11px] font-bold leading-none text-black">{mark}</span>
        ) : (
          <span className="absolute bottom-[4px] left-[5px] h-[5px] w-[10px] rounded-b-full border-b-2 border-black" />
        )}
      </span>
    </button>
  );
}

export function Minesweeper({ playSound }: { playSound: (name: string) => void }) {
  const [seed, setSeed] = useState(() => Date.now() % 233280);
  const [open, setOpen] = useState<Set<number>>(new Set());
  const [flags, setFlags] = useState<Set<number>>(new Set());
  const [lost, setLost] = useState(false);
  const [started, setStarted] = useState(false);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [face, setFace] = useState<Face>("happy");

  const mines = useMemo(() => makeMines(seed), [seed]);
  const counts = useMemo(
    () => Array.from({ length: totalCells }, (_, index) => neighbors(index).filter((neighbor) => mines.has(neighbor)).length),
    [mines],
  );
  const won = !lost && open.size >= totalCells - totalMines;
  const elapsed = started && !lost && !won ? Math.min(999, Math.floor((now - startedAt) / 1000)) : Math.min(999, Math.floor((now - startedAt) / 1000));

  useEffect(() => {
    if (!started || lost || won) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [started, lost, won]);

  useEffect(() => {
    if (won) setFace("won");
  }, [won]);

  const reset = () => {
    const nextNow = Date.now();
    setSeed(nextNow % 233280);
    setOpen(new Set());
    setFlags(new Set());
    setLost(false);
    setStarted(false);
    setStartedAt(nextNow);
    setNow(nextNow);
    setFace("happy");
    playSound("click");
  };

  const openCell = (index: number) => {
    if (lost || won || open.has(index) || flags.has(index)) return;

    if (!started) {
      const nextNow = Date.now();
      setStarted(true);
      setStartedAt(nextNow);
      setNow(nextNow);
    }

    if (mines.has(index)) {
      setLost(true);
      setFace("lost");
      playSound("error");
      return;
    }

    setOpen((current) => revealEmpty(index, counts, mines, current));
    setFace("happy");
    playSound("click");
  };

  const toggleFlag = (index: number) => {
    if (lost || won || open.has(index)) return;
    setFlags((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
    playSound("click");
  };

  const colorFor = (count: number) => {
    if (count === 1) return "#0000ff";
    if (count === 2) return "#008000";
    if (count === 3) return "#ff0000";
    if (count === 4) return "#000080";
    if (count === 5) return "#800000";
    if (count === 6) return "#008080";
    if (count === 7) return "#000000";
    return "#808080";
  };

  return (
    <div className="inline-flex flex-col bg-[#c0c0c0] text-[11px]">
      <div className="flex h-[20px] items-center gap-[18px] px-[6px] text-[14px]">
        <button className="cursor-default underline" onClick={reset}>Game</button>
        <button className="cursor-default underline" onClick={() => playSound("click")}>Help</button>
      </div>

      <div
        className="bg-[#c0c0c0] p-[8px]"
        style={{
          boxShadow: "inset -2px -2px #808080, inset 2px 2px #ffffff, inset -3px -3px #404040, inset 3px 3px #dfdfdf",
        }}
      >
        <div
          className="mb-[8px] flex h-[44px] items-center justify-between bg-[#c0c0c0] px-[12px]"
          style={{
            boxShadow: "inset 2px 2px #808080, inset -2px -2px #ffffff",
          }}
        >
          <LedCounter value={totalMines - flags.size} />
          <FaceButton face={face} onClick={reset} />
          <LedCounter value={elapsed} />
        </div>

        <div
          className="grid bg-[#808080]"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
            boxShadow: "inset 2px 2px #808080, inset -2px -2px #ffffff",
            padding: 3,
          }}
        >
          {Array.from({ length: totalCells }, (_, index) => {
            const revealed = open.has(index) || lost;
            const mine = mines.has(index);
            const count = counts[index];
            const flagged = flags.has(index);

            return (
              <button
                key={index}
                aria-label={`Cell ${index}`}
                className="flex items-center justify-center p-0 text-[12px] font-bold leading-none"
                style={{
                  width: cellSize,
                  height: cellSize,
                  ...(revealed
                    ? {
                        background: "#c0c0c0",
                        borderLeft: "1px solid #808080",
                        borderTop: "1px solid #808080",
                        borderRight: "1px solid #dfdfdf",
                        borderBottom: "1px solid #dfdfdf",
                        color: colorFor(count),
                      }
                    : {
                        background: "#c0c0c0",
                        boxShadow: "inset -2px -2px #808080, inset 2px 2px #ffffff, inset -3px -3px #404040, inset 3px 3px #dfdfdf",
                      }),
                }}
                onMouseDown={() => {
                  if (!revealed && !flagged) setFace("pressed");
                }}
                onMouseUp={() => {
                  if (!lost && !won) setFace("happy");
                }}
                onMouseLeave={() => {
                  if (!lost && !won) setFace("happy");
                }}
                onClick={() => openCell(index)}
                onContextMenu={(event) => {
                  event.preventDefault();
                  toggleFlag(index);
                }}
              >
                {revealed && mine ? "✹" : flagged ? "⚑" : revealed && count ? count : ""}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

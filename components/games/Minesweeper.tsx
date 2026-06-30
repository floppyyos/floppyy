"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { GameMenuBar } from "./GameChrome";
import { Win98ErrorDialog } from "@/components/windows/Win98ErrorDialog";

const cols = 16;
const rows = 16;
const totalMines = 40;
const totalCells = cols * rows;
const cellSize = 16;

type Face = "happy" | "pressed" | "lost" | "won";

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

/** Place mines randomly, never on an excluded cell (first-click safety). */
function placeMines(exclude: Set<number>): Set<number> {
  const mines = new Set<number>();
  while (mines.size < totalMines) {
    const cell = Math.floor(Math.random() * totalCells);
    if (!exclude.has(cell)) mines.add(cell);
  }
  return mines;
}

function computeCounts(mines: Set<number>): number[] {
  return Array.from({ length: totalCells }, (_, index) =>
    neighbors(index).filter((neighbor) => mines.has(neighbor)).length,
  );
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
  const clamped = Math.max(-99, Math.min(999, value));
  const negative = clamped < 0;
  const digits = String(Math.abs(clamped)).padStart(negative ? 2 : 3, "0").split("");
  const cells = negative ? ["-", ...digits] : digits;
  return (
    <div className="flex h-[23px] w-[39px] bg-black">
      {cells.map((digit, index) => (
        <Image
          key={`${digit}-${index}`}
          src={`/game-assets/minesweeper/time${digit === "-" ? "-" : digit}.gif`}
          alt=""
          width={13}
          height={23}
          unoptimized
        />
      ))}
    </div>
  );
}

function FaceButton({ face, onClick }: { face: Face; onClick: () => void }) {
  const faceFile = face === "lost" ? "facedead" : face === "won" ? "facewin" : face === "pressed" ? "faceooh" : "facesmile";
  return (
    <button
      aria-label="Reset minesweeper"
      className="h-[26px] w-[26px] bg-[#c0c0c0] p-0"
      style={{ boxShadow: "inset -2px -2px #808080, inset 2px 2px #ffffff" }}
      onClick={onClick}
    >
      <Image src={`/game-assets/minesweeper/${faceFile}.gif`} alt="" width={26} height={26} unoptimized />
    </button>
  );
}

export function Minesweeper({ playSound }: { playSound: (name: string) => void }) {
  const [mines, setMines] = useState<Set<number>>(new Set());
  const [open, setOpen] = useState<Set<number>>(new Set());
  const [flags, setFlags] = useState<Set<number>>(new Set());
  const [questions, setQuestions] = useState<Set<number>>(new Set());
  const [lost, setLost] = useState(false);
  const [deathCell, setDeathCell] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [face, setFace] = useState<Face>("happy");
  const [prankError, setPrankError] = useState(false);

  const counts = useMemo(() => computeCounts(mines), [mines]);
  const won = !lost && started && open.size >= totalCells - totalMines;
  const elapsed = Math.min(999, Math.floor((now - startedAt) / 1000));

  useEffect(() => {
    if (!started || lost || won) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [started, lost, won]);

  useEffect(() => {
    if (won) {
      setFace("won");
      playSound("notification");
    }
  }, [won, playSound]);

  const reset = () => {
    const nextNow = Date.now();
    setMines(new Set());
    setOpen(new Set());
    setFlags(new Set());
    setQuestions(new Set());
    setLost(false);
    setDeathCell(null);
    setStarted(false);
    setStartedAt(nextNow);
    setNow(nextNow);
    setFace("happy");
    setPrankError(false);
    playSound("click");
  };

  const loseWith = (death: number, mineSet: Set<number>) => {
    setMines(mineSet);
    setDeathCell(death);
    setLost(true);
    setFace("lost");
    playSound("error");
    // Easter egg: sometimes rub it in with a fake "data lost" error.
    if (Math.random() < 0.3) {
      window.setTimeout(() => {
        playSound("error");
        setPrankError(true);
      }, 500);
    }
  };

  const openCell = (index: number) => {
    if (lost || won || flags.has(index) || questions.has(index)) return;

    // Chord: clicking a satisfied number opens its remaining neighbors
    if (open.has(index)) {
      const count = counts[index];
      if (count <= 0) return;
      const nbrs = neighbors(index);
      const flaggedCount = nbrs.filter((n) => flags.has(n)).length;
      if (flaggedCount !== count) return;

      const toReveal = nbrs.filter((n) => !flags.has(n) && !questions.has(n) && !open.has(n));
      const hitMine = toReveal.find((n) => mines.has(n));
      if (hitMine !== undefined) {
        loseWith(hitMine, mines);
        return;
      }
      let next = open;
      for (const n of toReveal) next = revealEmpty(n, counts, mines, next);
      if (next !== open) {
        setOpen(next);
        playSound("click");
      }
      return;
    }

    // First click: generate mines avoiding this cell and its neighbors
    let activeMines = mines;
    if (!started) {
      const exclude = new Set<number>([index, ...neighbors(index)]);
      activeMines = placeMines(exclude);
      setMines(activeMines);
      setStarted(true);
      const t = Date.now();
      setStartedAt(t);
      setNow(t);
    }

    if (activeMines.has(index)) {
      loseWith(index, activeMines);
      return;
    }

    const activeCounts = computeCounts(activeMines);
    setOpen((current) => revealEmpty(index, activeCounts, activeMines, current));
    setFace("happy");
    playSound("click");
  };

  // Right click cycles: blank -> flag -> question -> blank
  const cycleMark = (index: number) => {
    if (lost || won || open.has(index)) return;
    if (flags.has(index)) {
      setFlags((s) => {
        const n = new Set(s);
        n.delete(index);
        return n;
      });
      setQuestions((s) => new Set(s).add(index));
    } else if (questions.has(index)) {
      setQuestions((s) => {
        const n = new Set(s);
        n.delete(index);
        return n;
      });
    } else {
      setFlags((s) => new Set(s).add(index));
    }
    playSound("click");
  };

  const cellAsset = (index: number): string => {
    const mine = mines.has(index);
    const flagged = flags.has(index);
    const question = questions.has(index);

    if (lost) {
      if (index === deathCell) return "bombdeath";
      if (mine && flagged) return "bombflagged";
      if (mine) return "bombrevealed";
      if (flagged && !mine) return "bombmisflagged";
    }
    if (won && mine) return "bombflagged";
    if (flagged) return "bombflagged";
    if (question) return "bombquestion";
    if (open.has(index)) return `open${counts[index]}`;
    return "blank";
  };

  return (
    <div className="inline-flex flex-col bg-[#c0c0c0] text-[11px]">
      <GameMenuBar items={[{ label: "Game", onClick: reset }, { label: "Help", onClick: () => playSound("click") }]} />

      <div
        className="bg-[#c0c0c0] p-[6px]"
        style={{
          boxShadow: "inset -2px -2px #808080, inset 2px 2px #ffffff, inset -3px -3px #404040, inset 3px 3px #dfdfdf",
        }}
      >
        <div
          className="mb-[6px] flex h-[37px] items-center justify-between bg-[#c0c0c0] px-[7px]"
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
            const opened = open.has(index);
            const flagged = flags.has(index);
            const question = questions.has(index);
            return (
              <button
                key={index}
                aria-label={`Cell ${index}`}
                className="block p-0"
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundImage: `url('/game-assets/minesweeper/${cellAsset(index)}.gif')`,
                  backgroundSize: "16px 16px",
                  imageRendering: "pixelated",
                }}
                onMouseDown={(event) => {
                  if (event.button === 0 && !opened && !flagged && !question && !lost && !won) setFace("pressed");
                }}
                onMouseUp={() => {
                  if (!lost && !won) setFace("happy");
                }}
                onMouseLeave={() => {
                  if (!lost && !won && face === "pressed") setFace("happy");
                }}
                onClick={() => openCell(index)}
                onContextMenu={(event) => {
                  event.preventDefault();
                  cycleMark(index);
                }}
              />
            );
          })}
        </div>
      </div>

      {prankError && (
        <Win98ErrorDialog
          title="Minesweeper"
          message="Your progress has been lost. Forever."
          onClose={() => setPrankError(false)}
        />
      )}
    </div>
  );
}

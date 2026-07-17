"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GameMenuBar, GameStatusBar } from "./GameChrome";

type GameProps = { playSound: (name: string) => void; onExit?: () => void; windowWidth?: number };

const cellOutset = "inset -1px -1px #808080, inset 1px 1px #fff";
const cellInset = "inset 1px 1px #808080, inset -1px -1px #fff";

function useHighScore(key: string) {
  const [best, setBest] = useState(() => {
    try {
      return Number(globalThis.localStorage.getItem(key) ?? 0);
    } catch {
      return 0;
    }
  });
  const record = useCallback((score: number) => {
    setBest((current) => {
      if (score <= current) return current;
      try {
        globalThis.localStorage.setItem(key, String(score));
      } catch {
        /* ignore */
      }
      return score;
    });
  }, [key]);
  return [best, record] as const;
}

function useTick(enabled: boolean, delay: number, callback: () => void) {
  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(callback, delay);
    return () => window.clearInterval(id);
  }, [callback, delay, enabled]);
}

function Shell({ title, score, best, onExit, onReset, children, status, controls }: {
  title: string;
  score: number;
  best: number;
  onExit?: () => void;
  onReset: () => void;
  children: React.ReactNode;
  status?: string;
  controls?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#c0c0c0] text-[11px]">
      <GameMenuBar
        items={[
          {
            label: "Game",
            menu: [
              { label: "New", shortcut: "F2", onClick: onReset },
              { label: "Exit", separatorBefore: true, onClick: onExit },
            ],
          },
          { label: "Help", menu: [{ label: `About ${title}`, disabled: true }] },
        ]}
      />
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-[#c0c0c0] p-[8px]">
        {children}
      </div>
      {controls && (
        <div className="flex shrink-0 flex-wrap items-center justify-center gap-[4px] border-t border-[#808080] bg-[#c0c0c0] p-[4px] sm:hidden">
          {controls}
        </div>
      )}
      <GameStatusBar>
        <span className="min-w-[95px]">Score: {score}</span>
        <span className="min-w-[95px]">Best: {best}</span>
        <span className="truncate">{status ?? "Ready"}</span>
      </GameStatusBar>
    </div>
  );
}

function TouchButton({ label, onClick, wide }: { label: string; onClick: () => void; wide?: boolean }) {
  return (
    <button
      type="button"
      className={`win-button h-[26px] ${wide ? "min-w-[64px]" : "min-w-[34px]"} px-[8px] text-[13px] font-bold`}
      onPointerDown={(event) => {
        event.preventDefault();
        onClick();
      }}
    >
      {label}
    </button>
  );
}

export function SnakeGame({ playSound, onExit }: GameProps) {
  const [best, record] = useHighScore("floppyy-snake-best");
  const [snake, setSnake] = useState([[8, 6], [7, 6], [6, 6]]);
  const [dir, setDir] = useState<[number, number]>([1, 0]);
  const [food, setFood] = useState([12, 6]);
  const [running, setRunning] = useState(true);
  const score = Math.max(0, snake.length - 3) * 10;

  const reset = useCallback(() => {
    setSnake([[8, 6], [7, 6], [6, 6]]);
    setDir([1, 0]);
    setFood([12, 6]);
    setRunning(true);
    playSound("click");
  }, [playSound]);

  const setSnakeDirection = useCallback((nextDir: [number, number]) => {
    setDir((current) => (current[0] + nextDir[0] === 0 && current[1] + nextDir[1] === 0 ? current : nextDir));
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const next: Record<string, [number, number]> = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
      };
      if (!next[event.key]) return;
      event.preventDefault();
      setSnakeDirection(next[event.key]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSnakeDirection]);

  useTick(running, 120, () => {
    setSnake((current) => {
      const head = current[0];
      const next = [(head[0] + dir[0] + 16) % 16, (head[1] + dir[1] + 12) % 12];
      if (current.some(([x, y]) => x === next[0] && y === next[1])) {
        setRunning(false);
        record(score);
        playSound("error");
        return current;
      }
      const ate = next[0] === food[0] && next[1] === food[1];
      if (ate) {
        setFood([Math.floor(Math.random() * 16), Math.floor(Math.random() * 12)]);
        playSound("click");
      }
      return [next, ...current].slice(0, ate ? current.length + 1 : current.length);
    });
  });

  return (
    <Shell
      title="Snake"
      score={score}
      best={best}
      onExit={onExit}
      onReset={reset}
      status={running ? "Arrow keys or buttons move the snake." : "Game over. Press Game > New."}
      controls={
        <>
          <TouchButton label="◀" onClick={() => setSnakeDirection([-1, 0])} />
          <TouchButton label="▲" onClick={() => setSnakeDirection([0, -1])} />
          <TouchButton label="▼" onClick={() => setSnakeDirection([0, 1])} />
          <TouchButton label="▶" onClick={() => setSnakeDirection([1, 0])} />
        </>
      }
    >
      <div className="grid bg-[#808080] p-[3px]" style={{ gridTemplateColumns: "repeat(16, 16px)", boxShadow: cellInset }}>
        {Array.from({ length: 192 }).map((_, index) => {
          const x = index % 16;
          const y = Math.floor(index / 16);
          const isSnake = snake.some(([sx, sy]) => sx === x && sy === y);
          const isFood = food[0] === x && food[1] === y;
          return <div key={index} className="h-[16px] w-[16px] border border-[#c0c0c0]" style={{ background: isSnake ? "#008000" : isFood ? "#ff0000" : "#000" }} />;
        })}
      </div>
    </Shell>
  );
}

type Point = [number, number];
const TETRIS_SHAPES: Point[][] = [
  [[0, 0], [1, 0], [0, 1], [1, 1]],
  [[0, 0], [-1, 0], [1, 0], [2, 0]],
  [[0, 0], [0, 1], [1, 1], [-1, 0]],
  [[0, 0], [0, 1], [-1, 1], [1, 0]],
  [[0, 0], [-1, 0], [1, 0], [0, 1]],
];

function rotate(shape: Point[]): Point[] {
  return shape.map(([x, y]) => [-y, x]);
}

export function TetrisGame({ playSound, onExit }: GameProps) {
  const [best, record] = useHighScore("floppyy-tetris-best");
  const [board, setBoard] = useState<number[][]>(() => Array.from({ length: 18 }, () => Array(10).fill(0)));
  const [shape, setShape] = useState<Point[]>(TETRIS_SHAPES[0]);
  const [pos, setPos] = useState<Point>([5, 0]);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(true);

  const reset = useCallback(() => {
    setBoard(Array.from({ length: 18 }, () => Array(10).fill(0)));
    setShape(TETRIS_SHAPES[Math.floor(Math.random() * TETRIS_SHAPES.length)]);
    setPos([5, 0]);
    setScore(0);
    setRunning(true);
    playSound("click");
  }, [playSound]);

  const collides = useCallback((nextShape: Point[], nextPos: Point, nextBoard = board) => (
    nextShape.some(([x, y]) => {
      const px = nextPos[0] + x;
      const py = nextPos[1] + y;
      return px < 0 || px >= 10 || py >= 18 || (py >= 0 && nextBoard[py][px]);
    })
  ), [board]);

  const lock = useCallback(() => {
    setBoard((current) => {
      const next = current.map((row) => [...row]);
      shape.forEach(([x, y]) => {
        const px = pos[0] + x;
        const py = pos[1] + y;
        if (py >= 0 && py < 18 && px >= 0 && px < 10) next[py][px] = 1;
      });
      const kept = next.filter((row) => row.some((cell) => !cell));
      const cleared = 18 - kept.length;
      if (cleared) {
        setScore((value) => value + cleared * 100);
        playSound("click");
      }
      return [...Array.from({ length: cleared }, () => Array(10).fill(0)), ...kept];
    });
    const nextShape = TETRIS_SHAPES[Math.floor(Math.random() * TETRIS_SHAPES.length)];
    setShape(nextShape);
    setPos([5, 0]);
    if (collides(nextShape, [5, 0])) {
      setRunning(false);
      record(score);
      playSound("error");
    }
  }, [collides, playSound, pos, record, score, shape]);

  const drop = useCallback(() => {
    const next: Point = [pos[0], pos[1] + 1];
    if (collides(shape, next)) lock();
    else setPos(next);
  }, [collides, lock, pos, shape]);

  const moveSide = useCallback((delta: number) => {
    if (!running) return;
    const next: Point = [pos[0] + delta, pos[1]];
    if (!collides(shape, next)) setPos(next);
  }, [collides, pos, running, shape]);

  const rotateActive = useCallback(() => {
    if (!running) return;
    const nextShape = rotate(shape);
    if (!collides(nextShape, pos)) setShape(nextShape);
  }, [collides, pos, running, shape]);

  useTick(running, 520, drop);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!running) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        moveSide(event.key === "ArrowLeft" ? -1 : 1);
      }
      if (event.key === "ArrowDown") drop();
      if (event.key === "ArrowUp") rotateActive();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drop, moveSide, rotateActive, running]);

  const active = new Set(shape.map(([x, y]) => `${pos[0] + x}:${pos[1] + y}`));
  return (
    <Shell
      title="Tetris"
      score={score}
      best={best}
      onExit={onExit}
      onReset={reset}
      status="Move blocks, rotate, and drop."
      controls={
        <>
          <TouchButton label="◀" onClick={() => moveSide(-1)} />
          <TouchButton label="↻" onClick={rotateActive} />
          <TouchButton label="▶" onClick={() => moveSide(1)} />
          <TouchButton label="▼" onClick={drop} />
        </>
      }
    >
      <div className="grid bg-[#808080] p-[3px]" style={{ gridTemplateColumns: "repeat(10, 18px)", boxShadow: cellInset }}>
        {board.flatMap((row, y) => row.map((cell, x) => (
          <div key={`${x}:${y}`} className="h-[18px] w-[18px]" style={{ background: cell || active.has(`${x}:${y}`) ? "#0000aa" : "#000", boxShadow: cell || active.has(`${x}:${y}`) ? cellOutset : "none" }} />
        )))}
      </div>
    </Shell>
  );
}

export function BreakoutGame({ playSound, onExit, windowWidth }: GameProps) {
  const [best, record] = useHighScore("floppyy-breakout-best");
  const [bricks, setBricks] = useState(() => Array.from({ length: 40 }, () => true));
  const [paddle, setPaddle] = useState(40);
  const [ball, setBall] = useState({ x: 50, y: 70, vx: 1.4, vy: -1.4 });
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(true);
  const reset = () => { setBricks(Array.from({ length: 40 }, () => true)); setBall({ x: 50, y: 70, vx: 1.4, vy: -1.4 }); setPaddle(40); setScore(0); setRunning(true); playSound("click"); };
  const movePaddle = useCallback((delta: number) => {
    setPaddle((value) => Math.max(0, Math.min(80, value + delta)));
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") movePaddle(-7);
      if (event.key === "ArrowRight") movePaddle(7);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [movePaddle]);

  useTick(running, 24, () => {
    setBall((b) => {
      const next = { ...b, x: b.x + b.vx, y: b.y + b.vy };
      if (next.x <= 0 || next.x >= 97) next.vx *= -1;
      if (next.y <= 0) next.vy *= -1;
      if (next.y >= 87 && next.x >= paddle && next.x <= paddle + 20) next.vy = -Math.abs(next.vy);
      const col = Math.floor(next.x / 12.5);
      const row = Math.floor((next.y - 8) / 7);
      const index = row * 8 + col;
      if (row >= 0 && row < 5 && bricks[index]) {
        setBricks((current) => current.map((item, i) => (i === index ? false : item)));
        setScore((value) => value + 10);
        next.vy *= -1;
        playSound("click");
      }
      if (next.y > 100 || bricks.every((brick) => !brick)) {
        setRunning(false);
        record(score);
        if (next.y > 100) playSound("error");
      }
      return next;
    });
  });

  const scale = windowWidth && windowWidth < 430 ? Math.max(0.72, Math.min(1, (windowWidth - 36) / 390)) : 1;

  return (
    <Shell
      title="Breakout"
      score={score}
      best={best}
      onExit={onExit}
      onReset={reset}
      status="Break every brick."
      controls={
        <>
          <TouchButton label="◀" wide onClick={() => movePaddle(-9)} />
          <TouchButton label="▶" wide onClick={() => movePaddle(9)} />
        </>
      }
    >
      <div style={scale < 1 ? { width: 380 * scale, height: 280 * scale } : undefined}>
      <div
        className="relative h-[280px] w-[380px] bg-black"
        style={{
          boxShadow: cellInset,
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: "top left",
        }}
      >
        <div className="absolute left-[12px] top-[12px] grid grid-cols-8 gap-[2px]">
          {bricks.map((brick, index) => <div key={index} className="h-[14px] w-[42px]" style={{ background: brick ? ["#ff0000", "#ffff00", "#00aa00", "#00aaff", "#ff00ff"][Math.floor(index / 8)] : "transparent", boxShadow: brick ? cellOutset : "none" }} />)}
        </div>
        <div className="absolute h-[9px] w-[9px] bg-white" style={{ left: `${ball.x}%`, top: `${ball.y}%` }} />
        <div className="absolute bottom-[16px] h-[9px] w-[20%] bg-[#c0c0c0]" style={{ left: `${paddle}%`, boxShadow: cellOutset }} />
      </div>
      </div>
    </Shell>
  );
}

export function PixelPuzzleGame({ playSound, onExit }: GameProps) {
  const [best, record] = useHighScore("floppyy-pixel-puzzle-best");
  const [tiles, setTiles] = useState(() => [1, 5, 2, 4, 9, 6, 3, 8, 13, 10, 7, 12, 14, 11, 15, 0]);
  const [moves, setMoves] = useState(0);
  const solved = tiles.every((tile, index) => tile === (index === 15 ? 0 : index + 1));
  useEffect(() => { if (solved && moves > 0) record(Math.max(1, 1000 - moves)); }, [moves, record, solved]);
  const reset = () => { setTiles([1, 5, 2, 4, 9, 6, 3, 8, 13, 10, 7, 12, 14, 11, 15, 0]); setMoves(0); playSound("click"); };
  const move = (index: number) => {
    const empty = tiles.indexOf(0);
    const ok = Math.abs((index % 4) - (empty % 4)) + Math.abs(Math.floor(index / 4) - Math.floor(empty / 4)) === 1;
    if (!ok) return;
    setTiles((current) => current.map((tile, i) => (i === empty ? current[index] : i === index ? 0 : tile)));
    setMoves((value) => value + 1);
    playSound("click");
  };
  return (
    <Shell title="Pixel Puzzle" score={Math.max(0, 1000 - moves)} best={best} onExit={onExit} onReset={reset} status={solved ? "Solved!" : "Tap a tile next to the black square."}>
      <div className="grid grid-cols-4 gap-[3px] bg-[#808080] p-[4px]" style={{ boxShadow: cellInset }}>
        {tiles.map((tile, index) => (
          <button key={index} className="h-[58px] w-[58px] text-[18px] font-bold" style={{ background: tile ? "#c0c0c0" : "#000", boxShadow: tile ? cellOutset : cellInset }} onClick={() => move(index)}>
            {tile ? <span style={{ color: tile % 3 === 0 ? "#000080" : tile % 3 === 1 ? "#008080" : "#800000" }}>{tile}</span> : ""}
          </button>
        ))}
      </div>
    </Shell>
  );
}

const WORDS = ["floppy", "modem", "guestbook", "winamp", "desktop", "pixel", "archive", "dialup", "folder", "share"];

export function TypingGame({ playSound, onExit }: GameProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [best, record] = useHighScore("floppyy-typing-best");
  const [word, setWord] = useState(WORDS[0]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(45);
  const running = time > 0;
  const reset = () => { setWord(WORDS[Math.floor(Math.random() * WORDS.length)]); setInput(""); setScore(0); setTime(45); playSound("click"); };
  useTick(running, 1000, () => setTime((value) => value - 1));
  useEffect(() => { if (!running) record(score); }, [record, running, score]);
  return (
    <Shell
      title="Typing"
      score={score}
      best={best}
      onExit={onExit}
      onReset={reset}
      status={`Time: ${time}s`}
      controls={<TouchButton label="Type" wide onClick={() => inputRef.current?.focus()} />}
    >
      <div className="w-[360px] bg-[#c0c0c0] p-[12px]" style={{ boxShadow: cellInset }}>
        <div className="mb-[12px] bg-black px-[10px] py-[12px] text-center text-[24px] font-bold text-[#00ff00]">{word}</div>
        <input
          className="win-bevel-inset h-[28px] w-full bg-white px-[6px] text-[14px]"
          value={input}
          ref={inputRef}
          disabled={!running}
          autoFocus
          onChange={(event) => {
            const value = event.target.value;
            if (value.trim().toLowerCase() === word) {
              setScore((current) => current + word.length * 10);
              setInput("");
              setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
              playSound("click");
            } else {
              setInput(value);
            }
          }}
        />
      </div>
    </Shell>
  );
}

type Piece = "r" | "b" | "R" | "B" | null;
type CheckersSide = "r" | "b";
type CheckersMove = { from: number; to: number; capture?: number };

function checkersDirections(piece: Piece): [number, number][] {
  if (!piece) return [];
  if (piece === "R" || piece === "B") return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  return piece === "r" ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
}

function checkersMoves(board: Piece[], side: CheckersSide): CheckersMove[] {
  const moves = checkersMovesForSide(board, side, false);
  const captures = checkersMovesForSide(board, side, true);
  return captures.length ? captures : moves;
}

function checkersMovesForSide(board: Piece[], side: CheckersSide, capturesOnly: boolean): CheckersMove[] {
  const out: CheckersMove[] = [];

  board.forEach((piece, from) => {
    if (!piece || piece.toLowerCase() !== side) return;
    out.push(...checkersMovesForPiece(board, from, capturesOnly));
  });

  return out;
}

function checkersMovesForPiece(board: Piece[], from: number, capturesOnly: boolean): CheckersMove[] {
  const piece = board[from];
  if (!piece) return [];
  const side = piece.toLowerCase() as CheckersSide;
  const row = Math.floor(from / 8);
  const col = from % 8;
  const moves: CheckersMove[] = [];

  for (const [dr, dc] of checkersDirections(piece)) {
    const nextRow = row + dr;
    const nextCol = col + dc;
    if (nextRow < 0 || nextRow > 7 || nextCol < 0 || nextCol > 7) continue;
    const next = nextRow * 8 + nextCol;

    if (!capturesOnly && !board[next]) {
      moves.push({ from, to: next });
      continue;
    }

    const jumpRow = row + dr * 2;
    const jumpCol = col + dc * 2;
    if (jumpRow < 0 || jumpRow > 7 || jumpCol < 0 || jumpCol > 7) continue;
    const jump = jumpRow * 8 + jumpCol;
    if (board[next]?.toLowerCase() !== side && !board[jump]) {
      moves.push({ from, to: jump, capture: next });
    }
  }

  return moves;
}

function applyCheckersMove(board: Piece[], move: CheckersMove, side: CheckersSide): Piece[] {
  const piece = board[move.from];
  if (!piece) return board;
  const next = [...board];
  const targetRow = Math.floor(move.to / 8);
  next[move.from] = null;
  if (typeof move.capture === "number") next[move.capture] = null;
  next[move.to] = (side === "r" && targetRow === 0) || (side === "b" && targetRow === 7)
    ? side.toUpperCase() as Piece
    : piece;
  return next;
}

export function CheckersGame({ playSound, onExit }: GameProps) {
  const initial = () => Array.from({ length: 64 }, (_, i): Piece => {
    const row = Math.floor(i / 8);
    const dark = (row + i) % 2 === 1;
    if (!dark) return null;
    if (row < 3) return "b";
    if (row > 4) return "r";
    return null;
  });
  const [board, setBoard] = useState<Piece[]>(initial);
  const [turn, setTurn] = useState<"r" | "b">("r");
  const [selected, setSelected] = useState<number | null>(null);
  const [forcedFrom, setForcedFrom] = useState<number | null>(null);
  const white = board.filter((p) => p?.toLowerCase() === "r").length;
  const black = board.filter((p) => p?.toLowerCase() === "b").length;
  const legalWhiteMoves = checkersMoves(board, "r");
  const whiteMustCapture = legalWhiteMoves.some((item) => typeof item.capture === "number");
  const selectedMoves = selected === null ? [] : legalWhiteMoves.filter((item) => item.from === selected);
  const playablePieces = new Set(legalWhiteMoves.map((item) => item.from));
  const validTargets = new Set(selectedMoves.map((item) => item.to));
  const reset = () => { setBoard(initial()); setTurn("r"); setSelected(null); setForcedFrom(null); playSound("click"); };

  useEffect(() => {
    if (turn !== "b" || white === 0 || black === 0) return;
    const timer = window.setTimeout(() => {
      setBoard((current) => {
        let nextBoard = current;
        const moves = checkersMoves(nextBoard, "b");
        if (moves.length === 0) return current;
        let move = moves[Math.floor(Math.random() * moves.length)];
        let jumped = false;

        while (move) {
          jumped = jumped || typeof move.capture === "number";
          nextBoard = applyCheckersMove(nextBoard, move, "b");
          const piece = nextBoard[move.to];
          const crowned = piece === "B" && Math.floor(move.to / 8) === 7;
          const followUps = typeof move.capture === "number" && !crowned
            ? checkersMovesForPiece(nextBoard, move.to, true)
            : [];
          move = followUps[Math.floor(Math.random() * followUps.length)];
        }

        playSound(jumped ? "recycle" : "click");
        return nextBoard;
      });
      setTurn("r");
      setSelected(null);
      setForcedFrom(null);
    }, 550);
    return () => window.clearTimeout(timer);
  }, [black, playSound, turn, white]);

  const move = (to: number) => {
    if (turn !== "r") return;
    if (selected === null) {
      if (board[to]?.toLowerCase() === "r" && playablePieces.has(to) && (forcedFrom === null || forcedFrom === to)) {
        setSelected(to);
      }
      return;
    }
    const piece = board[selected];
    if (!piece || board[to]) { setSelected(null); return; }

    const valid = selectedMoves.find((item) => item.to === to);
    if (!valid) { setSelected(null); return; }
    const nextBoard = applyCheckersMove(board, valid, "r");
    const crowned = nextBoard[to] === "R" && Math.floor(to / 8) === 0;
    const followUps = typeof valid.capture === "number" && !crowned
      ? checkersMovesForPiece(nextBoard, to, true)
      : [];
    setBoard(nextBoard);
    if (followUps.length > 0) {
      setForcedFrom(to);
      setSelected(to);
    } else {
      setTurn("b");
      setSelected(null);
      setForcedFrom(null);
    }
    playSound(typeof valid.capture === "number" ? "recycle" : "click");
  };

  const status = white === 0
    ? "Computer wins."
    : black === 0
      ? "White wins."
      : turn === "b"
        ? "Computer thinking..."
        : forcedFrom !== null
          ? "Keep jumping with the selected piece."
          : whiteMustCapture
            ? `White to move. Capture required. White ${white} / Black ${black}`
            : `White to move. White ${white} / Black ${black}`;

  return (
    <Shell title="Checkers" score={white} best={black} onExit={onExit} onReset={reset} status={status}>
      <div className="grid grid-cols-8 border border-[#808080]">
        {board.map((piece, index) => {
          const row = Math.floor(index / 8);
          const dark = (row + index) % 2 === 1;
          const canMove = turn === "r" && piece?.toLowerCase() === "r" && playablePieces.has(index) && (forcedFrom === null || forcedFrom === index);
          const canLand = validTargets.has(index);
          return (
            <button
              key={index}
              className="relative flex h-[38px] w-[38px] items-center justify-center"
              style={{
                background: dark ? "#008080" : "#f0e6c0",
                outline: selected === index ? "2px solid #ffff00" : canMove ? "1px solid #ffff00" : "none",
              }}
              onClick={() => move(index)}
            >
              {canLand && <span className="absolute h-[12px] w-[12px] rounded-full bg-[#ffff00] opacity-80" />}
              {piece && <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-black text-[12px] font-bold" style={{ background: piece.toLowerCase() === "r" ? "#ffffff" : "#111111", color: piece.toLowerCase() === "r" ? "#000" : "#fff", boxShadow: cellOutset }}>{piece === piece.toUpperCase() ? "K" : ""}</span>}
            </button>
          );
        })}
      </div>
    </Shell>
  );
}

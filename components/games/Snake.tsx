"use client";

import { useEffect, useState } from "react";

type Point = { x: number; y: number };
const grid = 14;

export function Snake({ playSound }: { playSound: (name: string) => void }) {
  const [snake, setSnake] = useState<Point[]>([{ x: 4, y: 7 }, { x: 3, y: 7 }]);
  const [dir, setDir] = useState<Point>({ x: 1, y: 0 });
  const [food, setFood] = useState<Point>({ x: 9, y: 7 });
  const [paused, setPaused] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") setDir({ x: 0, y: -1 });
      if (event.key === "ArrowDown") setDir({ x: 0, y: 1 });
      if (event.key === "ArrowLeft") setDir({ x: -1, y: 0 });
      if (event.key === "ArrowRight") setDir({ x: 1, y: 0 });
      if (event.key === " ") setPaused((value) => !value);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setSnake((current) => {
        const head = { x: (current[0].x + dir.x + grid) % grid, y: (current[0].y + dir.y + grid) % grid };
        const ate = head.x === food.x && head.y === food.y;
        if (current.some((part) => part.x === head.x && part.y === head.y)) {
          playSound("error");
          setScore(0);
          return [{ x: 4, y: 7 }, { x: 3, y: 7 }];
        }
        if (ate) {
          playSound("click");
          setScore((value) => value + 10);
          setFood({ x: Math.floor(Math.random() * grid), y: Math.floor(Math.random() * grid) });
        }
        return [head, ...current].slice(0, ate ? current.length + 1 : current.length);
      });
    }, 140);
    return () => window.clearInterval(timer);
  }, [dir, food, paused, playSound]);

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <button className="win-button" onClick={() => setPaused((value) => !value)}>
          {paused ? "Start" : "Pause"}
        </button>
        <span>Score: {score}</span>
      </div>
      <div className="win-bevel-inset grid bg-black p-1" style={{ gridTemplateColumns: `repeat(${grid}, 14px)`, width: grid * 14 + 8 }}>
        {Array.from({ length: grid * grid }, (_, index) => {
          const x = index % grid;
          const y = Math.floor(index / grid);
          const body = snake.some((part) => part.x === x && part.y === y);
          const isFood = food.x === x && food.y === y;
          return <span key={index} className="h-[14px] w-[14px]" style={{ background: body ? "#00ff66" : isFood ? "#ff3030" : "#001800" }} />;
        })}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { GameMenuBar, GameStatusBar } from "./GameChrome";

type Point = { x: number; y: number };
const grid = 20;
const initialSnake = [{ x: 6, y: 10 }, { x: 5, y: 10 }, { x: 4, y: 10 }];

export function Snake({ playSound }: { playSound: (name: string) => void }) {
  const [snake, setSnake] = useState<Point[]>(initialSnake);
  const [dir, setDir] = useState<Point>({ x: 1, y: 0 });
  const [food, setFood] = useState<Point>({ x: 14, y: 10 });
  const [paused, setPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const newGame = () => {
    setSnake(initialSnake);
    setDir({ x: 1, y: 0 });
    setFood({ x: 14, y: 10 });
    setScore(0);
    setPaused(false);
    playSound("click");
  };

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) event.preventDefault();
      if (event.key === "ArrowUp" && dir.y !== 1) setDir({ x: 0, y: -1 });
      if (event.key === "ArrowDown" && dir.y !== -1) setDir({ x: 0, y: 1 });
      if (event.key === "ArrowLeft" && dir.x !== 1) setDir({ x: -1, y: 0 });
      if (event.key === "ArrowRight" && dir.x !== -1) setDir({ x: 1, y: 0 });
      if (event.key === " ") setPaused((value) => !value);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [dir]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setSnake((current) => {
        const head = { x: (current[0].x + dir.x + grid) % grid, y: (current[0].y + dir.y + grid) % grid };
        const ate = head.x === food.x && head.y === food.y;
        if (current.some((part) => part.x === head.x && part.y === head.y)) {
          playSound("error");
          setPaused(true);
          setHighScore((value) => Math.max(value, score));
          return initialSnake;
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
  }, [dir, food, paused, playSound, score]);

  return (
    <div className="flex h-full min-h-[330px] flex-col bg-[#c0c0c0]">
      <GameMenuBar items={[
        { label: "Game", onClick: newGame },
        { label: "Options", onClick: () => setPaused((value) => !value) },
        { label: "Help", onClick: () => playSound("click") },
      ]} />
      <div className="mb-[5px] flex h-[36px] shrink-0 items-center gap-[6px] px-[6px] text-[11px]">
        <div className="win-bevel-inset flex h-[24px] min-w-[92px] items-center bg-white px-[6px]">Score: {String(score).padStart(4, "0")}</div>
        <div className="win-bevel-inset flex h-[24px] min-w-[92px] items-center bg-white px-[6px]">High: {String(highScore).padStart(4, "0")}</div>
        <button className="win-button ml-auto min-w-[68px]" onClick={() => setPaused((value) => !value)}>{paused ? "Start" : "Pause"}</button>
      </div>
      <div className="win-bevel-inset mx-auto grid bg-black p-[3px]" style={{ gridTemplateColumns: `repeat(${grid}, 14px)`, width: grid * 14 + 6 }}>
        {Array.from({ length: grid * grid }, (_, index) => {
          const x = index % grid;
          const y = Math.floor(index / grid);
          const bodyIndex = snake.findIndex((part) => part.x === x && part.y === y);
          const isFood = food.x === x && food.y === y;
          return <span key={index} className="h-[14px] w-[14px] border border-[#062006]" style={{ background: bodyIndex === 0 ? "#ffff00" : bodyIndex > 0 ? "#00c000" : isFood ? "#ff0000" : "#001000" }} />;
        })}
      </div>
      <GameStatusBar>{paused ? "Paused" : "Running"}<span className="ml-auto">Arrow keys move | Space pauses</span></GameStatusBar>
    </div>
  );
}

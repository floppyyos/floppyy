"use client";

import { useEffect, useRef } from "react";

const MAZE_SIZE = 21;
const VIEW_WIDTH = 480;
const VIEW_HEIGHT = 270;

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function createMaze() {
  const random = seededRandom(98);
  const grid = Array.from({ length: MAZE_SIZE }, () => Array(MAZE_SIZE).fill(1));
  const stack: Array<[number, number]> = [[1, 1]];
  grid[1][1] = 0;

  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const choices = [
      [2, 0],
      [-2, 0],
      [0, 2],
      [0, -2],
    ].filter(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      return nx > 0 && ny > 0 && nx < MAZE_SIZE - 1 && ny < MAZE_SIZE - 1 && grid[ny][nx] === 1;
    });

    if (!choices.length) {
      stack.pop();
      continue;
    }

    const [dx, dy] = choices[Math.floor(random() * choices.length)];
    grid[y + dy / 2][x + dx / 2] = 0;
    grid[y + dy][x + dx] = 0;
    stack.push([x + dx, y + dy]);
  }
  return grid;
}

function angleDifference(target: number, current: number) {
  return Math.atan2(Math.sin(target - current), Math.cos(target - current));
}

export function MazeScreensaver() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const maze = createMaze();
    const random = seededRandom(1998);
    let x = 1.5;
    let y = 1.5;
    let angle = 0;
    let previousCell = "";
    let target = { x: 2.5, y: 1.5 };
    let animation = 0;
    let lastTime = performance.now();

    const chooseTarget = () => {
      const cellX = Math.floor(x);
      const cellY = Math.floor(y);
      const currentCell = `${cellX},${cellY}`;
      const options = [
        [cellX + 1, cellY],
        [cellX - 1, cellY],
        [cellX, cellY + 1],
        [cellX, cellY - 1],
      ].filter(([nextX, nextY]) => maze[nextY]?.[nextX] === 0 && `${nextX},${nextY}` !== previousCell);
      const fallback = [
        [cellX + 1, cellY],
        [cellX - 1, cellY],
        [cellX, cellY + 1],
        [cellX, cellY - 1],
      ].filter(([nextX, nextY]) => maze[nextY]?.[nextX] === 0);
      const candidates = options.length ? options : fallback;
      const [nextX, nextY] = candidates[Math.floor(random() * candidates.length)] ?? [1, 1];
      previousCell = currentCell;
      target = { x: nextX + 0.5, y: nextY + 0.5 };
    };

    const render = () => {
      context.fillStyle = "#050505";
      context.fillRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT / 2);
      context.fillStyle = "#314b31";
      context.fillRect(0, VIEW_HEIGHT / 2, VIEW_WIDTH, VIEW_HEIGHT / 2);

      const fov = Math.PI / 3;
      for (let column = 0; column < VIEW_WIDTH; column += 2) {
        const rayAngle = angle - fov / 2 + (column / VIEW_WIDTH) * fov;
        const rayX = Math.cos(rayAngle);
        const rayY = Math.sin(rayAngle);
        let distance = 0;
        let hitX = x;
        let hitY = y;

        while (distance < 24) {
          distance += 0.035;
          hitX = x + rayX * distance;
          hitY = y + rayY * distance;
          if (maze[Math.floor(hitY)]?.[Math.floor(hitX)] !== 0) break;
        }

        const corrected = Math.max(0.12, distance * Math.cos(rayAngle - angle));
        const wallHeight = Math.min(VIEW_HEIGHT * 1.8, VIEW_HEIGHT / corrected);
        const top = (VIEW_HEIGHT - wallHeight) / 2;
        const edge = Math.min(hitX % 1, hitY % 1);
        const brick = (Math.floor(hitY * 4) + Math.floor(hitX * 4)) % 2;
        const light = Math.max(32, 178 - corrected * 13 + brick * 18 - edge * 20);
        context.fillStyle = `rgb(${light * 0.74}, ${light * 0.82}, ${light})`;
        context.fillRect(column, top, 2, wallHeight);
        if (column % 20 === 0) {
          context.fillStyle = "rgba(18, 26, 36, 0.34)";
          context.fillRect(column, top, 1, wallHeight);
        }
      }
    };

    const tick = (time: number) => {
      const delta = Math.min(0.04, (time - lastTime) / 1000);
      lastTime = time;
      const desiredAngle = Math.atan2(target.y - y, target.x - x);
      const turn = angleDifference(desiredAngle, angle);

      if (Math.abs(turn) > 0.035) {
        angle += Math.sign(turn) * Math.min(Math.abs(turn), delta * 2.4);
      } else {
        const distance = Math.hypot(target.x - x, target.y - y);
        if (distance < 0.08) chooseTarget();
        else {
          const speed = Math.min(distance, delta * 1.35);
          x += Math.cos(angle) * speed;
          y += Math.sin(angle) * speed;
        }
      }

      render();
      animation = window.requestAnimationFrame(tick);
    };

    canvas.width = VIEW_WIDTH;
    canvas.height = VIEW_HEIGHT;
    render();
    animation = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animation);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full bg-black"
      style={{ imageRendering: "pixelated" }}
      aria-label="3D Maze screensaver"
    />
  );
}

"use client";

import type { WindowComponentProps, WindowId } from "@/lib/windows";
import {
  BreakoutGame,
  CheckersGame,
  PixelPuzzleGame,
  SnakeGame,
  TetrisGame,
  TypingGame,
} from "@/components/games/RetroGames";

export function RetroGameWindow({ playSound, window: win, closeWindow }: WindowComponentProps) {
  const props = { playSound, onExit: () => closeWindow(win.instanceId) };
  switch (win.id as WindowId) {
    case "snake":
      return <SnakeGame {...props} />;
    case "tetris":
      return <TetrisGame {...props} />;
    case "breakout":
      return <BreakoutGame {...props} />;
    case "pixel-puzzle":
      return <PixelPuzzleGame {...props} />;
    case "typing-game":
      return <TypingGame {...props} />;
    case "checkers":
      return <CheckersGame {...props} />;
    default:
      return null;
  }
}

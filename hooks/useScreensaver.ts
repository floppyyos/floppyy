"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ScreensaverMode = "pipes" | "stars" | "maze" | "mystify" | "flying-windows";

export function useScreensaver(timeoutMs = 60000, suspended = false) {
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<ScreensaverMode>("flying-windows");
  const timer = useRef<number | null>(null);
  const activatedAt = useRef(0);

  const clear = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const schedule = useCallback(() => {
    clear();
    timer.current = window.setTimeout(() => {
      activatedAt.current = performance.now();
      setActive(true);
    }, timeoutMs);
  }, [clear, timeoutMs]);

  const start = useCallback((nextMode: ScreensaverMode = "flying-windows") => {
    activatedAt.current = performance.now();
    setMode(nextMode);
    setActive(true);
  }, []);

  const stop = useCallback(() => {
    setActive(false);
    schedule();
  }, [schedule]);

  useEffect(() => {
    if (suspended) {
      clear();
      const idle = window.setTimeout(() => setActive(false), 0);
      return () => window.clearTimeout(idle);
    }

    schedule();
    const activity = () => {
      if (active && performance.now() - activatedAt.current > 500) {
        setActive(false);
      }
      schedule();
    };
    window.addEventListener("pointermove", activity);
    window.addEventListener("pointerdown", activity);
    window.addEventListener("keydown", activity);
    return () => {
      clear();
      window.removeEventListener("pointermove", activity);
      window.removeEventListener("pointerdown", activity);
      window.removeEventListener("keydown", activity);
    };
  }, [active, clear, schedule, suspended]);

  return { active, mode, start, stop, setMode };
}

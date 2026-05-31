"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ScreensaverMode = "pipes" | "stars";

export function useScreensaver(timeoutMs = 60000) {
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<ScreensaverMode>("stars");
  const timer = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const schedule = useCallback(() => {
    clear();
    timer.current = window.setTimeout(() => {
      setActive(true);
    }, timeoutMs);
  }, [clear, timeoutMs]);

  const start = useCallback((nextMode: ScreensaverMode = "stars") => {
    setMode(nextMode);
    setActive(true);
  }, []);

  const stop = useCallback(() => {
    setActive(false);
    schedule();
  }, [schedule]);

  useEffect(() => {
    schedule();
    const activity = () => {
      if (active) {
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
  }, [active, clear, schedule]);

  return { active, mode, start, stop };
}

"use client";

import { useEffect, useRef } from "react";

export function useDoubleClick<T>(single: (value: T) => void, double: (value: T) => void, delay = 240) {
  const clickTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (clickTimer.current) {
        window.clearTimeout(clickTimer.current);
        clickTimer.current = null;
      }
    };
  }, []);

  return (value: T) => {
    if (clickTimer.current) {
      window.clearTimeout(clickTimer.current);
      clickTimer.current = null;
      double(value);
      return;
    }

    clickTimer.current = window.setTimeout(() => {
      single(value);
      clickTimer.current = null;
    }, delay);
  };
}

"use client";

import { Snake } from "@/components/games/Snake";
import type { WindowComponentProps } from "@/lib/windows";

export function SnakeWindow({ playSound }: WindowComponentProps) {
  return <Snake playSound={playSound} />;
}

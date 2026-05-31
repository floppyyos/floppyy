"use client";

import { BiosScreen } from "./BiosScreen";

export type BootMode = "normal" | "logged" | "safe" | "command";

export function BootScreen({
  onComplete,
}: {
  onComplete: (mode: BootMode) => void;
  playSound: (name: string) => void;
}) {
  return <BiosScreen onComplete={onComplete} />;
}

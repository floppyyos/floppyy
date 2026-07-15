"use client";

import type { CSSProperties } from "react";
import type { GuestbookAvatar } from "@/lib/guestbook/types";

export const AVATAR_LABELS: Record<GuestbookAvatar, string> = {
  "face-smile": "Pixel face",
  "face-cool": "Cool face",
  computer: "Computer",
  floppy: "Floppy disk",
  cd: "Compact disc",
  modem: "Modem",
  mouse: "Mouse",
  game: "Game sprite",
  spark: "Abstract icon",
};

type Props = {
  avatar: GuestbookAvatar;
  size?: number;
  selected?: boolean;
};

export function GuestbookAvatarIcon({ avatar, size = 24, selected = false }: Props) {
  const px = Math.max(18, size);
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center border border-[#808080] bg-[#c0c0c0]"
      title={AVATAR_LABELS[avatar]}
      style={{
        width: px,
        height: px,
        boxShadow: selected
          ? "0 0 0 1px #000080, inset 1px 1px #ffffff, inset -1px -1px #404040"
          : "inset 1px 1px #ffffff, inset -1px -1px #404040",
      }}
      aria-hidden="true"
    >
      <AvatarGlyph avatar={avatar} size={px - 4} />
    </span>
  );
}

function AvatarGlyph({ avatar, size }: { avatar: GuestbookAvatar; size: number }) {
  const common: CSSProperties = { imageRendering: "pixelated", shapeRendering: "crispEdges" };
  switch (avatar) {
    case "face-cool":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" style={common}>
          <rect x="2" y="2" width="12" height="12" fill="#ffe05a" stroke="#000" />
          <rect x="4" y="6" width="3" height="2" fill="#000" />
          <rect x="9" y="6" width="3" height="2" fill="#000" />
          <rect x="7" y="6" width="2" height="1" fill="#000" />
          <rect x="5" y="11" width="6" height="1" fill="#7a3b00" />
        </svg>
      );
    case "computer":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" style={common}>
          <rect x="2" y="2" width="12" height="9" fill="#d8d8d8" stroke="#000" />
          <rect x="4" y="4" width="8" height="5" fill="#008080" />
          <rect x="6" y="11" width="4" height="2" fill="#c0c0c0" stroke="#000" />
          <rect x="4" y="13" width="8" height="1" fill="#808080" />
        </svg>
      );
    case "floppy":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" style={common}>
          <rect x="2" y="2" width="12" height="12" fill="#244c9a" stroke="#000" />
          <rect x="4" y="3" width="7" height="4" fill="#c0c0c0" />
          <rect x="5" y="10" width="6" height="3" fill="#fff" />
          <rect x="11" y="3" width="1" height="3" fill="#000" />
        </svg>
      );
    case "cd":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" style={common}>
          <rect width="16" height="16" fill="#c0c0c0" />
          <circle cx="8" cy="8" r="6" fill="#dff4ff" stroke="#000" />
          <path d="M8 2A6 6 0 0 1 14 8H8Z" fill="#ffef6b" />
          <path d="M8 8L3 11A6 6 0 0 1 4 4Z" fill="#79d6ff" />
          <circle cx="8" cy="8" r="2" fill="#fff" stroke="#808080" />
        </svg>
      );
    case "modem":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" style={common}>
          <rect x="2" y="7" width="12" height="6" fill="#d8d8d8" stroke="#000" />
          <rect x="4" y="9" width="2" height="1" fill="#00b000" />
          <rect x="7" y="9" width="2" height="1" fill="#00b000" />
          <rect x="10" y="9" width="2" height="1" fill="#ff0000" />
          <path d="M4 7V4H12V7" fill="none" stroke="#000" />
        </svg>
      );
    case "mouse":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" style={common}>
          <rect x="5" y="2" width="6" height="12" rx="3" fill="#e8e8e8" stroke="#000" />
          <rect x="8" y="3" width="1" height="4" fill="#808080" />
          <rect x="7" y="3" width="1" height="3" fill="#c0c0c0" />
          <path d="M11 12C14 12 14 9 13 8" fill="none" stroke="#000" />
        </svg>
      );
    case "game":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" style={common}>
          <rect x="3" y="4" width="10" height="8" fill="#404040" stroke="#000" />
          <rect x="5" y="7" width="1" height="3" fill="#fff" />
          <rect x="4" y="8" width="3" height="1" fill="#fff" />
          <rect x="10" y="7" width="2" height="2" fill="#ff3333" />
          <rect x="9" y="10" width="2" height="1" fill="#33ff33" />
        </svg>
      );
    case "spark":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" style={common}>
          <rect width="16" height="16" fill="#000080" />
          <rect x="7" y="1" width="2" height="14" fill="#ffff00" />
          <rect x="1" y="7" width="14" height="2" fill="#ffff00" />
          <rect x="4" y="4" width="8" height="8" fill="#ff00ff" opacity="0.75" />
          <rect x="6" y="6" width="4" height="4" fill="#00ffff" />
        </svg>
      );
    case "face-smile":
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" style={common}>
          <rect x="2" y="2" width="12" height="12" fill="#ffe05a" stroke="#000" />
          <rect x="5" y="6" width="2" height="2" fill="#000" />
          <rect x="10" y="6" width="2" height="2" fill="#000" />
          <path d="M5 10H6V11H10V10H11V12H5Z" fill="#7a3b00" />
        </svg>
      );
  }
}

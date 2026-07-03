"use client";

import { FloppyyIcon } from "./FloppyyIcon";

type Props = {
  id: string;
  label: string;
  icon: string;
  selected: boolean;
  x: number;
  y: number;
  onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (event: React.PointerEvent<HTMLButtonElement>) => void;
  onContextMenu: (event: React.MouseEvent) => void;
};

export function DesktopIcon({ label, icon, selected, x, y, onPointerDown, onPointerMove, onPointerUp, onContextMenu }: Props) {
  return (
    <button
      className="desktop-icon-button absolute flex h-[68px] w-[75px] touch-none flex-col items-center justify-start gap-[2px] p-[2px] text-white focus:outline-none"
      style={{ left: x, top: y }}
      title={label}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onContextMenu={onContextMenu}
      aria-label={label}
    >
      <span
        className="flex items-center justify-center p-[2px]"
        style={selected ? { background: "rgba(0, 0, 128, 0.4)", mixBlendMode: "normal" } : undefined}
      >
        <FloppyyIcon type={icon} size={32} />
      </span>
      <span
        className={`desktop-icon-label max-w-[72px] break-words text-center text-[11px] leading-[13px] px-[2px] py-[1px] ${
          selected
            ? "bg-[#000080] text-white outline outline-1 outline-dotted outline-white"
            : "text-white"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

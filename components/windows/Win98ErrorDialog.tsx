"use client";

import type { ReactNode } from "react";

function DefaultErrorIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" className="shrink-0">
      <circle cx="16" cy="16" r="14" fill="#d51b1b" stroke="#7a0d0d" strokeWidth="1" />
      <circle cx="16" cy="16" r="14" fill="none" stroke="#ff6b6b" strokeWidth="1" opacity="0.5" />
      <path d="M10 10 L22 22 M22 10 L10 22" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * A single, centered Windows 98 style error dialog. Used for the lighter
 * prank pop-ups (Recycle Bin, Minesweeper, ...) that don't crash the system.
 */
export function Win98ErrorDialog({
  title = "Error",
  message,
  buttonLabel = "OK",
  onClose,
  icon,
  zIndex = 7500,
}: {
  title?: string;
  message: ReactNode;
  buttonLabel?: string;
  onClose: () => void;
  icon?: ReactNode;
  zIndex?: number;
}) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
      onPointerDown={onClose}
    >
      <div
        className="w-[320px] select-none bg-[#c0c0c0]"
        style={{
          boxShadow:
            "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
          padding: 3,
        }}
        onPointerDown={(event) => event.stopPropagation()}
        role="alertdialog"
        aria-label={title}
      >
        <div className="flex h-[18px] items-center justify-between bg-gradient-to-r from-[#000080] to-[#1084d0] pl-[4px] pr-[2px]">
          <span className="truncate text-[11px] font-bold text-white">{title}</span>
          <button
            className="flex h-[14px] w-[16px] items-center justify-center text-[10px] leading-none text-black"
            style={{
              background: "#c0c0c0",
              boxShadow:
                "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
            }}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-[14px] px-[16px] py-[18px]">
          {icon ?? <DefaultErrorIcon />}
          <span className="text-[11px] leading-[15px] text-black">{message}</span>
        </div>

        <div className="flex justify-center pb-[14px]">
          <button className="win-button min-w-[80px] text-[11px]" onClick={onClose} autoFocus>
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

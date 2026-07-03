"use client";

import { useEffect, useRef, useState, type ReactNode, type KeyboardEvent } from "react";

export type Win98SelectOption = { value: string; label: ReactNode };

const FIELD_SHADOW =
  "inset -1px -1px #ffffff, inset 1px 1px #808080, inset -2px -2px #dfdfdf, inset 2px 2px #0a0a0a";
const BUTTON_SHADOW =
  "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf";

/**
 * Windows 98 styled dropdown that replaces the native <select>, including the
 * open list, so the whole control matches the classic look on every platform.
 */
export function Win98Select({
  value,
  onChange,
  options,
  className = "",
  ariaLabel,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Win98SelectOption[];
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selectedLabel = options[selectedIndex]?.label ?? "";

  useEffect(() => {
    if (open) setHighlight(selectedIndex);
  }, [open, selectedIndex]);

  const commit = (i: number) => {
    const opt = options[i];
    if (opt) onChange(opt.value);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) setOpen(true);
        else setHighlight((h) => Math.min(options.length - 1, h + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) setOpen(true);
        else setHighlight((h) => Math.max(0, h - 1));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) commit(highlight);
        else setOpen(true);
        break;
      case "Escape":
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div
        role="combobox"
        aria-expanded={open}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={onKeyDown}
        onClick={() => !disabled && setOpen((o) => !o)}
        className="flex h-[22px] cursor-default select-none items-center py-[1px] pl-[4px] pr-[1px] text-[11px] text-black"
        style={{ background: disabled ? "#c0c0c0" : "#ffffff", boxShadow: FIELD_SHADOW }}
      >
        <span className={`flex-1 truncate ${disabled ? "text-[#808080]" : ""}`}>{selectedLabel}</span>
        <span
          aria-hidden="true"
          className="ml-[2px] flex h-[18px] w-[16px] shrink-0 items-center justify-center bg-[#c0c0c0] text-[8px] leading-none"
          style={{ boxShadow: BUTTON_SHADOW }}
        >
          ▼
        </span>
      </div>

      {open && !disabled && (
        <>
          <div className="fixed inset-0 z-[6000]" onMouseDown={() => setOpen(false)} />
          <ul
            role="listbox"
            className="absolute left-0 right-0 top-full z-[6001] mt-[1px] max-h-[220px] overflow-auto bg-white py-[1px] text-[11px] text-black"
            style={{ border: "1px solid #0a0a0a" }}
          >
            {options.map((o, i) => {
              const active = i === highlight;
              return (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={o.value === value}
                  onMouseEnter={() => setHighlight(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    commit(i);
                  }}
                  className="cursor-default truncate px-[5px] py-[1px]"
                  style={active ? { background: "#000080", color: "#ffffff" } : undefined}
                >
                  {o.label}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

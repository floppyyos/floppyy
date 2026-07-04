"use client";

/**
 * Windows 98 Explorer "Standard Buttons" toolbar icons.
 *
 * The common, shared icons (back, forward, up, cut, copy, paste, undo, delete,
 * properties, refresh, views) are the real bitmaps sliced out of the original
 * /public/icons-ui.png strip into /public/icons/toolbar/*.png (see BITMAP_ICONS
 * below). Browser-only icons (stop, home, search, favorites, history, print,
 * security) still use the hand-drawn inline SVG recreations further down.
 */

type Props = {
  name: string;
  size?: number;
};

const BITMAP_ICONS = new Set([
  "back",
  "forward",
  "up",
  "cut",
  "copy",
  "paste",
  "undo",
  "delete",
  "properties",
  "refresh",
  "views",
  "stop",
  "home",
  "search",
  "favorites",
  "history",
  "print",
  "security",
]);

export function ToolbarIcon({ name, size = 20 }: Props) {
  if (BITMAP_ICONS.has(name)) {
    return (
      <img
        src={`/icons/toolbar/${name}.png`}
        alt=""
        width={size}
        height={size}
        draggable={false}
        style={{ imageRendering: "pixelated", display: "block", width: size, height: size }}
      />
    );
  }

  const common = {
    width: size,
    height: size,
    viewBox: "0 0 20 20",
    shapeRendering: "geometricPrecision" as const,
    style: { display: "block" as const },
  };

  switch (name) {
    case "back":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M9 3 L2 10 L9 17 L9 13 L17 13 L17 7 L9 7 Z"
            fill="#1b50a8"
            stroke="#0e2d63"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path d="M8 5.5 L3.8 10 L8 14.5 Z" fill="#6f9be0" />
        </svg>
      );
    case "forward":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M11 3 L18 10 L11 17 L11 13 L3 13 L3 7 L11 7 Z"
            fill="#1b50a8"
            stroke="#0e2d63"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path d="M12 5.5 L16.2 10 L12 14.5 Z" fill="#6f9be0" />
        </svg>
      );
    case "up":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M2 7 L2 16 L18 16 L18 6 L9 6 L7.5 4.5 L3 4.5 Z"
            fill="#f7c14b"
            stroke="#8a6a16"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path d="M10 6 L13.5 10 L11.5 10 L11.5 14 L8.5 14 L8.5 10 L6.5 10 Z" fill="#1b50a8" stroke="#0e2d63" strokeWidth="0.8" strokeLinejoin="round" />
        </svg>
      );
    case "cut":
      return (
        <svg {...common} aria-hidden="true">
          <line x1="7" y1="7" x2="17" y2="15" stroke="#9aa6b2" strokeWidth="1.6" />
          <line x1="7" y1="13" x2="17" y2="5" stroke="#9aa6b2" strokeWidth="1.6" />
          <circle cx="5" cy="6" r="2.4" fill="none" stroke="#3a3a3a" strokeWidth="1.4" />
          <circle cx="5" cy="14" r="2.4" fill="none" stroke="#3a3a3a" strokeWidth="1.4" />
        </svg>
      );
    case "copy":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="3" width="9" height="11" fill="#ffffff" stroke="#3a3a3a" strokeWidth="1" />
          <rect x="7" y="6" width="9" height="11" fill="#ffffff" stroke="#3a3a3a" strokeWidth="1" />
          <line x1="9" y1="9" x2="14" y2="9" stroke="#1b50a8" strokeWidth="1" />
          <line x1="9" y1="11.5" x2="14" y2="11.5" stroke="#1b50a8" strokeWidth="1" />
          <line x1="9" y1="14" x2="13" y2="14" stroke="#1b50a8" strokeWidth="1" />
        </svg>
      );
    case "paste":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="4" width="12" height="14" fill="#caa46a" stroke="#6e5326" strokeWidth="1" />
          <rect x="6" y="3" width="6" height="3" fill="#c0c0c0" stroke="#5a5a5a" strokeWidth="0.8" />
          <rect x="8" y="8" width="9" height="10" fill="#ffffff" stroke="#3a3a3a" strokeWidth="1" />
          <line x1="10" y1="11" x2="15" y2="11" stroke="#1b50a8" strokeWidth="1" />
          <line x1="10" y1="13.5" x2="15" y2="13.5" stroke="#1b50a8" strokeWidth="1" />
        </svg>
      );
    case "undo":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M5 11 C5 6, 12 5, 15 8 C17 10, 16 13, 13 14"
            fill="none"
            stroke="#1b50a8"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path d="M3 8 L5 12 L8.5 9.5 Z" fill="#1b50a8" />
        </svg>
      );
    case "delete":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M5 4 L10 9 L15 4 L16 7 L11 10 L16 13 L15 16 L10 11 L5 16 L4 13 L9 10 L4 7 Z"
            fill="#d11a1a"
            stroke="#7a0d0d"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "properties":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="4" y="3" width="11" height="14" fill="#ffffff" stroke="#3a3a3a" strokeWidth="1" />
          <line x1="6" y1="6" x2="13" y2="6" stroke="#1b50a8" strokeWidth="1" />
          <line x1="6" y1="8.5" x2="13" y2="8.5" stroke="#1b50a8" strokeWidth="1" />
          <line x1="6" y1="11" x2="11" y2="11" stroke="#1b50a8" strokeWidth="1" />
          <path d="M11 13.5 L13 16 L18 10" fill="none" stroke="#2f8f3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "views":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="4" width="6" height="5" fill="#1b50a8" stroke="#0e2d63" strokeWidth="0.6" />
          <rect x="11" y="4" width="6" height="5" fill="#1b50a8" stroke="#0e2d63" strokeWidth="0.6" />
          <rect x="3" y="11" width="6" height="5" fill="#1b50a8" stroke="#0e2d63" strokeWidth="0.6" />
          <rect x="11" y="11" width="6" height="5" fill="#1b50a8" stroke="#0e2d63" strokeWidth="0.6" />
        </svg>
      );
    case "stop":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" fill="#d11a1a" stroke="#7a0d0d" strokeWidth="1" />
          <path d="M7 7 L13 13 M13 7 L7 13" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "refresh":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M5 10 a5 5 0 1 1 1.6 3.7" fill="none" stroke="#1b50a8" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M3.5 6 L5.5 10.5 L9.5 8 Z" fill="#1b50a8" />
        </svg>
      );
    case "home":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M10 3 L18 10 L15.5 10 L15.5 17 L4.5 17 L4.5 10 L2 10 Z" fill="#f7c14b" stroke="#8a6a16" strokeWidth="1" strokeLinejoin="round" />
          <rect x="8.5" y="12" width="3" height="5" fill="#7a4a12" />
          <rect x="11.5" y="3.5" width="2.2" height="3.5" fill="#b33b3b" />
        </svg>
      );
    case "search":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="9" cy="9" r="5" fill="#2f6fd1" stroke="#0e2d63" strokeWidth="1" />
          <circle cx="9" cy="9" r="2.6" fill="#bcd6ff" />
          <line x1="12.6" y1="12.6" x2="17" y2="17" stroke="#3a3a3a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "favorites":
      return (
        <svg {...common} aria-hidden="true">
          <path
            d="M10 3 L12.1 7.3 L16.8 8 L13.4 11.3 L14.2 16 L10 13.8 L5.8 16 L6.6 11.3 L3.2 8 L7.9 7.3 Z"
            fill="#f7c14b"
            stroke="#8a6a16"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "history":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" fill="#bcd6ff" stroke="#0e2d63" strokeWidth="1" />
          <path d="M10 5.5 L10 10 L13.5 12" fill="none" stroke="#0e2d63" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "print":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="3" y="8" width="14" height="6" fill="#9aa6b2" stroke="#3a3a3a" strokeWidth="1" />
          <rect x="5.5" y="3" width="9" height="5" fill="#ffffff" stroke="#3a3a3a" strokeWidth="1" />
          <rect x="5.5" y="12" width="9" height="5" fill="#ffffff" stroke="#3a3a3a" strokeWidth="1" />
          <circle cx="14.5" cy="10" r="0.9" fill="#2f8f3a" />
        </svg>
      );
    case "security":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M10 3 L16 5 L16 10 C16 14, 13 16.5, 10 17.5 C7 16.5, 4 14, 4 10 L4 5 Z" fill="#f7c14b" stroke="#8a6a16" strokeWidth="1" strokeLinejoin="round" />
          <path d="M7.5 10 L9.3 12 L12.8 7.8" fill="none" stroke="#2f8f3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

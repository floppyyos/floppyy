"use client";

type Props = { tool: string; size?: number };

/** Small, faithful-ish recreations of the MS Paint tool icons. */
export function PaintToolIcon({ tool, size = 16 }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    shapeRendering: "geometricPrecision" as const,
    style: { display: "block" as const },
  };

  switch (tool) {
    case "select":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="2.5" y="3" width="11" height="10" fill="none" stroke="#000" strokeWidth="1" strokeDasharray="2 1.4" />
        </svg>
      );
    case "eraser":
      return (
        <svg {...common} aria-hidden="true">
          <polygon points="2,11 7,6 11,8.5 6,13.5" fill="#e9e9e9" stroke="#3a3a3a" strokeWidth="0.8" strokeLinejoin="round" />
          <polygon points="7,6 9.5,3.5 13.5,6 11,8.5" fill="#6fb0dc" stroke="#2a5b78" strokeWidth="0.8" strokeLinejoin="round" />
        </svg>
      );
    case "picker":
      return (
        <svg {...common} aria-hidden="true">
          <line x1="2.6" y1="13.4" x2="9" y2="7" stroke="#1b50a8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="2.7" cy="13.3" r="1" fill="#1b50a8" />
          <rect x="9" y="3" width="4.2" height="2.6" rx="1" transform="rotate(45 11 4.3)" fill="#9aa6b2" stroke="#3a3a3a" strokeWidth="0.7" />
        </svg>
      );
    case "fill":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M3 8 L8 3 L13 8 L8 12.5 Z" fill="#c8c8c8" stroke="#3a3a3a" strokeWidth="0.8" strokeLinejoin="round" />
          <line x1="6" y1="5" x2="3.5" y2="7.5" stroke="#3a3a3a" strokeWidth="0.8" />
          <path d="M13 8 q2.2 2 0.6 3.6" fill="none" stroke="#1b50a8" strokeWidth="1" />
          <circle cx="13.4" cy="13" r="1.2" fill="#1b50a8" />
        </svg>
      );
    case "pencil":
      return (
        <svg {...common} aria-hidden="true">
          <line x1="4" y1="12" x2="11.5" y2="4.5" stroke="#f0c43c" strokeWidth="2.6" strokeLinecap="round" />
          <polygon points="2.2,13.8 5,12.6 3.4,11" fill="#3a3a3a" />
          <line x1="10.8" y1="3.8" x2="12.6" y2="5.6" stroke="#b33b3b" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      );
    case "brush":
      return (
        <svg {...common} aria-hidden="true">
          <line x1="4" y1="12.5" x2="9.5" y2="7" stroke="#a0651e" strokeWidth="1.8" strokeLinecap="round" />
          <polygon points="8.5,6 13,2.5 14,4 10.5,8" fill="#3a3a3a" stroke="#1a1a1a" strokeWidth="0.5" strokeLinejoin="round" />
        </svg>
      );
    case "spray":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="6.5" y="6" width="5" height="8" fill="#bcbcbc" stroke="#3a3a3a" strokeWidth="0.8" />
          <rect x="7.5" y="3.4" width="3" height="2.6" fill="#8a8a8a" stroke="#3a3a3a" strokeWidth="0.6" />
          <g fill="#1b50a8">
            <circle cx="3.5" cy="3" r="0.6" /><circle cx="5" cy="4.6" r="0.6" /><circle cx="3" cy="5.2" r="0.6" /><circle cx="5.4" cy="2.4" r="0.6" />
          </g>
        </svg>
      );
    case "text":
      return (
        <svg {...common} aria-hidden="true">
          <text x="8" y="13" textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="serif" fill="#000">A</text>
        </svg>
      );
    case "line":
      return (
        <svg {...common} aria-hidden="true">
          <line x1="3" y1="13" x2="13" y2="3" stroke="#000" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "rect":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="2.5" y="4" width="11" height="8" fill="none" stroke="#000" strokeWidth="1.4" />
        </svg>
      );
    case "filledRect":
      return (
        <svg {...common} aria-hidden="true">
          <rect x="2.5" y="4" width="11" height="8" fill="#000080" stroke="#000" strokeWidth="1.2" />
        </svg>
      );
    case "ellipse":
      return (
        <svg {...common} aria-hidden="true">
          <ellipse cx="8" cy="8" rx="6" ry="4.4" fill="none" stroke="#000" strokeWidth="1.4" />
        </svg>
      );
    case "filledEllipse":
      return (
        <svg {...common} aria-hidden="true">
          <ellipse cx="8" cy="8" rx="6" ry="4.4" fill="#000080" stroke="#000" strokeWidth="1.2" />
        </svg>
      );
    default:
      return null;
  }
}

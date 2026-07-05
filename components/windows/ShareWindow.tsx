"use client";

import { useState, type ReactNode } from "react";
import type { WindowComponentProps } from "@/lib/windows";

type ShareBadge = {
  bg: string;
  fg?: string;
};

function ShareIcon({ id, bg, fg = "#ffffff" }: { id: string; bg: string; fg?: string }) {
  const s = { width: 13, height: 13, viewBox: "0 0 24 24", style: { display: "block" as const } };
  let glyph: ReactNode = null;
  switch (id) {
    case "system":
      glyph = (
        <svg {...s}>
          <circle cx="6" cy="12" r="2.6" fill={fg} />
          <circle cx="17" cy="6" r="2.6" fill={fg} />
          <circle cx="17" cy="18" r="2.6" fill={fg} />
          <path d="M8.4 11 L14.6 7.2 M8.4 13 L14.6 16.8" stroke={fg} strokeWidth="1.6" />
        </svg>
      );
      break;
    case "twitter":
      glyph = (
        <svg {...s}>
          <path d="M4 4 L20 20 M20 4 L4 20" stroke={fg} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
      break;
    case "reddit":
      glyph = (
        <svg {...s}>
          <circle cx="12" cy="14" r="7" fill={fg} />
          <circle cx="9.3" cy="13.6" r="1.4" fill={bg} />
          <circle cx="14.7" cy="13.6" r="1.4" fill={bg} />
          <path d="M9 16.8 Q12 18.8 15 16.8" stroke={bg} strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M12 7.6 L14.6 4.6" stroke={fg} strokeWidth="1.3" />
          <circle cx="15" cy="4.2" r="1.6" fill={fg} />
        </svg>
      );
      break;
    case "telegram":
      glyph = (
        <svg {...s}>
          <path d="M22 3 L2 10.6 L8.4 13 L11 19.6 L13.9 15 L18 18 Z" fill={fg} />
        </svg>
      );
      break;
    case "whatsapp":
      glyph = (
        <svg {...s}>
          <path d="M8 6 C8.7 6 9.1 6.5 9.4 7.3 L10.1 9.1 C10.3 9.6 10.1 10.1 9.7 10.5 L8.9 11.2 C9.7 12.9 11.1 14.3 12.8 15.1 L13.5 14.3 C13.9 13.9 14.4 13.7 14.9 13.9 L16.7 14.6 C17.5 14.9 18 15.3 18 16 C18 18 16.5 19 14.5 18.7 C9.5 18 6 14.5 5.3 9.5 C5 7.5 6 6 8 6 Z" fill={fg} />
        </svg>
      );
      break;
    case "threads":
      glyph = (
        <svg {...s}>
          <text x="12" y="18" fontSize="18" fontWeight="700" textAnchor="middle" fill={fg} fontFamily="Arial, sans-serif">@</text>
        </svg>
      );
      break;
    case "discord":
      glyph = (
        <svg {...s}>
          <path d="M8 7 C10.5 6 13.5 6 16 7 C18 9.2 19 12.2 19 15.4 C17.6 16.6 16 17.2 16 17.2 L15.1 15.6 C13 16.6 11 16.6 8.9 15.6 L8 17.2 C8 17.2 6.4 16.6 5 15.4 C5 12.2 6 9.2 8 7 Z" fill={fg} />
          <circle cx="9.6" cy="12.6" r="1.3" fill={bg} />
          <circle cx="14.4" cy="12.6" r="1.3" fill={bg} />
        </svg>
      );
      break;
    case "linkedin":
      glyph = (
        <svg {...s}>
          <text x="12" y="17.5" fontSize="13" fontWeight="700" textAnchor="middle" fill={fg} fontFamily="Arial, sans-serif">in</text>
        </svg>
      );
      break;
    case "email":
      glyph = (
        <svg {...s} fill="none" stroke={fg} strokeWidth="2" strokeLinejoin="round">
          <rect x="3" y="6" width="18" height="13" rx="1" />
          <path d="M3.5 7 L12 13 L20.5 7" />
        </svg>
      );
      break;
    case "copy":
      glyph = (
        <svg {...s} fill="none" stroke={fg} strokeWidth="2" strokeLinejoin="round">
          <rect x="4" y="3" width="11" height="14" rx="1" fill="#ffffff" />
          <rect x="8" y="7" width="11" height="14" rx="1" fill={bg} />
        </svg>
      );
      break;
    case "install":
      glyph = (
        <svg {...s} fill="none" stroke={fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3 L12 14 M7 10 L12 15 L17 10 M4 19 L20 19" />
        </svg>
      );
      break;
  }
  return (
    <span
      aria-hidden="true"
      className="flex h-[18px] w-[18px] shrink-0 items-center justify-center"
      style={{
        background: bg,
        boxShadow: "inset -1px -1px rgba(0,0,0,0.45), inset 1px 1px rgba(255,255,255,0.55)",
      }}
    >
      {glyph}
    </span>
  );
}

export function ShareWindow({ window: win, closeWindow, notify, playSound }: WindowComponentProps) {
  const [copied, setCopied] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://www.floppyy.com";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      playSound("notification");
      notify("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      playSound("error");
      notify("Could not copy link.");
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Floppyy - The web you grew up on",
          text: "Check out Floppyy — a retro computer in your browser.",
          url: shareUrl,
        });
        playSound("notification");
      } catch {}
    } else {
      copyLink();
    }
  };

  const openShare = (url: string, target: "_blank" | "_self" = "_blank") => {
    window.open(url, target);
    playSound("click");
  };

  const shareText = "Check out Floppyy — the web you grew up on.";

  const options: { id: string; label: string; badge: ShareBadge; action: () => void }[] = [
    {
      id: "system",
      label: "Share... (system dialog)",
      badge: { bg: "#000080" },
      action: shareNative,
    },
    {
      id: "twitter",
      label: "Post on Twitter (X)",
      badge: { bg: "#000000" },
      action: () =>
        openShare(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        ),
    },
    {
      id: "telegram",
      label: "Send via Telegram",
      badge: { bg: "#229ed9" },
      action: () =>
        openShare(
          `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
        ),
    },
    {
      id: "whatsapp",
      label: "Share on WhatsApp",
      badge: { bg: "#25d366" },
      action: () => openShare(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`),
    },
    {
      id: "threads",
      label: "Post on Threads",
      badge: { bg: "#000000" },
      action: () =>
        openShare(`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText + " " + shareUrl)}`),
    },
    {
      id: "discord",
      label: "Share on Discord",
      badge: { bg: "#5865f2" },
      action: () => {
        window.open("https://discord.com/channels/@me", "_blank");
        copyLink();
      },
    },
    {
      id: "linkedin",
      label: "Share on LinkedIn",
      badge: { bg: "#0a66c2" },
      action: () =>
        openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`),
    },
    {
      id: "email",
      label: "Send via Email",
      badge: { bg: "#d8d8d8", fg: "#000080" },
      action: () =>
        openShare(
          `mailto:?subject=${encodeURIComponent("Check out Floppyy!")}&body=${encodeURIComponent("Hey! Check out this retro computer in your browser:\n\n" + shareUrl)}`,
          "_self",
        ),
    },
    {
      id: "copy",
      label: "Copy link",
      badge: { bg: "#ffffcc", fg: "#000000" },
      action: copyLink,
    },
  ];

  return (
    <div className="flex h-full flex-col bg-[#c0c0c0] p-[10px] text-[11px]">
      <div className="mb-[10px] flex items-center gap-[10px]">
        <img
          src="/icons/garfield.png"
          alt=""
          width={36}
          height={36}
          style={{ imageRendering: "pixelated" }}
          draggable={false}
        />
        <div className="leading-tight">
          <div className="text-[13px] font-bold">Send to a Friend</div>
          <div className="text-[#404040]">Share the web you grew up on.</div>
        </div>
      </div>

      <fieldset className="mb-[10px] border border-[#808080] px-[10px] pb-[10px] pt-[4px]">
        <legend className="px-[4px]">Link to share</legend>
        <div className="flex items-center gap-[6px]">
          <input
            readOnly
            className="field-border h-[21px] flex-1 bg-white px-[6px] font-mono text-[11px] text-black"
            value={shareUrl}
            onClick={(event) => (event.target as HTMLInputElement).select()}
          />
          <button onClick={copyLink} className="win-button min-w-[72px]">
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </fieldset>

      <fieldset className="flex min-h-0 flex-1 flex-col border border-[#808080] px-[10px] pb-[10px] pt-[4px]">
        <legend className="px-[4px]">Send using</legend>
        <div
          className="min-h-0 flex-1 overflow-y-auto bg-white p-[3px]"
          style={{
            boxShadow:
              "inset 1px 1px #0a0a0a, inset -1px -1px #dfdfdf, inset 2px 2px #808080, inset -2px -2px #ffffff",
          }}
        >
          {options.map((option) => {
            const isSelected = selected === option.id;
            return (
              <button
                key={option.id}
                onClick={() => {
                  setSelected(option.id);
                  playSound("click");
                }}
                onDoubleClick={option.action}
                style={{
                  background: isSelected ? "#000080" : "transparent",
                  color: isSelected ? "#ffffff" : "#000000",
                }}
                className={`mb-[3px] flex w-full items-center gap-[8px] px-[6px] py-[5px] text-left text-[12px] last:mb-0 ${
                  isSelected ? "outline outline-1 outline-dotted outline-[#c0c0c0] -outline-offset-2" : ""
                }`}
              >
                <ShareIcon id={option.id} bg={option.badge.bg} fg={option.badge.fg} />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-[4px] text-[10px] text-[#404040]">
        Tip: click to select, double-click to share.
      </div>

      <fieldset className="mt-[10px] border border-[#808080] px-[10px] pb-[8px] pt-[4px]">
        <legend className="px-[4px]">Install</legend>
        <div className="flex items-start gap-[8px]">
          <ShareIcon id="install" bg="#008080" />
          <div className="leading-[14px]">
            <div>Add Floppyy to your home screen for offline access.</div>
            <div className="text-[#404040]">
              Use your browser&apos;s &quot;Add to Home Screen&quot; or &quot;Install App&quot; option.
            </div>
          </div>
        </div>
      </fieldset>

      <div className="mt-[10px] flex justify-end gap-[6px]">
        <button onClick={() => closeWindow(win.instanceId)} className="win-button min-w-[75px]">
          Close
        </button>
      </div>
    </div>
  );
}

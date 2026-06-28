"use client";

import { useState } from "react";
import type { WindowComponentProps } from "@/lib/windows";

type ShareBadge = {
  bg: string;
  fg?: string;
  glyph: string;
  bold?: boolean;
};

function ShareGlyph({ bg, fg = "#ffffff", glyph, bold = true }: ShareBadge) {
  return (
    <span
      aria-hidden="true"
      className="flex h-[18px] w-[18px] shrink-0 items-center justify-center text-[10px] leading-none"
      style={{
        background: bg,
        color: fg,
        fontWeight: bold ? 700 : 400,
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
      } catch {
        // User cancelled
      }
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
      badge: { bg: "#000080", glyph: "↗" },
      action: shareNative,
    },
    {
      id: "twitter",
      label: "Post on Twitter (X)",
      badge: { bg: "#000000", glyph: "X" },
      action: () =>
        openShare(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        ),
    },
    {
      id: "reddit",
      label: "Share on Reddit",
      badge: { bg: "#ff4500", glyph: "R" },
      action: () =>
        openShare(
          `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent("Floppyy — The web you grew up on")}`,
        ),
    },
    {
      id: "telegram",
      label: "Send via Telegram",
      badge: { bg: "#229ed9", glyph: "T" },
      action: () =>
        openShare(
          `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
        ),
    },
    {
      id: "whatsapp",
      label: "Share on WhatsApp",
      badge: { bg: "#25d366", glyph: "✆" },
      action: () => openShare(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`),
    },
    {
      id: "threads",
      label: "Post on Threads",
      badge: { bg: "#000000", glyph: "@" },
      action: () =>
        openShare(`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText + " " + shareUrl)}`),
    },
    {
      id: "discord",
      label: "Share on Discord",
      badge: { bg: "#5865f2", glyph: "D" },
      action: () => {
        window.open("https://discord.com/channels/@me", "_blank");
        copyLink();
      },
    },
    {
      id: "linkedin",
      label: "Share on LinkedIn",
      badge: { bg: "#0a66c2", glyph: "in", bold: true },
      action: () =>
        openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`),
    },
    {
      id: "email",
      label: "Send via Email",
      badge: { bg: "#d8d8d8", fg: "#000080", glyph: "✉" },
      action: () =>
        openShare(
          `mailto:?subject=${encodeURIComponent("Check out Floppyy!")}&body=${encodeURIComponent("Hey! Check out this retro computer in your browser:\n\n" + shareUrl)}`,
          "_self",
        ),
    },
    {
      id: "copy",
      label: "Copy link",
      badge: { bg: "#ffffcc", fg: "#000000", glyph: "▤" },
      action: copyLink,
    },
  ];

  return (
    <div className="flex h-full flex-col bg-[#c0c0c0] p-[10px] text-[11px]">
      {/* Header */}
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

      {/* URL field */}
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

      {/* Share options */}
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
                <ShareGlyph {...option.badge} />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-[4px] text-[10px] text-[#404040]">
        Tip: click to select, double-click to share.
      </div>

      {/* Install PWA */}
      <fieldset className="mt-[10px] border border-[#808080] px-[10px] pb-[8px] pt-[4px]">
        <legend className="px-[4px]">Install</legend>
        <div className="flex items-start gap-[8px]">
          <ShareGlyph bg="#008080" glyph="⤓" />
          <div className="leading-[14px]">
            <div>Add Floppyy to your home screen for offline access.</div>
            <div className="text-[#404040]">
              Use your browser&apos;s &quot;Add to Home Screen&quot; or &quot;Install App&quot; option.
            </div>
          </div>
        </div>
      </fieldset>

      {/* Buttons */}
      <div className="mt-[10px] flex justify-end gap-[6px]">
        <button onClick={() => closeWindow(win.instanceId)} className="win-button min-w-[75px]">
          Close
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

const SHARE_URL = "https://www.floppyy.com";
const SHARE_TEXT = "Check out Floppyy — the web you grew up on.";

const shareLinks = [
  {
    label: "Twitter",
    icon: "𝕏",
    href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`,
  },
  {
    label: "Reddit",
    icon: "🟠",
    href: `https://www.reddit.com/submit?url=${encodeURIComponent(SHARE_URL)}&title=${encodeURIComponent("Floppyy — The web you grew up on")}`,
  },
  {
    label: "Telegram",
    icon: "✈️",
    href: `https://t.me/share/url?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`,
  },
    {
    label: "WhatsApp",
    icon: "💚",
    href: `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + " " + SHARE_URL)}`,
  },
  {
    label: "Threads",
    icon: "🧵",
    href: `https://www.threads.net/intent/post?text=${encodeURIComponent(SHARE_TEXT + " " + SHARE_URL)}`,
  },
  {
    label: "Discord",
    icon: "💬",
    href: `https://discord.com/channels/@me`,
    copyOnClick: true,
  },
  {
    label: "LinkedIn",
    icon: "💼",
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`,
  },
  {
    label: "Email",
    icon: "📧",
    href: `mailto:?subject=${encodeURIComponent("Check out Floppyy!")}&body=${encodeURIComponent("Hey! Check out this retro computer in your browser:\n\n" + SHARE_URL)}`,
  },
];

export function ShutDownOverlay({ safe, onRestart, onShutdown, onCancel }: { safe: boolean; onRestart: () => void; onShutdown: () => void; onCancel: () => void }) {
  const [selected, setSelected] = useState<"shutdown" | "restart">("shutdown");

  if (safe) {
    return (
      <div className="fixed inset-0 z-[8000] flex flex-col items-center justify-center">

        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/wallpapers/clouds.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.2)",
          }}
        />

        <div className="relative mb-12 flex flex-col items-center text-center">
          <img
            src="/floppyy-dark.png"
            alt="Floppyy"
            className="mb-7 h-auto w-[280px] max-w-[70vw]"
            draggable={false}
          />
          <div
            className="text-[32px] text-[#ffb000] leading-relaxed"
            style={{
              fontFamily: "var(--font-shutdown)",
              textShadow: "0 0 10px rgba(255, 176, 0, 0.4)",
            }}
          >
            It&apos;s now safe to turn off<br/>your computer.
          </div>
        </div>

        <div className="relative text-center">
          <p
            className="text-[13px] text-[#a0a0a0] mb-4"
            style={{ fontFamily: "var(--font-shutdown)" }}
          >
            Enjoyed Floppyy? Share it with friends:
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {shareLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.label === "Email" ? "_self" : "_blank"}
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a2e]/80 border border-[#444] rounded hover:bg-[#2a2a4e] hover:border-[#ffb000] transition-colors text-[12px] text-[#d0d0d0] hover:text-[#ffb000]"
                style={{ fontFamily: "var(--font-shutdown)" }}
                onClick={() => {
                  if (link.label === "Discord" || link.copyOnClick) {
                    navigator.clipboard.writeText(SHARE_URL).catch(() => {});
                  }
                }}
              >
                <span className="text-[14px]">{link.icon}</span>
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[7000] flex items-center justify-center">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/wallpapers/clouds.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.3)",
        }}
      />

      <div
        className="relative w-[340px] bg-[#c0c0c0] p-[3px]"
        style={{
          boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf"
        }}
      >
        <div className="flex h-[18px] items-center bg-gradient-to-r from-[#000080] to-[#1084d0] px-[4px]">
          <span className="text-[11px] font-bold text-white">Shut Down Windows</span>
        </div>

        <div className="p-[12px]">
          <div className="flex gap-[12px] mb-[16px]">
            <div className="flex-shrink-0">
              <img src="/icons/shutdown.png" alt="" width={32} height={32} style={{ imageRendering: "pixelated" }} draggable={false} />
            </div>
            <div className="text-[11px]">
              <p className="mb-[8px]">What do you want the computer to do?</p>
              <div className="flex flex-col gap-[4px]">
                <label className="flex items-center gap-[4px] cursor-pointer">
                  <input
                    type="radio"
                    name="shutdown"
                    checked={selected === "shutdown"}
                    onChange={() => setSelected("shutdown")}
                    className="accent-[#000080]"
                  />
                  <span>Shut down</span>
                </label>
                <label className="flex items-center gap-[4px] cursor-pointer">
                  <input
                    type="radio"
                    name="shutdown"
                    checked={selected === "restart"}
                    onChange={() => setSelected("restart")}
                    className="accent-[#000080]"
                  />
                  <span>Restart</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-[6px]">
            <button
              className="win-button min-w-[70px]"
              onClick={() => {
                if (selected === "restart") {
                  onRestart();
                } else {
                  onShutdown();
                }
              }}
            >
              OK
            </button>
            <button className="win-button min-w-[70px]" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

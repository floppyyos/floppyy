"use client";

import { useState } from "react";
import type { WindowComponentProps } from "@/lib/windows";

export function ShareWindow({ window: win, closeWindow, notify, playSound }: WindowComponentProps) {
  const [copied, setCopied] = useState(false);
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

  const shareTwitter = () => {
    const text = encodeURIComponent("Check out Floppyy — the web you grew up on.");
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    playSound("click");
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] p-3 text-[11px]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <img src="/icons/garfield.png" alt="" width={40} height={40} style={{ imageRendering: "pixelated" }} draggable={false} />
        <div>
          <div className="font-bold text-[13px]">Send to a Friend</div>
          <div className="text-[#808080]">Share the web you grew up on.</div>
        </div>
      </div>

      {/* URL field */}
      <fieldset className="border border-[#808080] px-3 py-2 mb-3">
        <legend className="text-[11px] px-1">Link to share:</legend>
        <div className="flex items-center gap-2">
          <input
            readOnly
            className="flex-1 h-[20px] border border-[#808080] bg-white px-2 text-[11px] font-mono"
            value={shareUrl}
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button
            onClick={copyLink}
            className="h-[20px] px-3 border border-[#808080] bg-[#c0c0c0] text-[10px] active:translate-x-px active:translate-y-px"
            style={{ borderColor: "#dfdfdf #808080 #808080 #dfdfdf" }}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </fieldset>

      {/* Share options */}
      <fieldset className="border border-[#808080] px-3 py-2 mb-3">
        <legend className="text-[11px] px-1">Send using:</legend>
        <div className="flex flex-col gap-0">
          <button
            onClick={shareNative}
            className="flex items-center gap-3 w-full text-left px-2 py-[6px] hover:bg-[#000080] hover:text-white text-[12px]"
          >
            <span className="text-[16px]">📤</span>
            <span>Share... (system dialog)</span>
          </button>
          <button
            onClick={shareTwitter}
            className="flex items-center gap-3 w-full text-left px-2 py-[6px] hover:bg-[#000080] hover:text-white text-[12px]"
          >
            <span className="text-[16px]">🐦</span>
            <span>Post on Twiiter (X)</span>
          </button>
          <button
            onClick={() => { window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent("Floppyy — The web you grew up on")}`, "_blank"); playSound("click"); }}
            className="flex items-center gap-3 w-full text-left px-2 py-[6px] hover:bg-[#000080] hover:text-white text-[12px]"
          >
            <span className="text-[16px]">🟠</span>
            <span>Share on Reddit</span>
          </button>
          <button
            onClick={() => { window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("Check out Floppyy — a retro computer in your browser.")}`, "_blank"); playSound("click"); }}
            className="flex items-center gap-3 w-full text-left px-2 py-[6px] hover:bg-[#000080] hover:text-white text-[12px]"
          >
            <span className="text-[16px]">✈️</span>
            <span>Send via Telegram</span>
          </button>
          <button
            onClick={() => { window.open(`https://wa.me/?text=${encodeURIComponent("Check out Floppyy — the web you grew up on. " + shareUrl)}`, "_blank"); playSound("click"); }}
            className="flex items-center gap-3 w-full text-left px-2 py-[6px] hover:bg-[#000080] hover:text-white text-[12px]"
          >
            <span className="text-[16px]">💚</span>
            <span>Share on WhatsApp</span>
          </button>
          <button
            onClick={() => { window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent("Check out Floppyy — the web you grew up on. " + shareUrl)}`, "_blank"); playSound("click"); }}
            className="flex items-center gap-3 w-full text-left px-2 py-[6px] hover:bg-[#000080] hover:text-white text-[12px]"
          >
            <span className="text-[16px]">🧵</span>
            <span>Post on Threads</span>
          </button>
          <button
            onClick={() => { window.open(`https://discord.com/channels/@me`, "_blank"); copyLink(); }}
            className="flex items-center gap-3 w-full text-left px-2 py-[6px] hover:bg-[#000080] hover:text-white text-[12px]"
          >
            <span className="text-[16px]">💬</span>
            <span>Share on Discord</span>
          </button>
          <button
            onClick={() => { window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank"); playSound("click"); }}
            className="flex items-center gap-3 w-full text-left px-2 py-[6px] hover:bg-[#000080] hover:text-white text-[12px]"
          >
            <span className="text-[16px]">💼</span>
            <span>Share on LinkedIn</span>
          </button>
          <button
            onClick={() => { window.open(`mailto:?subject=${encodeURIComponent("Check out Floppyy!")}&body=${encodeURIComponent("Hey! Check out this retro computer in your browser:\n\n" + shareUrl)}`, "_self"); playSound("click"); }}
            className="flex items-center gap-3 w-full text-left px-2 py-[6px] hover:bg-[#000080] hover:text-white text-[12px]"
          >
            <span className="text-[16px]">📧</span>
            <span>Send via Email</span>
          </button>
          <button
            onClick={copyLink}
            className="flex items-center gap-3 w-full text-left px-2 py-[6px] hover:bg-[#000080] hover:text-white text-[12px]"
          >
            <span className="text-[16px]">📋</span>
            <span>Copy link</span>
          </button>
        </div>
      </fieldset>

      {/* Install PWA */}
      <fieldset className="border border-[#808080] px-3 py-2 mb-3">
        <legend className="text-[11px] px-1">Install:</legend>
        <div className="text-[11px] text-[#808080] mb-1">
          Add Floppyy to your home screen for offline access.
        </div>
        <div className="text-[10px] text-[#808080]">
          Use your browser&apos;s &quot;Add to Home Screen&quot; or &quot;Install App&quot; option.
        </div>
      </fieldset>

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-auto pt-2">
        <button
          onClick={() => closeWindow(win.instanceId)}
          className="win-button px-4 py-1 text-[11px] min-w-[70px]"
        >
          Close
        </button>
      </div>
    </div>
  );
}

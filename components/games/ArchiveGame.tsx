"use client";

import { useState } from "react";

type Props = {
  /** archive.org item identifier, e.g. "msdos_Shadow_Warrior_1997" */
  identifier: string;
  title: string;
  /** Short note shown on the start screen */
  blurb?: string;
};

/**
 * Embeds an MS-DOS game from the Internet Archive's in-browser emulator.
 * The emulator only boots after the user clicks "Start" so we don't load a
 * heavy iframe (and grab keyboard focus) until the player asks for it.
 */
export function ArchiveGame({ identifier, title, blurb }: Props) {
  const [started, setStarted] = useState(false);
  const src = `https://archive.org/embed/${identifier}?autostart=1`;

  if (!started) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-black p-6 text-center font-mono text-white">
        <h2 className="mb-2 text-[22px] font-bold tracking-wide text-[#ffcf3b]">{title}</h2>
        {blurb && <p className="mb-5 max-w-[320px] text-[11px] leading-[1.6] text-gray-300">{blurb}</p>}
        <button
          onClick={() => setStarted(true)}
          className="border-2 border-[#888] bg-[#222] px-8 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#3a3a3a]"
        >
          START
        </button>
        <p className="mt-6 max-w-[320px] text-[10px] leading-[1.6] text-gray-500">
          Runs in-browser via the Internet Archive MS-DOS emulator. Click the screen to capture the
          keyboard. First load may take a moment.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-black">
      <iframe
        title={title}
        src={src}
        className="h-full w-full border-0"
        allow="autoplay; fullscreen; gamepad"
        allowFullScreen
      />
    </div>
  );
}

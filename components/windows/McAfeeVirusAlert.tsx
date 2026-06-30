"use client";

import { useEffect, useState } from "react";

/**
 * Easter egg: a few minutes into the session McAfee "finds a virus" and panics
 * the user — then reveals it was just kidding. Shown at most once per browser.
 */
export function McAfeeVirusAlert({
  onClose,
  playSound,
}: {
  onClose: () => void;
  playSound: (sound: string) => void;
}) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    playSound("error");
  }, [playSound]);

  return (
    <div className="fixed inset-0 z-[7600] flex items-center justify-center" onPointerDown={onClose}>
      <div
        className="w-[360px] select-none bg-[#c0c0c0]"
        style={{
          boxShadow:
            "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
          padding: 3,
        }}
        onPointerDown={(event) => event.stopPropagation()}
        role="alertdialog"
        aria-label="McAfee VirusScan"
      >
        <div className="flex h-[18px] items-center justify-between bg-gradient-to-r from-[#000080] to-[#1084d0] pl-[4px] pr-[2px]">
          <span className="text-[11px] font-bold text-white">McAfee VirusScan</span>
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

        <div className="flex items-start gap-[14px] px-[16px] py-[18px]">
          <img
            src="/icons/McAfee.png"
            alt=""
            width={36}
            height={36}
            draggable={false}
            style={{ imageRendering: "pixelated" }}
            className="shrink-0"
          />
          {revealed ? (
            <p className="text-[11px] leading-[16px] text-black">
              Just kidding. <span className="font-bold">Floppyy is squeaky clean.</span>
              <br />
              Relax and enjoy the nostalgia.
            </p>
          ) : (
            <div className="text-[11px] leading-[16px] text-black">
              <p className="mb-2 font-bold text-[#c00000]">Virus detected!</p>
              <p>
                <span className="font-bold">W32/Floppyy@MM</span> was found in
                <br />
                C:\WINDOWS\SYSTEM\NOSTALGIA.DLL
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-[8px] pb-[14px]">
          {revealed ? (
            <button className="win-button min-w-[80px] text-[11px]" onClick={onClose} autoFocus>
              OK
            </button>
          ) : (
            <>
              <button
                className="win-button min-w-[84px] text-[11px]"
                onClick={() => {
                  playSound("notification");
                  setRevealed(true);
                }}
                autoFocus
              >
                Clean
              </button>
              <button
                className="win-button min-w-[84px] text-[11px]"
                onClick={() => {
                  playSound("notification");
                  setRevealed(true);
                }}
              >
                Ignore
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

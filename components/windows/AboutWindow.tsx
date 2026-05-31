"use client";

import { useState } from "react";
import type { WindowComponentProps } from "@/lib/windows";

type AboutPanel = "welcome" | "nostalgia" | "credits" | "connect";

const panels: Array<{ id: AboutPanel; label: string }> = [
  { id: "welcome", label: "Welcome" },
  { id: "nostalgia", label: "Discover Floppyy" },
  { id: "credits", label: "Credits" },
  { id: "connect", label: "Connect" },
];

export function AboutWindow({ window, closeWindow, notify, playSound }: WindowComponentProps) {
  const [activePanel, setActivePanel] = useState<AboutPanel>(
    window.payload === "credits" ? "credits" : "welcome",
  );
  const [showOnBoot, setShowOnBoot] = useState(true);

  const setPanel = (panel: AboutPanel) => {
    setActivePanel(panel);
    playSound("click");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#f3f7fb] text-[12px]">
      <div
        className="relative h-[100px] shrink-0 overflow-hidden border-b border-[#d7d7d7]"
        style={{
          backgroundImage: "url('/clouds.jpg')",
          backgroundPosition: "center 36%",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-white/25" />
        <div className="absolute bottom-[18px] left-[34px] flex items-end gap-2">
          <img
            src="/icons/win.png"
            alt=""
            width={30}
            height={26}
            draggable={false}
            style={{ imageRendering: "pixelated" }}
          />
          <div className="leading-none">
            <div className="text-[13px]">Floppyy</div>
            <div className="text-[26px] font-bold tracking-normal">Welcome</div>
          </div>
        </div>
        <div className="absolute bottom-[17px] left-0 right-0 h-[1px] bg-gradient-to-r from-[#ff3030] via-[#33c955] to-[#2f67ff]" />
      </div>

      <div className="flex min-h-0 flex-1 bg-white/85">
        <aside className="w-[190px] shrink-0 px-[14px] py-[14px]">
          <div className="mb-[6px] bg-black px-[10px] py-[2px] text-[11px] font-bold tracking-[0.32em] text-white">
            CONTENTS
          </div>
          <div className="border-r border-[#d0d0d0]">
            {panels.map((panel, index) => (
              <button
                key={panel.id}
                className={[
                  "relative flex h-[26px] w-full items-center border-b border-[#d7d7d7] bg-transparent px-[10px] text-left font-bold",
                  activePanel === panel.id ? "text-black" : "text-[#333333]",
                ].join(" ")}
                onClick={() => setPanel(panel.id)}
              >
                {activePanel === panel.id && (
                  <span
                    className="absolute bottom-[3px] left-0 top-[3px] w-[4px]"
                    style={{ background: index % 2 === 0 ? "#00a2ff" : "#ff2d1a" }}
                  />
                )}
                <span className="truncate">{panel.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="relative min-w-0 flex-1 px-[16px] py-[18px]">
          <div
            className="pointer-events-none absolute bottom-[14px] right-[18px] h-[150px] w-[190px] opacity-20"
            style={{
              backgroundImage: "url('/icons/win.png')",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              imageRendering: "pixelated",
            }}
          />
          <PanelContent activePanel={activePanel} notify={notify} />
        </main>
      </div>

      <div className="flex h-[36px] shrink-0 items-center justify-between border-t border-[#d7d7d7] bg-[#f8fbff] px-[12px]">
        <label className="flex items-center gap-[5px]">
          <input
            type="checkbox"
            checked={showOnBoot}
            onChange={(event) => {
              setShowOnBoot(event.target.checked);
              playSound("click");
            }}
          />
          <span>Show this screen each time Floppyy starts.</span>
        </label>
        <button className="win-button min-w-[74px]" onClick={() => closeWindow(window.instanceId)}>
          Close
        </button>
      </div>
    </div>
  );
}

function PanelContent({ activePanel, notify }: { activePanel: AboutPanel; notify: (message: string) => void }) {
  if (activePanel === "nostalgia") {
    return (
      <section className="relative max-w-[300px] space-y-[12px]">
        <h2 className="text-[20px] font-bold">Discover Floppyy</h2>
        <p>Boot up, click around, remember everything — minus the dial-up wait. Mostly.</p>
        <p>Pixel windows, floppy disks, BIOS boot screens, Winamp vibes, classic games, and the early web are rebuilt here as a playful browser desktop.</p>
        <p>Not an emulator. Not a productivity tool. Just a small machine for good old internet memories.</p>
      </section>
    );
  }

  if (activePanel === "credits") {
    return (
      <section className="relative max-w-[315px] space-y-[10px]">
        <h2 className="text-[20px] font-bold">Credits</h2>
        <p><strong>Floppyy</strong> is made for everyone who still remembers the magic of opening a folder just to see what was inside.</p>
        <div className="grid grid-cols-[92px_1fr] gap-y-[5px]">
          <span className="font-bold">Design</span><span>Windows 98 clouds, blue floppy, pixel UI</span>
          <span className="font-bold">Build</span><span>Next.js, TypeScript, canvas, web audio</span>
          <span className="font-bold">Mood</span><span>Early web, old desktops, tiny surprises</span>
        </div>
        <button className="win-button mt-[4px] min-w-[100px]" onClick={() => notify("CREDITS.txt checked. The nostalgia is intact.")}>
          Read Credits
        </button>
      </section>
    );
  }

  if (activePanel === "connect") {
    return (
      <section className="relative max-w-[300px] space-y-[12px]">
        <h2 className="text-[20px] font-bold">Connect</h2>
        <p>Floppyy lives at <a className="text-[#0000ff] underline" href="https://www.floppyy.com" target="_blank" rel="noopener noreferrer">www.floppyy.com</a>.</p>
        <p>The current GitHub home is <a className="text-[#0000ff] underline" href="https://github.com/floppyyos" target="_blank" rel="noopener noreferrer">github.com/floppyyos</a>.</p>
        <p>Say hello at <span className="font-mono">hi@floppyy.com</span>.</p>
      </section>
    );
  }

  return (
    <section className="relative max-w-[300px] space-y-[12px]">
      <img
        src="/floppyy.png"
        alt="Floppyy"
        className="mb-[2px] h-auto w-[178px]"
        draggable={false}
      />
      <h2 className="text-[20px] font-bold">Welcome</h2>
      <p>Welcome to the web you grew up on, where your browser desktop meets the Internet memories you almost forgot.</p>
      <p>Sit back and take a brief tour of a tiny retro machine made from clouds, clicks, windows, games, and floppy-disk feelings.</p>
      <p>If you want to explore an option, just click it.</p>
    </section>
  );
}

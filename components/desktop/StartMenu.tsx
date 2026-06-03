"use client";

import type { WindowId } from "@/lib/windows";
import { FloppyyIcon } from "./FloppyyIcon";

type Props = {
  onOpen: (id: WindowId, payload?: string) => void;
  onScreensaver: () => void;
  onShutdown: () => void;
};

export function StartMenu({ onOpen, onScreensaver, onShutdown }: Props) {
  const programs: Array<[WindowId, string, string]> = [
    ["about", "About", "credits"],
    ["projects", "Projects", "folder"],
    ["internet", "Dial-Up Networking", "dialup"],
    ["music", "Winamp", "winamp"],
    ["norton", "Norton Commander", "console"],
    ["paint", "Paint", "paint"],
    ["defrag", "Disk Defragmenter", "defrag"],
  ];

  const games: Array<[WindowId, string, string, string?]> = [
    ["minesweeper", "Minesweeper", "mine"],
    ["games", "Solitaire", "cards", "solitaire"],
    ["games", "Snake", "scheduled", "snake"],
    ["doom", "Doom", "doom"],
  ];

  return (
    <div
      className="fixed bottom-[28px] left-0 z-[4500] flex w-[220px] bg-[#c0c0c0]"
      style={{
        boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf"
      }}
      onClick={(event) => event.stopPropagation()}
    >
      {/* Side banner */}
      <div className="flex w-[26px] items-end justify-center bg-[#000080]" style={{ paddingBottom: "24px" }}>
        <div className="-rotate-90 whitespace-nowrap text-[12px] font-bold tracking-wider">
          <span className="text-[#b0b0b0]">floppy</span><span className="text-white">y</span>
        </div>
      </div>

      {/* Menu items */}
      <div className="flex-1 py-[3px]">
        {/* Programs */}
        <div className="px-[4px] py-[1px] text-[11px] font-bold text-[#808080]">Programs</div>
        <div className="mx-[3px] my-[2px] h-[1px] bg-[#808080] shadow-[0_1px_0_#fff]" />
        
        {programs.slice(0, 2).map(([id, label, icon]) => (
          <button
            key={id}
            className="menu-command flex items-center gap-[8px] py-[3px]"
            onClick={() => onOpen(id)}
          >
            <FloppyyIcon type={icon} size={16} />
            <span>{label}</span>
          </button>
        ))}

        <div className="group/games relative">
          <button
            className="menu-command flex items-center gap-[8px] py-[3px]"
            onClick={() => onOpen("games")}
          >
            <FloppyyIcon type="directory_open" size={16} />
            <span>Games</span>
            <span className="ml-auto pr-[2px]">▶</span>
          </button>
          <div
            className="absolute left-full top-0 hidden w-[180px] bg-[#c0c0c0] py-[3px] group-hover/games:block"
            style={{
              boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
            }}
          >
            {games.map(([id, label, icon, payload]) => (
              <button
                key={`${id}-${label}`}
                className="menu-command flex items-center gap-[8px] py-[3px]"
                onClick={() => onOpen(id, payload)}
              >
                <FloppyyIcon type={icon} size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {programs.slice(2).map(([id, label, icon]) => (
          <button
            key={id}
            className="menu-command flex items-center gap-[8px] py-[3px]"
            onClick={() => onOpen(id)}
          >
            <FloppyyIcon type={icon} size={16} />
            <span>{label}</span>
          </button>
        ))}

        <div className="mx-[3px] my-[2px] h-[1px] bg-[#808080] shadow-[0_1px_0_#fff]" />

        {/* Settings & utilities */}
        <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => onOpen("settings")}>
          <FloppyyIcon type="folder" size={16} />
          <span>Themes</span>
        </button>
        <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => onOpen("settings")}>
          <FloppyyIcon type="gears" size={16} />
          <span>Settings</span>
        </button>
        <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={onScreensaver}>
          <FloppyyIcon type="monitor_windows" size={16} />
          <span>Screensaver</span>
        </button>
        <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => onOpen("run")}>
          <FloppyyIcon type="run" size={16} />
          <span>Run...</span>
        </button>

        <div className="mx-[3px] my-[2px] h-[1px] bg-[#808080] shadow-[0_1px_0_#fff]" />

        {/* Shut Down */}
        <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={onShutdown}>
          <img src="/icons/shutdown.png" alt="" width={16} height={16} style={{ imageRendering: "pixelated" }} draggable={false} />
          <span>Shut Down...</span>
        </button>
      </div>
    </div>
  );
}

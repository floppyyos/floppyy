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
    ["internet", "Dial-Up Networking", "dialup"],
    ["music", "Winamp", "winamp"],
    ["paint", "Paint", "paint"],
    ["netscape", "Netscape Navigator", "netscape"],
    ["msdos", "MS-DOS Prompt", "prompt"],
    ["outlook", "Outlook Express", "msoutlook"],
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
      <div
        className="relative flex w-[26px] items-end justify-center bg-[#000080]"
        style={{ paddingBottom: "24px" }}
        title="Double click"
        onDoubleClick={() => onOpen("about", "welcome")}
      >
        <div className="-rotate-90 whitespace-nowrap text-[12px] font-bold tracking-wider">
          <span className="text-[#b0b0b0]">floppy</span><span className="text-white">y</span>
        </div>
      </div>

      {/* Menu items */}
      <div className="flex-1 py-[3px]">
        <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => onOpen("about", "welcome")}>
          <FloppyyIcon type="credits" size={16} />
          <span>About</span>
        </button>
        <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => onOpen("projects")}>
          <FloppyyIcon type="folder" size={16} />
          <span>Projects</span>
        </button>
        <div className="mx-[3px] my-[2px] h-[1px] bg-[#808080] shadow-[0_1px_0_#fff]" />

        <div className="group/programs relative">
          <button
            className="menu-command flex items-center gap-[8px] py-[3px]"
            onClick={(event) => event.preventDefault()}
          >
            <FloppyyIcon type="directory_open" size={16} />
            <span>Programs</span>
            <span className="ml-auto w-[10px] text-center text-[7px] leading-none">▶</span>
          </button>
          <div
            className="absolute left-full top-0 hidden w-[210px] bg-[#c0c0c0] py-[3px] group-hover/programs:block"
            style={{
              boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
            }}
          >
            {programs.map(([id, label, icon]) => (
              <button
                key={`${id}-${label}`}
                className="menu-command flex items-center gap-[8px] py-[3px]"
                onClick={() => onOpen(id)}
              >
                <FloppyyIcon type={icon} size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="group/games relative">
          <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => onOpen("games")}>
            <FloppyyIcon type="directory_open" size={16} />
            <span>Games</span>
            <span className="ml-auto w-[10px] text-center text-[7px] leading-none">▶</span>
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

        <div className="mx-[3px] my-[2px] h-[1px] bg-[#808080] shadow-[0_1px_0_#fff]" />

        <div className="group/settings relative">
          <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => onOpen("control-panel")}>
            <FloppyyIcon type="gears" size={16} />
            <span>Settings</span>
            <span className="ml-auto w-[10px] text-center text-[7px] leading-none">▶</span>
          </button>
          <div
            className="absolute left-full top-0 hidden w-[190px] bg-[#c0c0c0] py-[3px] group-hover/settings:block"
            style={{
              boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
            }}
          >
            <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => onOpen("control-panel")}>
              <FloppyyIcon type="control-panel" size={16} />
              <span>Control Panel</span>
            </button>
            <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => onOpen("settings")}>
              <FloppyyIcon type="gears" size={16} />
              <span>Display Settings</span>
            </button>
            <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => onOpen("internet")}>
              <FloppyyIcon type="dialup" size={16} />
              <span>Dial-Up Networking</span>
            </button>
            <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={onScreensaver}>
              <FloppyyIcon type="monitor_windows" size={16} />
              <span>Screensaver</span>
            </button>
          </div>
        </div>
        <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => onOpen("computer")}>
          <FloppyyIcon type="computer" size={16} />
          <span>My Computer</span>
        </button>
        <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => onOpen("norton")}>
          <FloppyyIcon type="console" size={16} />
          <span>Norton Commander</span>
        </button>
        <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => onOpen("defrag")}>
          <FloppyyIcon type="defrag" size={16} />
          <span>Disk Defragmenter</span>
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

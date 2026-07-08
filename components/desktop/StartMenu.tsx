"use client";

import { useState } from "react";
import type { WindowId } from "@/lib/windows";
import { FloppyyIcon } from "./FloppyyIcon";

type Props = {
  onOpen: (id: WindowId, payload?: string) => void;
  onScreensaver: () => void;
  onShutdown: () => void;
  onNotify: (message: string, options?: { icon?: string; titleIcon?: string; persistent?: boolean }) => void;
};

export function StartMenu({ onOpen, onScreensaver, onShutdown, onNotify }: Props) {
  const [openSub, setOpenSub] = useState<string | null>(null);
  const toggleSub = (name: string) => setOpenSub((current) => (current === name ? null : name));

  const programs: Array<[WindowId, string, string]> = [
    ["internet", "Dial-Up Networking", "dialup"],
    ["music", "Winamp", "winamp"],
    ["paint", "Paint", "paint"],
    ["netscape", "Netscape Navigator", "netscape"],
    ["msdos", "MS-DOS Prompt", "prompt"],
    ["outlook", "Outlook Express", "msoutlook"],
    ["guestbook", "Guest Book", "guestbook"],
  ];

  const games: Array<[WindowId, string, string, string?]> = [
    ["minesweeper", "Minesweeper", "mine"],
    ["solitaire", "Solitaire", "cards"],
    ["doom", "Doom", "doom"],
    ["duke3d", "Duke Nukem 3D", "duke3d"],
    ["wolf3d", "Wolfenstein 3D", "wolfenstein"],
    ["dune2", "Dune II", "dune2"],
    ["warcraft", "WarCraft", "warcraft"],
  ];

  const favorites: Array<[string, string]> = [
    ["Lycos", "https://web.archive.org/web/19961225002710/http://www.lycos.com/"],
    ["AltaVista", "https://web.archive.org/web/19961023234631/http://altavista.digital.com/"],
    ["AOL", "https://web.archive.org/web/19961219002550/http://www.aol.com/"],
    ["Yahoo", "https://web.archive.org/web/19961017235908/http://www.yahoo.com/"],
    ["Amazon", "https://web.archive.org/web/19961112181513/http://www.amazon.com/"],
    ["eBay", "https://web.archive.org/web/19961225025243/http://www.ebay.com/"],
  ];

  return (
    <div
      className="fixed bottom-[28px] left-0 z-[4500] flex w-[220px] bg-[#c0c0c0]"
      style={{
        boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf"
      }}
      onClick={(event) => event.stopPropagation()}
    >
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

      <div className="flex-1 py-[3px]">
        <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => onOpen("about", "welcome")}>
          <FloppyyIcon type="credits" size={16} />
          <span>About</span>
        </button>
        <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => onOpen("projects")}>
          <FloppyyIcon type="directory_net" size={16} />
          <span>Projects</span>
        </button>
        <div className="mx-[3px] my-[2px] h-[1px] bg-[#808080] shadow-[0_1px_0_#fff]" />

        <div className="group/programs relative">
          <button
            className="menu-command flex items-center gap-[8px] py-[3px]"
            onClick={() => toggleSub("programs")}
          >
            <FloppyyIcon type="directory_open" size={16} />
            <span>Programs</span>
            <span className="ml-auto w-[10px] text-center text-[7px] leading-none">{"\u25B6\uFE0E"}</span>
          </button>
          <div
            className={`absolute left-full top-0 w-[210px] max-[640px]:w-[160px] bg-[#c0c0c0] py-[3px] group-hover/programs:block ${openSub === "programs" ? "block" : "hidden"}`}
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
          <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => toggleSub("games")}>
            <FloppyyIcon type="directory_check" size={16} />
            <span>Games</span>
            <span className="ml-auto w-[10px] text-center text-[7px] leading-none">{"\u25B6\uFE0E"}</span>
          </button>
          <div
            className={`absolute left-full top-0 w-[180px] max-[640px]:w-[160px] bg-[#c0c0c0] py-[3px] group-hover/games:block ${openSub === "games" ? "block" : "hidden"}`}
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

        <div className="group/favorites relative">
          <button
            className="menu-command flex items-center gap-[8px] py-[3px]"
            onClick={() => toggleSub("favorites")}
          >
            <FloppyyIcon type="fav" size={16} />
            <span>Favorites</span>
            <span className="ml-auto w-[10px] text-center text-[7px] leading-none">{"\u25B6\uFE0E"}</span>
          </button>
          <div
            className={`absolute left-full top-0 w-[190px] max-[640px]:w-[160px] bg-[#c0c0c0] py-[3px] group-hover/favorites:block ${openSub === "favorites" ? "block" : "hidden"}`}
            style={{
              boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
            }}
          >
            {favorites.map(([label, url]) => (
              <button
                key={label}
                className="menu-command flex items-center gap-[8px] py-[3px]"
                onClick={() => onOpen("ie-browser", url)}
              >
                <FloppyyIcon type="html" size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mx-[3px] my-[2px] h-[1px] bg-[#808080] shadow-[0_1px_0_#fff]" />

        <div className="group/settings relative">
          <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => toggleSub("settings")}>
            <FloppyyIcon type="gears" size={16} />
            <span>Settings</span>
            <span className="ml-auto w-[10px] text-center text-[7px] leading-none">{"\u25B6\uFE0E"}</span>
          </button>
          <div
            className={`absolute left-full top-0 w-[190px] max-[640px]:w-[160px] bg-[#c0c0c0] py-[3px] group-hover/settings:block ${openSub === "settings" ? "block" : "hidden"}`}
            style={{
              boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
            }}
          >
            <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => onOpen("control-panel")}>
              <FloppyyIcon type="control-panel" size={16} />
              <span>Control Panel</span>
            </button>
            <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => onOpen("screensaver", "settings")}>
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
            <div className="mx-[3px] my-[2px] h-[1px] bg-[#808080] shadow-[0_1px_0_#fff]" />
            <button
              className="menu-command flex items-center gap-[8px] py-[3px]"
              onClick={() =>
                onNotify(
                  "Windows Update: No updates required. This is already the most nostalgic OS ever made.",
                  { icon: "/favicon.png", titleIcon: "/icons/windows_update.png", persistent: true },
                )
              }
            >
              <img src="/icons/windows_update.png" alt="" width={16} height={16} style={{ imageRendering: "pixelated" }} draggable={false} />
              <span>Windows Update...</span>
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
        <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => onOpen("help")}>
          <img src="/icons/help.png" alt="" width={16} height={16} style={{ imageRendering: "pixelated" }} draggable={false} />
          <span>Help</span>
        </button>
        <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={() => onOpen("run")}>
          <FloppyyIcon type="run" size={16} />
          <span>Run...</span>
        </button>
        <div className="mx-[3px] my-[2px] h-[1px] bg-[#808080] shadow-[0_1px_0_#fff]" />

        <button className="menu-command flex items-center gap-[8px] py-[3px]" onClick={onShutdown}>
          <img src="/icons/shutdown.png" alt="" width={16} height={16} style={{ imageRendering: "pixelated" }} draggable={false} />
          <span>Shut Down...</span>
        </button>
      </div>
    </div>
  );
}

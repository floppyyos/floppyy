"use client";

import { useMemo, useState } from "react";
import type { WindowComponentProps, WindowId } from "@/lib/windows";

type DriveId = "C" | "D";
type DriveItem = {
  id: string;
  label: string;
  icon: string;
  description: string;
  kind: "folder" | "file";
  target?: string;
};

const toolbarButtons = [
  { label: "Back", icon: "←", action: "back" },
  { label: "Forward", icon: "→", action: "noop" },
  { label: "Up", icon: "↑", action: "up" },
  { label: "Cut", icon: "✂", action: "noop" },
  { label: "Copy", icon: "📋", action: "noop" },
  { label: "Paste", icon: "📄", action: "noop" },
  { label: "Undo", icon: "↩", action: "noop" },
  { label: "Delete", icon: "✕", action: "noop" },
  { label: "Properties", icon: "📝", action: "properties" },
  { label: "Views", icon: "▦", action: "noop" },
];

const driveFiles: Record<DriveId, Record<string, DriveItem[]>> = {
  C: {
    "": [
      { id: "windows", label: "WINDOWS", icon: "folder", description: "System folder", kind: "folder", target: "WINDOWS" },
      { id: "program-files", label: "Program Files", icon: "folder", description: "Installed programs", kind: "folder", target: "Program Files" },
      { id: "my-documents", label: "My Documents", icon: "documents", description: "Personal documents", kind: "folder", target: "My Documents" },
      { id: "projects", label: "Projects", icon: "folder", description: "Project files and shortcuts", kind: "folder", target: "Projects" },
      { id: "games", label: "Games", icon: "directory_open", description: "Classic games", kind: "folder", target: "Games" },
      { id: "autoexec", label: "AUTOEXEC.BAT", icon: "notepad", description: "MS-DOS Batch File", kind: "file" },
      { id: "config", label: "CONFIG.SYS", icon: "notepad", description: "System File", kind: "file" },
      { id: "command", label: "COMMAND.COM", icon: "prompt", description: "MS-DOS Application", kind: "file" },
    ],
    WINDOWS: [
      { id: "desktop", label: "Desktop", icon: "folder", description: "Desktop folder", kind: "folder", target: "WINDOWS\\Desktop" },
      { id: "system", label: "System", icon: "folder", description: "Windows system files", kind: "folder", target: "WINDOWS\\System" },
      { id: "clouds", label: "Clouds.bmp", icon: "painticon", description: "Bitmap Image", kind: "file" },
      { id: "winini", label: "WIN.INI", icon: "notepad", description: "Configuration Settings", kind: "file" },
    ],
    "WINDOWS\\Desktop": [
      { id: "internet", label: "Internet Explorer.lnk", icon: "ie", description: "Shortcut", kind: "file" },
      { id: "outlook", label: "Outlook Express.lnk", icon: "msoutlook", description: "Shortcut", kind: "file" },
      { id: "norton", label: "Norton Commander.lnk", icon: "console", description: "Shortcut", kind: "file" },
    ],
    "WINDOWS\\System": [
      { id: "kernel", label: "KERNEL32.DLL", icon: "gears", description: "Application Extension", kind: "file" },
      { id: "user", label: "USER.EXE", icon: "computer", description: "Application", kind: "file" },
      { id: "mmsystem", label: "MMSYSTEM.DLL", icon: "speaker", description: "Audio system file", kind: "file" },
    ],
    "Program Files": [
      { id: "winamp", label: "Winamp", icon: "winamp", description: "Media player folder", kind: "folder", target: "Program Files\\Winamp" },
      { id: "mcafee", label: "McAfee", icon: "McAfee", description: "Antivirus folder", kind: "folder", target: "Program Files\\McAfee" },
      { id: "netscape", label: "Netscape", icon: "netscape", description: "Browser folder", kind: "folder", target: "Program Files\\Netscape" },
    ],
    "Program Files\\Winamp": [
      { id: "winamp-exe", label: "WINAMP.EXE", icon: "winamp", description: "Application", kind: "file" },
      { id: "playlist", label: "PLAYLIST.M3U", icon: "notepad", description: "M3U Playlist", kind: "file" },
    ],
    "Program Files\\McAfee": [
      { id: "scan", label: "VSCAN.EXE", icon: "McAfee", description: "Application", kind: "file" },
      { id: "dat", label: "CLEAN.DAT", icon: "notepad", description: "Virus definitions", kind: "file" },
    ],
    "Program Files\\Netscape": [
      { id: "netscape-exe", label: "NETSCAPE.EXE", icon: "netscape", description: "Application", kind: "file" },
      { id: "bookmark", label: "BOOKMARK.HTM", icon: "html", description: "HTML Document", kind: "file" },
    ],
    "My Documents": [
      { id: "clouds-doc", label: "Clouds.bmp", icon: "painticon", description: "Bitmap Image", kind: "file" },
      { id: "aol", label: "AOL.url", icon: "url", description: "Internet Shortcut", kind: "file" },
      { id: "readme", label: "README.txt", icon: "notepad", description: "Text Document", kind: "file" },
    ],
    Projects: [
      { id: "with-no-hype", label: "With No Hype", icon: "folder", description: "AI and new tech explained honestly. No Hype.", kind: "file" },
      { id: "brewwery", label: "Brewwery", icon: "folder", description: "A visual Homebrew manager for macOS.", kind: "file" },
      { id: "openmodels", label: "OpenModels", icon: "folder", description: "Open Registry & Telemetry for AI Infrastructure.", kind: "file" },
      { id: "titanbase", label: "Titanbase", icon: "folder", description: "Visual Schema Designer For Developers and Product Teams.", kind: "file" },
      { id: "floppyy", label: "Floppyy", icon: "folder", description: "A retro computer in your browser.", kind: "file" },
    ],
    Games: [
      { id: "mines", label: "Minesweeper.exe", icon: "mine", description: "Application", kind: "file" },
      { id: "solitaire", label: "Solitaire.exe", icon: "cards", description: "Application", kind: "file" },
      { id: "doom", label: "Doom.exe", icon: "doom", description: "Application", kind: "file" },
    ],
  },
  D: {
    "": [
      { id: "floppyy-cd", label: "Floppyy 98", icon: "folder", description: "Floppyy installation files", kind: "folder", target: "Floppyy 98" },
      { id: "drivers", label: "Drivers", icon: "folder", description: "Device drivers", kind: "folder", target: "Drivers" },
      { id: "extras", label: "Extras", icon: "folder", description: "Bonus programs", kind: "folder", target: "Extras" },
      { id: "setup", label: "SETUP.EXE", icon: "gears", description: "Application", kind: "file" },
      { id: "readme", label: "README.TXT", icon: "notepad", description: "Text Document", kind: "file" },
    ],
    "Floppyy 98": [
      { id: "about", label: "ABOUT.TXT", icon: "notepad", description: "Text Document", kind: "file" },
      { id: "brand", label: "BRAND.TXT", icon: "notepad", description: "Text Document", kind: "file" },
      { id: "start", label: "START.HTM", icon: "html", description: "HTML Document", kind: "file" },
    ],
    Drivers: [
      { id: "modem", label: "MODEM.INF", icon: "notepad", description: "Setup Information", kind: "file" },
      { id: "display", label: "DISPLAY.INF", icon: "notepad", description: "Setup Information", kind: "file" },
      { id: "sound", label: "SOUND.INF", icon: "speaker", description: "Setup Information", kind: "file" },
    ],
    Extras: [
      { id: "winamp", label: "WINAMP.EXE", icon: "winamp", description: "Application", kind: "file" },
      { id: "norton", label: "NC.EXE", icon: "console", description: "Application", kind: "file" },
      { id: "shareware", label: "SHAREWARE.TXT", icon: "notepad", description: "Text Document", kind: "file" },
    ],
  },
};

function driveTitle(drive: DriveId) {
  return drive === "C" ? "(C:)" : "(D:)";
}

function driveDescription(drive: DriveId) {
  return drive === "C" ? "Local Disk" : "Compact Disc";
}

function parentPath(path: string) {
  const parts = path.split("\\").filter(Boolean);
  parts.pop();
  return parts.join("\\");
}

export function DriveWindow({ window, notify, openWindow, playSound }: WindowComponentProps) {
  const drive = window.payload === "D" ? "D" : "C";
  const [path, setPath] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const items = useMemo(() => driveFiles[drive][path] ?? [], [drive, path]);
  const selectedItem = items.find((item) => item.id === selected);
  const icon = drive === "D" ? "drive-d" : "drive-c";
  const address = `${drive}:\\${path}`;

  const goToPath = (nextPath: string) => {
    setHistory((items) => [...items, path]);
    setPath(nextPath);
    setSelected(null);
    playSound("open");
  };

  const goBack = () => {
    const previous = history.at(-1);
    if (previous === undefined) {
      notify("Back is not available.");
      playSound("error");
      return;
    }
    setHistory((items) => items.slice(0, -1));
    setPath(previous);
    setSelected(null);
    playSound("click");
  };

  const goUp = () => {
    if (!path) {
      openWindow("computer");
      return;
    }
    setPath(parentPath(path));
    setSelected(null);
    playSound("click");
  };

  const openItem = (item: DriveItem) => {
    if (item.kind === "folder" && item.target) {
      goToPath(item.target);
      return;
    }

    playSound("open");
    if (path === "Projects") {
      openWindow("project-details", item.id);
      return;
    }

    const label = item.label.toLowerCase();
    if (label.includes("winamp")) openWindow("music");
    else if (label.includes("minesweeper")) openWindow("minesweeper");
    else if (label.includes("solitaire")) openWindow("games", "solitaire");
    else if (label.includes("doom")) openWindow("doom");
    else if (label.includes("netscape")) openWindow("netscape");
    else if (label.includes("internet explorer") || label.endsWith(".url") || label.endsWith(".htm")) openWindow("ie-browser", "https://www.aol.com/");
    else if (label.includes("norton") || label === "nc.exe") openWindow("norton");
    else if (label.endsWith(".bmp")) openWindow("paint");
    else if (label.endsWith(".txt") || label.endsWith(".sys") || label.endsWith(".bat") || label.endsWith(".ini") || label.endsWith(".inf")) openWindow("notepad");
    notify(`${item.label}: ${item.description}`);
  };

  const runToolbar = (action: string, label: string) => {
    if (action === "back") {
      goBack();
      return;
    }
    if (action === "up") {
      goUp();
      return;
    }
    if (action === "properties" && selectedItem) {
      notify(`${selectedItem.label}: ${selectedItem.description}`);
      playSound("click");
      return;
    }
    playSound("click");
    notify(`${label} is not available.`);
  };

  return (
    <div className="flex h-full flex-col bg-[#c0c0c0] text-[11px]">
      <div className="flex h-[20px] items-center border-b border-[#808080] bg-[#c0c0c0] px-1">
        {["File", "Edit", "View", "Go", "Favorites", "Help"].map((item) => (
          <span key={item} className="cursor-default px-2 hover:underline">
            {item}
          </span>
        ))}
      </div>

      <div className="flex h-[50px] items-center gap-0 border-b border-[#808080] bg-[#c0c0c0] px-1">
        {toolbarButtons.map((button) => (
          <button
            key={button.label}
            className="flex h-[44px] w-[50px] cursor-default flex-col items-center justify-center text-[10px] hover:bg-[#dfdfdf]"
            onClick={() => runToolbar(button.action, button.label)}
          >
            <span className="text-[16px] leading-none">{button.icon}</span>
            <span className="mt-[2px]">{button.label}</span>
          </button>
        ))}
      </div>

      <div className="flex h-[24px] items-center gap-1 border-b border-[#808080] bg-[#c0c0c0] px-2">
        <span className="mr-1 text-[11px] font-bold">Address</span>
        <div className="flex h-[18px] flex-1 items-center border border-[#808080] bg-white px-1">
          <img src={`/icons/${icon}.png`} alt="" width={16} height={16} draggable={false} style={{ imageRendering: "pixelated" }} />
          <span className="ml-1 text-[11px]">{address}</span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 border-t border-[#dfdfdf] bg-white">
        <aside
          className="relative flex w-[140px] shrink-0 flex-col overflow-hidden border-r border-[#c0c0c0] bg-white p-3"
          style={{
            background:
              "radial-gradient(circle at 8% 20%, rgba(255,255,255,0.95) 0 18%, rgba(255,255,255,0) 34%), linear-gradient(135deg, #d9f5ff 0%, #ffffff 52%, #ffffff 100%)",
          }}
        >
          <img src={`/icons/${icon}.png`} alt="" width={32} height={32} draggable={false} style={{ imageRendering: "pixelated" }} />
          <h2 className="mt-2 text-[16px] font-bold leading-tight">{driveTitle(drive)}</h2>
          <div className="mt-2 h-[2px] w-full bg-gradient-to-r from-[#ff0000] via-[#ffff00] via-[#00c853] to-[#0000ff]" />
          <p className="mt-3 text-[11px] leading-[13px]">
            {selectedItem ? selectedItem.description : `${driveDescription(drive)}. Select an item to view its description.`}
          </p>
        </aside>

        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(82px,1fr))] content-start gap-x-2 gap-y-1">
            {items.map((item) => (
              <button
                key={item.id}
                className={`flex cursor-default flex-col items-center justify-start gap-1 rounded-none p-1 text-center ${
                  selected === item.id ? "bg-[#000080] text-white" : "hover:bg-[#000080]/10"
                }`}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelected(item.id);
                  playSound("click");
                }}
                onDoubleClick={() => openItem(item)}
              >
                <img src={`/icons/${item.icon}.png`} alt="" width={32} height={32} draggable={false} style={{ imageRendering: "pixelated" }} />
                <span className={`px-1 text-[11px] leading-[13px] ${selected === item.id ? "bg-[#000080] text-white" : ""}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex h-[20px] items-center border-t border-[#808080] bg-[#c0c0c0] px-2">
        <div className="flex-1 border-r border-[#808080] pr-2 text-[10px]">{items.length} object(s)</div>
        <div className="flex items-center gap-1 pl-2">
          <img src="/icons/computer.png" alt="" width={14} height={14} draggable={false} style={{ imageRendering: "pixelated" }} />
          <span className="text-[10px]">My Computer</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { WindowComponentProps } from "@/lib/windows";

type ComputerItem = {
  id: string;
  label: string;
  icon: string;
  description: string;
};

const items: ComputerItem[] = [
  { id: "floppy", label: "3½ Floppy (A:)", icon: "floppy", description: "3½ Inch Floppy Disk" },
  { id: "drive-c", label: "(C:)", icon: "drive-c", description: "Local Disk" },
  { id: "drive-d", label: "(D:)", icon: "drive-d", description: "Compact Disc" },
  { id: "printers", label: "Printers", icon: "printers", description: "Add, remove, and configure printers." },
  { id: "control-panel", label: "Control Panel", icon: "control-panel", description: "Use settings to personalize your computer." },
  { id: "dialup", label: "Dial-Up Networking", icon: "dialup", description: "Connect to other computers using a modem." },
  { id: "scheduled", label: "Scheduled Tasks", icon: "scheduled", description: "Add, modify, and manage scheduled tasks." },
  { id: "web-folders", label: "Web Folders", icon: "web-folders", description: "Open and manage Web Folders." },
];

const toolbarButtons = [
  { label: "Back", icon: "←" },
  { label: "Forward", icon: "→" },
  { label: "Up", icon: "↑" },
  { label: "Cut", icon: "✂" },
  { label: "Copy", icon: "📋" },
  { label: "Paste", icon: "📄" },
  { label: "Undo", icon: "↩" },
  { label: "Delete", icon: "✕" },
  { label: "Properties", icon: "📝" },
  { label: "Views", icon: "▦" },
];

export function ComputerWindow({ notify, openWindow, playSound }: WindowComponentProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedItem = items.find((i) => i.id === selected);

  return (
    <div className="flex h-full flex-col bg-[#c0c0c0] text-[11px]">
      {/* Menu bar */}
      <div className="flex items-center h-[20px] px-1 border-b border-[#808080] bg-[#c0c0c0]">
        <span className="px-2 hover:underline cursor-default">File</span>
        <span className="px-2 hover:underline cursor-default">Edit</span>
        <span className="px-2 hover:underline cursor-default">View</span>
        <span className="px-2 hover:underline cursor-default">Go</span>
        <span className="px-2 hover:underline cursor-default">Favorites</span>
        <span className="px-2 hover:underline cursor-default">Help</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center h-[50px] px-1 gap-0 border-b border-[#808080] bg-[#c0c0c0]">
        {toolbarButtons.map((btn) => (
          <button
            key={btn.label}
            className="flex flex-col items-center justify-center w-[50px] h-[44px] hover:bg-[#dfdfdf] cursor-default text-[10px]"
            onClick={() => {
              playSound("click");
              notify(`${btn.label} is not available.`);
            }}
          >
            <span className="text-[16px] leading-none">{btn.icon}</span>
            <span className="mt-[2px]">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Address bar */}
      <div className="flex items-center h-[24px] px-2 gap-1 border-b border-[#808080] bg-[#c0c0c0]">
        <span className="text-[11px] font-bold mr-1">Address</span>
        <div className="flex-1 flex items-center h-[18px] border border-[#808080] bg-white px-1">
          <img
            src="/icons/computer.png"
            alt=""
            width={16}
            height={16}
            className="mr-1"
            style={{ imageRendering: "pixelated" }}
          />
          <span className="text-[11px]">My Computer</span>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 min-h-0 bg-white border-t border-[#dfdfdf]">
        {/* Left panel */}
        <aside className="w-[140px] shrink-0 border-r border-[#c0c0c0] bg-white p-3 flex flex-col">
          <img
            src="/icons/computer.png"
            alt=""
            width={32}
            height={32}
            style={{ imageRendering: "pixelated" }}
          />
          <h2 className="mt-2 text-[16px] font-bold leading-tight">My<br/>Computer</h2>
          <div className="mt-2 h-[2px] w-full" style={{ background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff)" }} />
          <p className="mt-3 text-[11px] leading-[13px] text-[#000]">
            {selectedItem ? selectedItem.description : "Select an item to view its description."}
          </p>
        </aside>

        {/* Icons grid */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-x-2 gap-y-1 content-start">
            {items.map((item) => (
              <button
                key={item.id}
                className={`flex flex-col items-center justify-start gap-1 p-1 text-center rounded-none cursor-default ${
                  selected === item.id
                    ? "bg-[#000080] text-white"
                    : "hover:bg-[#000080]/10"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(item.id);
                  playSound("click");
                }}
                onDoubleClick={() => {
                  if (item.id === "dialup") {
                    playSound("open");
                    openWindow("internet");
                    return;
                  }
                  playSound(item.id === "floppy" ? "floppy" : "open");
                  notify(`${item.label}: ${item.description}`);
                }}
              >
                <img
                  src={`/icons/${item.icon}.png`}
                  alt=""
                  width={32}
                  height={32}
                  style={{ imageRendering: "pixelated" }}
                  draggable={false}
                />
                <span className={`text-[11px] leading-[13px] px-1 ${
                  selected === item.id ? "bg-[#000080] text-white" : ""
                }`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center h-[20px] px-2 border-t border-[#808080] bg-[#c0c0c0]">
        <div className="flex-1 text-[10px] border-r border-[#808080] pr-2">
          {items.length} object(s)
        </div>
        <div className="flex items-center gap-1 pl-2">
          <img
            src="/icons/computer.png"
            alt=""
            width={14}
            height={14}
            style={{ imageRendering: "pixelated" }}
          />
          <span className="text-[10px]">My Computer</span>
        </div>
      </div>
    </div>
  );
}

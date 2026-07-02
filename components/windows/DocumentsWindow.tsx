"use client";

import { useState } from "react";
import type { WindowComponentProps } from "@/lib/windows";
import { ToolbarIcon } from "./ToolbarIcon";

type DocumentItem = {
  id: string;
  label: string;
  icon: string;
  description: string;
  action: "image" | "link" | "note";
};

const documentItems: DocumentItem[] = [
  {
    id: "clouds",
    label: "Clouds.bmp",
    icon: "painticon",
    description: "A saved desktop wallpaper image.",
    action: "image",
  },
  {
    id: "aol-url",
    label: "AOL.url",
    icon: "url",
    description: "Internet Shortcut",
    action: "link",
  },
  {
    id: "readme",
    label: "README.txt",
    icon: "notepad",
    description: "Text Document",
    action: "note",
  },
];

const toolbarButtons = [
  { label: "Back", icon: "back" },
  { label: "Forward", icon: "forward" },
  { label: "Up", icon: "up" },
  { label: "Cut", icon: "cut" },
  { label: "Copy", icon: "copy" },
  { label: "Paste", icon: "paste" },
  { label: "Undo", icon: "undo" },
  { label: "Delete", icon: "delete" },
  { label: "Properties", icon: "properties" },
  { label: "Views", icon: "views" },
];

export function DocumentsWindow({ notify, openWindow, playSound }: WindowComponentProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedItem = documentItems.find((item) => item.id === selected);

  const openItem = (item: DocumentItem) => {
    playSound("open");

    if (item.action === "link") {
      openWindow("ie-browser", "https://www.aol.com/");
      return;
    }

    if (item.action === "image") {
      openWindow("paint", "clouds");
      return;
    }

    openWindow("notepad", "readme");
    notify("README.txt opened.");
  };

  return (
    <div className="flex h-full flex-col bg-[#c0c0c0] text-[11px]">
      <div className="flex h-[20px] items-center border-b border-[#808080] bg-[#c0c0c0] px-1">
        {["File", "Edit", "View", "Go", "Favorites", "Help"].map((item) => (
          <span key={item} className="px-2 cursor-default hover:underline">
            {item}
          </span>
        ))}
      </div>

      <div className="flex h-[50px] items-center gap-0 border-b border-[#808080] bg-[#c0c0c0] px-1">
        {toolbarButtons.map((button) => (
          <button
            key={button.label}
            className="group flex h-[44px] w-[50px] flex-col items-center justify-center text-[10px] cursor-default hover:bg-[#dfdfdf]"
            onClick={() => {
              playSound("click");
              notify(`${button.label} is not available.`);
            }}
          >
            <span className="flex h-[20px] items-center justify-center grayscale transition-[filter] duration-150 group-hover:grayscale-0"><ToolbarIcon name={button.icon} /></span>
            <span className="mt-[2px]">{button.label}</span>
          </button>
        ))}
      </div>

      <div className="flex h-[24px] items-center gap-1 border-b border-[#808080] bg-[#c0c0c0] px-2">
        <span className="mr-1 text-[11px] font-bold">Address</span>
        <div className="flex h-[18px] flex-1 items-center border border-[#808080] bg-white px-1">
          <img src="/icons/documents.png" alt="" width={16} height={16} draggable={false} style={{ imageRendering: "pixelated" }} />
          <span className="ml-1 text-[11px]">My Documents</span>
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
          <div
            className="pointer-events-none absolute -left-[48px] top-[86px] h-[150px] w-[150px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(206,241,255,0.75) 0 35%, rgba(206,241,255,0) 70%)",
            }}
          />
          <img className="relative" src="/icons/documents.png" alt="" width={32} height={32} draggable={false} style={{ imageRendering: "pixelated" }} />
          <h2 className="relative mt-2 text-[16px] font-bold leading-tight">My<br />Documents</h2>
          <div className="relative mt-2 h-[2px] w-full bg-gradient-to-r from-[#ff0000] via-[#ffff00] via-[#00c853] to-[#0000ff]" />
          <p className="relative mt-3 text-[11px] leading-[13px]">
            {selectedItem ? selectedItem.description : "Select an item to view its description."}
          </p>
        </aside>

        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] content-start gap-x-2 gap-y-1">
            {documentItems.map((item) => (
              <button
                key={item.id}
                className={`flex flex-col items-center justify-start gap-1 rounded-none p-1 text-center cursor-default ${
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
        <div className="flex-1 border-r border-[#808080] pr-2 text-[10px]">
          {documentItems.length} object(s)
        </div>
        <div className="flex items-center gap-1 pl-2">
          <img src="/icons/computer.png" alt="" width={14} height={14} draggable={false} style={{ imageRendering: "pixelated" }} />
          <span className="text-[10px]">My Computer</span>
        </div>
      </div>
    </div>
  );
}

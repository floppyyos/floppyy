"use client";

import { useState } from "react";
import type { WindowComponentProps } from "@/lib/windows";

type ControlItem = {
  id: string;
  label: string;
  icon: string;
  description: string;
};

const controlItems: ControlItem[] = [
  { id: "display", label: "Display", icon: "monitor_windows", description: "Change wallpaper, appearance, and screen saver settings." },
  { id: "sounds", label: "Sounds", icon: "speaker", description: "Assign sounds to Windows and program events." },
  { id: "mouse", label: "Mouse", icon: "mouse_ms", description: "Change pointer speed, buttons, and cursor scheme." },
  { id: "modems", label: "Modems", icon: "dialup", description: "Install and configure dial-up modems." },
  { id: "network", label: "Network", icon: "network", description: "Configure network components and identification." },
  { id: "add-remove", label: "Add/Remove Programs", icon: "gears", description: "Install or remove programs from this computer." },
  { id: "printers", label: "Printers", icon: "printers", description: "Add, remove, and configure printers." },
  { id: "users", label: "Users", icon: "users-share", description: "Manage user profiles and passwords." },
];

export function ControlPanelWindow({ notify, playSound, openWindow }: WindowComponentProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedItem = controlItems.find((item) => item.id === selected);

  const openApplet = (item: ControlItem) => {
    playSound("open");
    if (item.id === "display") {
      openWindow("screensaver");
      return;
    }
    if (item.id === "sounds") {
      notify("Sound scheme: Clicky Little Computer.");
      return;
    }
    if (item.id === "modems" || item.id === "network") {
      openWindow("internet");
      return;
    }
    if (item.id === "users") {
      openWindow("profile");
      return;
    }
    notify(`${item.label}: ${item.description}`);
  };

  return (
    <div className="flex h-full flex-col bg-[#c0c0c0] text-[11px]">
      <div className="flex h-[20px] items-center border-b border-[#808080] bg-[#c0c0c0] px-1">
        {["File", "Edit", "View", "Help"].map((item) => (
          <span key={item} className="cursor-default px-2 hover:underline">
            {item}
          </span>
        ))}
      </div>

      <div className="flex h-[24px] items-center gap-1 border-b border-[#808080] bg-[#c0c0c0] px-2">
        <span className="mr-1 font-bold">Address</span>
        <div className="flex h-[18px] flex-1 items-center border border-[#808080] bg-white px-1">
          <img src="/icons/control-panel.png" alt="" width={16} height={16} draggable={false} style={{ imageRendering: "pixelated" }} />
          <span className="ml-1">Control Panel</span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 bg-white">
        <aside
          className="w-[150px] shrink-0 border-r border-[#c0c0c0] p-3"
          style={{
            background:
              "radial-gradient(circle at 8% 20%, rgba(255,255,255,0.95) 0 18%, rgba(255,255,255,0) 34%), linear-gradient(135deg, #d9f5ff 0%, #ffffff 52%, #ffffff 100%)",
          }}
        >
          <img src="/icons/control-panel.png" alt="" width={32} height={32} draggable={false} style={{ imageRendering: "pixelated" }} />
          <h2 className="mt-2 text-[16px] font-bold leading-tight">Control<br />Panel</h2>
          <div className="mt-2 h-[2px] w-full bg-gradient-to-r from-[#ff0000] via-[#ffff00] via-[#00c853] to-[#0000ff]" />
          <p className="mt-3 leading-[13px]">
            {selectedItem ? selectedItem.description : "Select an item to view its description."}
          </p>
        </aside>

        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] content-start gap-x-3 gap-y-2">
            {controlItems.map((item) => (
              <button
                key={item.id}
                className={`flex cursor-default flex-col items-center justify-start gap-1 p-1 text-center ${
                  selected === item.id ? "bg-[#000080] text-white" : "hover:bg-[#000080]/10"
                }`}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelected(item.id);
                  playSound("click");
                }}
                onDoubleClick={() => openApplet(item)}
              >
                <img src={`/icons/${item.icon}.png`} alt="" width={32} height={32} draggable={false} style={{ imageRendering: "pixelated" }} />
                <span className={`px-1 leading-[13px] ${selected === item.id ? "bg-[#000080] text-white" : ""}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex h-[20px] items-center border-t border-[#808080] bg-[#c0c0c0] px-2">
        <div className="flex-1 border-r border-[#808080] pr-2 text-[10px]">{controlItems.length} object(s)</div>
        <div className="flex items-center gap-1 pl-2">
          <img src="/icons/computer.png" alt="" width={14} height={14} draggable={false} style={{ imageRendering: "pixelated" }} />
          <span className="text-[10px]">My Computer</span>
        </div>
      </div>
    </div>
  );
}

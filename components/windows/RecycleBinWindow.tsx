"use client";

import type { WindowComponentProps } from "@/lib/windows";

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

export function RecycleBinWindow({ notify, playSound }: WindowComponentProps) {
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
            className="flex h-[44px] w-[50px] flex-col items-center justify-center text-[10px] cursor-default hover:bg-[#dfdfdf]"
            onClick={() => {
              playSound("click");
              notify(`${button.label} is not available.`);
            }}
          >
            <span className="text-[16px] leading-none">{button.icon}</span>
            <span className="mt-[2px]">{button.label}</span>
          </button>
        ))}
      </div>

      <div className="flex h-[24px] items-center gap-1 border-b border-[#808080] bg-[#c0c0c0] px-2">
        <span className="mr-1 text-[11px] font-bold">Address</span>
        <div className="flex h-[18px] flex-1 items-center border border-[#808080] bg-white px-1">
          <img src="/icons/trash.png" alt="" width={16} height={16} draggable={false} style={{ imageRendering: "pixelated" }} />
          <span className="ml-1 text-[11px]">Recycle Bin</span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 border-t border-[#dfdfdf] bg-white">
        <aside className="relative w-[174px] shrink-0 overflow-y-scroll border-r border-[#808080] bg-white">
          <div
            className="relative min-h-full p-3 pr-2"
            style={{
              background:
                "radial-gradient(circle at 7% 18%, rgba(255,255,255,0.98) 0 18%, rgba(255,255,255,0) 34%), linear-gradient(135deg, #d8f4ff 0%, #ffffff 54%, #ffffff 100%)",
            }}
          >
            <div
              className="pointer-events-none absolute -left-[54px] top-[84px] h-[150px] w-[150px] rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(206,241,255,0.78) 0 35%, rgba(206,241,255,0) 70%)",
              }}
            />
            <img className="relative" src="/icons/trash.png" alt="" width={32} height={32} draggable={false} style={{ imageRendering: "pixelated" }} />
            <h2 className="relative mt-2 text-[22px] font-bold leading-tight">Recycle Bin</h2>
            <div className="relative mt-2 h-[2px] w-full bg-gradient-to-r from-[#ff0000] via-[#ffff00] via-[#00c853] to-[#0000ff]" />

            <div className="relative mt-5 space-y-4 text-[11px] leading-[13px]">
              <p>
                This folder contains files and folders that you have deleted from your computer.
              </p>
              <p>
                To permanently remove all items and reclaim disk space, click{" "}
                <button
                  className="font-bold text-[#0000ff] underline"
                  onClick={() => {
                    playSound("recycle");
                    notify("Recycle Bin is already empty.");
                  }}
                >
                  Empty Recycle Bin.
                </button>
              </p>
              <p>
                To move all items back to their original locations, click{" "}
                <button
                  className="font-bold text-[#0000ff] underline"
                  onClick={() => {
                    playSound("click");
                    notify("There are no items to restore.");
                  }}
                >
                  Restore All.
                </button>
              </p>
            </div>
          </div>
        </aside>

        <div className="flex-1 overflow-auto bg-white" />
      </div>

      <div className="flex h-[20px] items-center border-t border-[#808080] bg-[#c0c0c0] px-2">
        <div className="flex-1 border-r border-[#808080] pr-2 text-[10px]">
          0 object(s)
        </div>
        <div className="flex items-center gap-1 pl-2">
          <img src="/icons/computer.png" alt="" width={14} height={14} draggable={false} style={{ imageRendering: "pixelated" }} />
          <span className="text-[10px]">My Computer</span>
        </div>
      </div>
    </div>
  );
}

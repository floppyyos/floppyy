"use client";

import type { WindowComponentProps } from "@/lib/windows";

const leftFiles = ["AUTOEXEC.BAT", "COMMAND.COM", "CONFIG.SYS", "DOOM", "GAMES", "README.TXT", "WINAMP"];
const rightFiles = ["ABOUT.TXT", "CONTACT.CRD", "PROJECTS", "SETUP.EXE", "SYSTEM", "TEMP", "WSBOOT"];

function Panel({ drive, files, active }: { drive: string; files: string[]; active?: boolean }) {
  return (
    <section className="flex min-w-0 flex-1 flex-col border border-black bg-[#0000aa] text-white">
      <div className="flex h-[20px] items-center justify-between bg-[#00aaaa] px-2 text-black">
        <span>{drive}:\</span>
        <span>{active ? "Name" : "Info"}</span>
      </div>
      <div className="grid flex-1 auto-rows-[22px] grid-cols-[1fr_70px_72px] overflow-hidden p-1 font-mono text-[12px] leading-[18px]">
        {files.map((file, index) => (
          <div key={file} className={`contents ${active && index === 0 ? "text-[#ffff55]" : ""}`}>
            <span className={active && index === 0 ? "bg-[#00aaaa] px-1 text-black" : "px-1"}>{file}</span>
            <span className="px-1 text-right">{file.includes(".") ? "12,288" : "&lt;DIR&gt;"}</span>
            <span className="px-1 text-right">05-27-26</span>
          </div>
        ))}
      </div>
      <div className="h-[20px] bg-[#00aaaa] px-2 text-black">{files.length} files selected</div>
    </section>
  );
}

export function NortonCommanderWindow({ notify, playSound }: WindowComponentProps) {
  const command = (label: string, message: string) => (
    <button
      className="h-[24px] flex-1 bg-[#00aaaa] px-1 text-left text-black"
      onClick={() => {
        playSound("click");
        notify(message);
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="flex h-full flex-col bg-[#0000aa] p-1 font-mono text-[12px] text-white">
      <div className="mb-1 flex gap-2 bg-[#00aaaa] px-2 py-1 text-black">
        <span>Left</span>
        <span>Files</span>
        <span>Commands</span>
        <span>Options</span>
        <span>Right</span>
      </div>
      <div className="flex min-h-0 flex-1 gap-1">
        <Panel drive="C" files={leftFiles} active />
        <Panel drive="D" files={rightFiles} />
      </div>
      <div className="mt-1 flex gap-[2px] text-[11px]">
        {command("F3 View", "Viewing selected file in glorious text mode.")}
        {command("F4 Edit", "Edit mode enabled. Save early, save often.")}
        {command("F5 Copy", "Copying files at parallel-port speed.")}
        {command("F8 Delete", "Delete skipped. Recycle Bin is watching.")}
        {command("F10 Quit", "Norton Commander is staying resident.")}
      </div>
    </div>
  );
}

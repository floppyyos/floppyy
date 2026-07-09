"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import type { WindowComponentProps } from "@/lib/windows";
import { NICK_MAX_LENGTH, STATUS_META, STATUS_OPTIONS, UserStatus } from "@/lib/guestbook/types";
import { readProfile, writeProfile } from "@/lib/profile";
import { Win98Select } from "@/components/ui/Win98Select";

export function UserProfileWindow({ notify, playSound }: WindowComponentProps) {
  const [nick, setNick] = useState(() => readProfile().nick);
  const [status, setStatus] = useState<UserStatus>(() => readProfile().status);
  const [saved, setSaved] = useState(false);

  const save = () => {
    const nextNick = nick.trim().slice(0, NICK_MAX_LENGTH);
    writeProfile({ nick: nextNick, status });
    setNick(nextNick);
    setSaved(true);
    playSound("click");
    notify(`Profile saved for ${nextNick || "guest"}.`, { titleIcon: "/icons/users-share.png", balloon: true });
    window.setTimeout(() => setSaved(false), 1400);
  };

  return (
    <div className="flex h-full flex-col bg-[#c0c0c0] text-[11px]">
      <div className="window-menu-bar">
        {["File", "Edit", "View", "Help"].map((item) => (
          <button key={item} className="window-menu-item">
            <span className="underline">{item[0]}</span>
            {item.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 gap-[14px] p-[14px]">
        <div className="field-border flex w-[120px] shrink-0 flex-col items-center bg-white px-[8px] py-[12px] text-center">
          <img src="/icons/users-share.png" alt="" width={48} height={48} draggable={false} style={{ imageRendering: "pixelated" }} />
          <div className="mt-[8px] font-bold">Floppyy User</div>
          <div className="mt-[4px] text-[#606060]">{nick.trim() || "guest"}</div>
        </div>

        <div className="min-w-0 flex-1">
          <fieldset className="border border-[#808080] px-[10px] pb-[12px] pt-[8px] shadow-[1px_1px_#ffffff]">
            <legend className="px-[4px]">Profile information</legend>
            <label className="mb-[10px] block">
              <span className="mb-[3px] block">Nickname:</span>
              <input
                className="win-bevel-inset h-[22px] w-full bg-white px-[5px] text-[11px]"
                maxLength={NICK_MAX_LENGTH}
                value={nick}
                onChange={(event) => setNick(event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-[3px] block">ICQ status:</span>
              <Win98Select
                className="w-[180px]"
                ariaLabel="ICQ status"
                value={status}
                onChange={(value) => setStatus(value as UserStatus)}
                options={STATUS_OPTIONS.map((value) => ({
                  value,
                  label: (
                    <span className="flex items-center gap-[6px]">
                      <span
                        className="icq-flower"
                        style={{ "--icq-flower": STATUS_META[value].color } as CSSProperties}
                      />
                      {STATUS_META[value].label}
                    </span>
                  ),
                }))}
              />
            </label>
          </fieldset>

          <div className="mt-[12px] field-border bg-white px-[8px] py-[6px] leading-[15px]">
            This nickname is used by Guest Book, ICQ status, and future Floppyy scores.
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-[8px] border-t border-[#808080] px-[10px] py-[8px]">
        <span className="mr-auto self-center text-[#008000]">{saved ? "Saved." : ""}</span>
        <button className="win-button min-w-[76px]" onClick={save}>
          OK
        </button>
      </div>
    </div>
  );
}

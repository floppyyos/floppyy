"use client";

import type { WindowComponentProps } from "@/lib/windows";
import { MenuBar } from "./MenuBar";

const supportLinks = [
  { label: "Ko-fi", icon: "/support/kofi.png", url: "https://ko-fi.com/floppyyos" },
  { label: "PayPal", icon: "/support/paypal.png", url: "https://paypal.me/UmidM" },
];

export function SupportWindow({ notify, playSound }: WindowComponentProps) {
  const visit = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    playSound("click");
  };

  return (
    <div className="flex h-full flex-col">
      <MenuBar onHelp={() => notify("Choose Ko-fi or PayPal to support Floppyy.")} />
      <div className="field-border mb-2 flex gap-2 bg-white px-2 py-1">
        <span>Address:</span>
        <span className="font-mono">C:\\SUPPORT\\FLOPPYY</span>
      </div>
      <div className="sunken-panel min-h-0 flex-1 overflow-auto bg-white">
        <div className="flex min-h-full flex-col p-4">
          <div className="flex items-start gap-5 max-[480px]:flex-col">
            <div className="flex min-w-0 flex-1 items-start gap-4">
              <img
                src="/support/floppyyos.png"
                alt="Floppyy"
                width={64}
                height={64}
                className="shrink-0"
                style={{ imageRendering: "pixelated" }}
                draggable={false}
              />
              <div className="max-w-[340px] space-y-3 text-[12px] leading-[17px]">
                <h2 className="text-[18px] font-bold">Support Floppyy</h2>
                <p>
                  Floppyy is a free nostalgic trip back to the old web. If you enjoy the project, you can help keep it online and support future updates.
                </p>
                <p className="font-bold">Every coffee helps.</p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3 border-l border-[#dfdfdf] pl-4 max-[480px]:w-full max-[480px]:flex-row max-[480px]:border-l-0 max-[480px]:border-t max-[480px]:pt-4 max-[480px]:pl-0">
              {supportLinks.map((link) => (
                <button
                  key={link.label}
                  className="win-button flex h-[34px] min-w-[132px] items-center justify-center gap-2 px-4 text-[12px] max-[480px]:flex-1"
                  onClick={() => visit(link.url)}
                >
                  <img
                    src={link.icon}
                    alt=""
                    width={20}
                    height={20}
                    style={{ imageRendering: "pixelated" }}
                    draggable={false}
                  />
                  <span>{link.label}</span>
                </button>
              ))}
            </div>
          </div>

          <fieldset className="mt-4 min-h-[52px] border border-[#808080] px-3 pb-2 pt-1">
            <legend className="px-1 font-bold">Supporters</legend>
          </fieldset>
        </div>
      </div>
      <div className="status-bar mt-2">
        <p className="status-bar-field">2 support options</p>
        <p className="status-bar-field">Thank you!</p>
      </div>
    </div>
  );
}

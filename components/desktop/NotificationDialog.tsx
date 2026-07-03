"use client";

const RAISED =
  "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf";

export function NotificationDialog({
  message,
  title = "Floppyy",
  icon = "/icons/floppy.png",
  titleIcon = "/icons/floppy.png",
  onClose,
}: {
  message: string;
  title?: string;
  icon?: string;
  titleIcon?: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed left-1/2 top-1/2 z-[6000] w-[320px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 select-none bg-[#c0c0c0]"
      style={{ boxShadow: RAISED, padding: 3 }}
      role="alertdialog"
      aria-label={title}
    >
      <div className="flex h-[18px] items-center justify-between bg-gradient-to-r from-[#000080] to-[#1084d0] pl-[3px] pr-[2px]">
        <span className="flex items-center gap-[4px] truncate text-[11px] font-bold text-white">
          <img
            src={titleIcon}
            alt=""
            width={13}
            height={13}
            draggable={false}
            style={{ imageRendering: "pixelated" }}
          />
          {title}
        </span>
        <button
          className="flex h-[14px] w-[16px] items-center justify-center text-[10px] leading-none text-black"
          style={{ background: "#c0c0c0", boxShadow: RAISED }}
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="flex items-center gap-[14px] px-[16px] py-[18px]">
        <img
          src={icon}
          alt=""
          width={32}
          height={32}
          draggable={false}
          className="shrink-0"
          style={{ imageRendering: "pixelated" }}
        />
        <span className="text-[11px] leading-[15px] text-black">{message}</span>
      </div>

      <div className="flex justify-center pb-[14px]">
        <button className="win-button min-w-[80px] text-[11px]" onClick={onClose} autoFocus>
          OK
        </button>
      </div>
    </div>
  );
}

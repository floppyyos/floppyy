"use client";

export function NotificationBalloon({ message, bottomOffset = 34 }: { message: string; bottomOffset?: number }) {
  return (
    <div
      className="fixed right-[4px] z-[5000] max-w-[240px] bg-[#ffffcc] p-[8px] text-[11px]"
      style={{
        bottom: bottomOffset,
        border: "1px solid #000",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.25)"
      }}
    >
      <div className="mb-[2px] font-bold">Floppyy</div>
      <div>{message}</div>
    </div>
  );
}

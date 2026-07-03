"use client";

export function WindowLoading() {
  return (
    <div
      className="cursor-loading flex h-full w-full flex-col items-center justify-center gap-[10px] bg-[#c0c0c0] text-[11px] text-black"
      aria-busy="true"
    >
      <span className="text-[22px] leading-none">⌛</span>
      <span>Loading...</span>
      <div className="floppyy-progress h-[14px] w-[160px] overflow-hidden">
        <div className="floppyy-progress-bar" />
      </div>
    </div>
  );
}

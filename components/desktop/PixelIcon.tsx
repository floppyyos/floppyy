"use client";

const colors: Record<string, string[]> = {
  computer: ["#d7d7d7", "#7a7a7a", "#000080"],
  profile: ["#ffe0bd", "#0a64ad", "#c0c0c0"],
  folder: ["#f3c64e", "#d39b28", "#fff4a0"],
  mail: ["#ffffff", "#000080", "#c0c0c0"],
  joystick: ["#202020", "#d60000", "#00a000"],
  music: ["#101020", "#00e040", "#8080ff"],
  monitor: ["#202020", "#00e5ff", "#c0c0c0"],
  trash: ["#d8d8d8", "#7a7a7a", "#ffffff"],
  settings: ["#c0c0c0", "#404040", "#000080"],
  run: ["#ffffff", "#000000", "#1084d0"],
  app: ["#c0c0c0", "#000080", "#ffde59"],
};

export function PixelIcon({ type, size = 34 }: { type: string; size?: number }) {
  const [a, b, c] = colors[type] ?? colors.app;
  return (
    <span
      aria-hidden="true"
      className="relative inline-block"
      style={{ width: size, height: size }}
    >
      <span className="absolute left-[18%] top-[18%] h-[56%] w-[64%]" style={{ background: a, boxShadow: `0 0 0 2px ${b}` }} />
      <span className="absolute left-[25%] top-[25%] h-[34%] w-[50%]" style={{ background: c }} />
      <span className="absolute left-[28%] top-[78%] h-[10%] w-[44%]" style={{ background: b }} />
      <span className="absolute left-[38%] top-[66%] h-[14%] w-[24%]" style={{ background: a, boxShadow: `0 0 0 1px ${b}` }} />
      {type === "folder" && <span className="absolute left-[12%] top-[14%] h-[18%] w-[36%]" style={{ background: c, boxShadow: `0 0 0 1px ${b}` }} />}
      {type === "mail" && (
        <>
          <span className="absolute left-[20%] top-[28%] h-[2px] w-[60%] rotate-45" style={{ background: b }} />
          <span className="absolute left-[20%] top-[28%] h-[2px] w-[60%] -rotate-45" style={{ background: b }} />
        </>
      )}
      {type === "trash" && <span className="absolute left-[22%] top-[10%] h-[8%] w-[56%]" style={{ background: b }} />}
    </span>
  );
}

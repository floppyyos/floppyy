"use client";

type MenuItem = {
  label: string;
  onClick?: () => void;
};

export function GameMenuBar({ items }: { items: MenuItem[] }) {
  return (
    <div className="flex h-[20px] shrink-0 items-center gap-[18px] bg-[#c0c0c0] px-[4px] text-[11px] leading-none">
      {items.map((item) => (
        <button key={item.label} className="h-[18px] px-[2px] text-left active:bg-[#000080] active:text-white" onClick={item.onClick}>
          <span className="underline">{item.label[0]}</span>{item.label.slice(1)}
        </button>
      ))}
    </div>
  );
}

export function GameStatusBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-[2px] flex h-[20px] shrink-0 items-center bg-[#c0c0c0] px-[5px] text-[11px] shadow-[inset_1px_1px_#808080,inset_-1px_-1px_#fff]">
      {children}
    </div>
  );
}

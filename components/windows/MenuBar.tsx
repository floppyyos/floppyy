"use client";

export function MenuBar({ onHelp }: { onHelp?: () => void }) {
  return (
    <div className="window-menu-bar">
      {["File", "Edit", "View"].map((item) => (
        <button key={item} className="window-menu-item" style={{ marginRight: 10 }}>
          <span className="underline">{item[0]}</span>{item.slice(1)}
        </button>
      ))}
      <button className="window-menu-item" style={{ marginRight: 10 }} onClick={onHelp}>
        <span className="underline">H</span>elp
      </button>
    </div>
  );
}

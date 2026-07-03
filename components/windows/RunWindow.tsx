"use client";

import { useEffect, useState } from "react";
import { commands, isUrl } from "@/lib/commands";
import type { WindowComponentProps, WindowId } from "@/lib/windows";

export function RunWindow({ window: win, openWindow, closeWindow, notify, playSound, startScreensaver, crashSystem }: WindowComponentProps) {
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histOpen, setHistOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = globalThis.localStorage.getItem("floppyy-run-history");
      if (saved) setHistory(JSON.parse(saved));
    } catch {
      setHistory([]);
    }
  }, []);

  const remember = (command: string) => {
    const next = [command, ...history.filter((item) => item.toLowerCase() !== command.toLowerCase())].slice(0, 8);
    setHistory(next);
    globalThis.localStorage.setItem("floppyy-run-history", JSON.stringify(next));
  };

  const run = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      playSound("error");
      notify("Please enter a command or URL.");
      return;
    }
    remember(trimmed);

    // Easter egg: classic "destroy the machine" commands take Floppyy down.
    const lowered = trimmed.toLowerCase();
    if (/(^|\s)(format|deltree|del|erase|rd|rmdir|fdisk)(\s|$)/.test(lowered) || lowered.includes("*.*")) {
      playSound("error");
      closeWindow(win.instanceId);
      crashSystem?.({ variant: "cascade" });
      return;
    }

    // URL → open in IE browser via archive.org
    if (isUrl(trimmed)) {
      openWindow("ie-browser", trimmed);
      closeWindow(win.instanceId);
      return;
    }

    const normalized = trimmed.toLowerCase();

    if (normalized === "commands" || normalized === "?") {
      notify("Commands: about, computer, winamp, ie, netscape, notepad, paint, calc, cmd, doom, projects, games, music, screensaver, defrag, help. Some old words still work.");
      return;
    }

    const easterEggs: Record<string, () => void> = {
      llama: () => {
        notify("It really whips the llama.");
        openWindow("music");
      },
      nostalgia: () => {
        notify("Loading good old internet memories...");
        openWindow("about", "welcome");
      },
      clouds: () => {
        openWindow("paint");
      },
      stars: () => {
        notify("Stars screensaver activated.");
        startScreensaver("stars");
      },
      floppyy: () => {
        notify("The floppy still works.");
        openWindow("project-details", "floppyy");
      },
    };

    const easterEgg = easterEggs[normalized];
    if (easterEgg) {
      playSound("open");
      easterEgg();
      closeWindow(win.instanceId);
      return;
    }

    const command = commands[normalized];
    if (!command) {
      playSound("error");
      notify(`Cannot find '${trimmed}'. Make sure you typed the name correctly.`);
      return;
    }
    openWindow(command as WindowId);
    closeWindow(win.instanceId);
  };

  return (
    <form
      className="flex h-full flex-col gap-[12px] px-[6px] py-[4px] text-[11px]"
      onSubmit={(event) => {
        event.preventDefault();
        run();
      }}
    >
      <div className="flex items-start gap-[12px]">
        <img
          src="/icons/run.png"
          alt=""
          width={32}
          height={32}
          className="mt-[2px] shrink-0"
          style={{ imageRendering: "pixelated" }}
          draggable={false}
        />
        <p className="leading-[15px]">
          Type the name of a program, folder, document, or Internet resource, and Floppyy will open it for you.
        </p>
      </div>
      <div className="flex items-center gap-[8px]">
        <label htmlFor="run-open" className="shrink-0">Open:</label>
        <div className="relative flex h-[22px] min-w-0 flex-1">
          <input
            id="run-open"
            className="win-bevel-inset h-full min-w-0 flex-1 bg-white px-[4px] text-[11px]"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoFocus
          />
          <button
            type="button"
            className="win-button h-full w-[17px] px-0 text-[8px]"
            aria-label="Run history"
            onClick={() => history.length > 0 && setHistOpen((o) => !o)}
          >
            ▼
          </button>
          {histOpen && history.length > 0 && (
            <>
              <div className="fixed inset-0 z-[6000]" onMouseDown={() => setHistOpen(false)} />
              <ul
                className="absolute left-0 right-0 top-full z-[6001] mt-[1px] max-h-[160px] overflow-auto bg-white py-[1px] text-[11px] text-black"
                style={{ border: "1px solid #0a0a0a" }}
              >
                {history.map((item) => (
                  <li
                    key={item}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setValue(item);
                      setHistOpen(false);
                    }}
                    className="cursor-default truncate px-[5px] py-[1px] hover:bg-[#000080] hover:text-white"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      <div className="mt-auto flex justify-end gap-[6px]">
        <button type="submit" className="win-button min-w-[75px]">
          OK
        </button>
        <button type="button" className="win-button min-w-[75px]" onClick={() => closeWindow(win.instanceId)}>
          Cancel
        </button>
        <button
          type="button"
          className="win-button min-w-[75px]"
          onClick={() => {
            playSound("click");
            notify("There's nothing to browse — just type a name and press OK.");
          }}
        >
          Browse...
        </button>
      </div>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";
import { commands, isUrl } from "@/lib/commands";
import type { WindowComponentProps, WindowId } from "@/lib/windows";

export function RunWindow({ window: win, openWindow, closeWindow, notify, playSound, startScreensaver }: WindowComponentProps) {
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);

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

    // URL → open in IE browser via archive.org
    if (isUrl(trimmed)) {
      openWindow("ie-browser", trimmed);
      closeWindow(win.instanceId);
      return;
    }

    const normalized = trimmed.toLowerCase();
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
        notify("Clouds.bmp opened in Paint.");
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
    if (command === "help") {
      notify("Commands: about, computer, winamp, ie, netscape, notepad, paint, calc, cmd, doom, duke, sw, projects, games, music, screensaver, defrag, help. Some old words still work.");
      return;
    }
    openWindow(command as WindowId);
    closeWindow(win.instanceId);
  };

  return (
    <form
      className="flex h-full flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        run();
      }}
    >
      <div className="flex gap-3">
        <div className="text-3xl">▣</div>
        <p>Type the name of a program, folder, document, or internet resource, and Floppyy will open it for you.</p>
      </div>
      <label className="grid grid-cols-[52px_1fr] items-center gap-2">
        <span>Open:</span>
        <div className="flex min-w-0">
          <input className="win-bevel-inset min-w-0 flex-1 bg-white px-2 py-1" value={value} onChange={(event) => setValue(event.target.value)} autoFocus />
          <select
            className="win-button h-[26px] w-[28px] px-0 text-[10px]"
            aria-label="Run history"
            value=""
            onChange={(event) => {
              setValue(event.target.value);
              event.currentTarget.value = "";
            }}
          >
            <option value="">▼</option>
            {history.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </label>
      <div className="mt-auto flex justify-end gap-2">
        <button type="submit" className="win-button min-w-20">
          OK
        </button>
        <button type="button" className="win-button min-w-20" onClick={() => closeWindow(win.instanceId)}>
          Cancel
        </button>
      </div>
    </form>
  );
}

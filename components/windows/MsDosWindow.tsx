"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { commands, isUrl } from "@/lib/commands";
import type { WindowComponentProps, WindowId } from "@/lib/windows";

type Line = { text: string; type: "output" | "input" };

const HELP_TEXT = [
  "Available commands:",
  "",
  "  help      - Show this help",
  "  ver       - Display version",
  "  dir       - List directory",
  "  cls       - Clear screen",
  "  date      - Show current date",
  "  time      - Show current time",
  "  echo      - Display message",
  "  type      - Display file contents",
  "  color     - Change text color",
  "  start     - Open a program or URL",
  "             (e.g. start notepad, start google.com)",
  "  exit      - Close MS-DOS Prompt",
  "",
];

const DIR_OUTPUT = [
  " Volume in drive C has no label",
  " Volume Serial Number is 1998-0626",
  " Directory of C:\\",
  "",
  "WINDOWS      <DIR>        06-26-98  12:00a",
  "PROGRAM~1    <DIR>        06-26-98  12:00a",
  "GAMES        <DIR>        06-26-98  12:00a",
  "AUTOEXEC BAT           42 06-26-98  12:00a",
  "CONFIG   SYS          128 06-26-98  12:00a",
  "COMMAND  COM       93,890 06-26-98  12:00a",
  "WSBOOT   EXE      512,000 06-26-98  12:00a",
  "         4 file(s)        606,060 bytes",
  "         3 dir(s)   1,048,576,000 bytes free",
  "",
];

const FILES: Record<string, string[]> = {
  "autoexec.bat": [
    "@ECHO OFF",
    "SET PATH=C:\\WINDOWS;C:\\WINDOWS\\COMMAND",
    "SET BLASTER=A220 I5 D1",
    "C:\\WINDOWS\\COMMAND\\MSCDEX.EXE /D:MSCD001",
    "",
  ],
  "config.sys": [
    "DEVICE=C:\\WINDOWS\\HIMEM.SYS",
    "DEVICE=C:\\WINDOWS\\EMM386.EXE NOEMS",
    "DOS=HIGH,UMB",
    "FILES=40",
    "BUFFERS=20",
    "",
  ],
};

export function MsDosWindow({ window: win, closeWindow, openWindow, playSound }: WindowComponentProps) {
  const [lines, setLines] = useState<Line[]>([
    { text: "Microsoft(R) Windows 98", type: "output" },
    { text: "   (C)Copyright Microsoft Corp 1981-1999.", type: "output" },
    { text: "", type: "output" },
  ]);
  const [input, setInput] = useState("");
  const [textColor, setTextColor] = useState("#c0c0c0");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addOutput = useCallback((outputLines: string[]) => {
    setLines((prev) => [
      ...prev,
      ...outputLines.map((text) => ({ text, type: "output" as const })),
    ]);
  }, []);

  const executeCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim();
      const parts = trimmed.split(/\s+/);
      const command = parts[0].toLowerCase();
      const args = parts.slice(1).join(" ");

      // Add the input line to history
      setLines((prev) => [...prev, { text: `C:\\>${trimmed}`, type: "input" }]);

      switch (command) {
        case "":
          break;
        case "help":
        case "?":
          addOutput(HELP_TEXT);
          break;
        case "ver":
          addOutput(["", "Windows 98 [Version 4.10.1998]", ""]);
          break;
        case "dir":
          addOutput(DIR_OUTPUT);
          break;
        case "cls":
          setLines([]);
          break;
        case "date":
          addOutput(["", `Current date is ${new Date().toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "2-digit", day: "2-digit" })}`, ""]);
          break;
        case "time":
          addOutput(["", `Current time is ${new Date().toLocaleTimeString("en-US")}`, ""]);
          break;
        case "echo":
          addOutput([args || "ECHO is on.", ""]);
          break;
        case "type": {
          const filename = args.toLowerCase();
          const file = FILES[filename];
          if (file) {
            addOutput(file);
          } else {
            addOutput([`File not found - ${args || "(none)"}`, ""]);
          }
          break;
        }
        case "color": {
          const colors: Record<string, string> = {
            "0": "#000000", "1": "#000080", "2": "#008000", "3": "#008080",
            "4": "#800000", "5": "#800080", "6": "#808000", "7": "#c0c0c0",
            "8": "#808080", "9": "#0000ff", "a": "#00ff00", "b": "#00ffff",
            "c": "#ff0000", "d": "#ff00ff", "e": "#ffff00", "f": "#ffffff",
          };
          const code = (args || "7").toLowerCase().slice(-1);
          setTextColor(colors[code] ?? "#c0c0c0");
          break;
        }
        case "start": {
          if (!args) {
            addOutput(["Usage: start <program|url>", ""]);
            break;
          }
          // URL → open in browser
          if (isUrl(args)) {
            addOutput([`Starting ${args}...`, ""]);
            openWindow("ie-browser", args);
            break;
          }
          // Program name
          const prog = commands[args.toLowerCase()];
          if (prog && prog !== "help") {
            addOutput([`Starting ${args}...`, ""]);
            openWindow(prog as WindowId);
          } else {
            addOutput([`Bad command or file name - ${args}`, ""]);
            playSound("error");
          }
          break;
        }
        case "exit":
          closeWindow(win.instanceId);
          break;
        default:
          addOutput([`Bad command or file name`, ""]);
          playSound("error");
          break;
      }
    },
    [addOutput, closeWindow, openWindow, playSound, win.instanceId],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
    setInput("");
  };

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  // Focus input on click
  const focusInput = () => inputRef.current?.focus();

  return (
    <div
      className="flex flex-col h-full bg-black cursor-text"
      onClick={focusInput}
      style={{ color: textColor }}
    >
      <div ref={containerRef} className="flex-1 overflow-auto p-2 font-mono text-[14px] leading-[18px]">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-all">
            {line.text || "\u00a0"}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="flex">
          <span className="whitespace-pre">C:\&gt;</span>
          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-none border-none font-mono text-[14px] caret-current"
            style={{ color: "inherit" }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
}

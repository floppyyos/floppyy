import type { ReactNode } from "react";

export type WindowId =
  | "about"
  | "calculator"
  | "computer"
  | "control-panel"
  | "defrag"
  | "documents"
  | "doom"
  | "drive"
  | "internet"
  | "ie-browser"
  | "netscape"
  | "mediaplayer"
  | "minesweeper"
  | "msdos"
  | "notepad"
  | "outlook"
  | "projects"
  | "games"
  | "music"
  | "norton"
  | "paint"
  | "recycle-bin"
  | "screensaver"
  | "snake"
  | "solitaire"
  | "run"
  | "settings"
  | "share"
  | "duke"
  | "shadow-warrior"
  | "project-details";

export type DesktopWindow = {
  instanceId: string;
  id: WindowId;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  payload?: string;
};

export type WindowDefinition = {
  id: WindowId;
  title: string;
  icon: string;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
};

export type WindowComponentProps = {
  window: DesktopWindow;
  openWindow: (id: WindowId, payload?: string) => void;
  closeWindow: (instanceId: string) => void;
  minimizeWindow?: (instanceId: string) => void;
  notify: (message: string) => void;
  playSound: (sound: string) => void;
  fadeOutSound?: (sound: string, duration?: number) => void;
  startScreensaver: (mode?: "pipes" | "stars" | "maze" | "mystify" | "flying-windows") => void;
  internetConnected?: boolean;
};

export const windowDefinitions: Record<WindowId, WindowDefinition> = {
  about: { id: "about", title: "Welcome to Floppyy", icon: "computer", width: 560, height: 500 },
  calculator: { id: "calculator", title: "Calculator", icon: "calculator", width: 260, height: 270 },
  computer: { id: "computer", title: "My Computer", icon: "computer", width: 720, height: 520 },
  "control-panel": { id: "control-panel", title: "Control Panel", icon: "control-panel", width: 600, height: 420 },
  defrag: { id: "defrag", title: "Defragmenting Drive C", icon: "computer", width: 500, height: 340 },
  documents: { id: "documents", title: "My Documents", icon: "documents", width: 720, height: 500 },
  doom: { id: "doom", title: "DOOM", icon: "doom", width: 680, height: 510, minWidth: 480, minHeight: 360 },
  drive: { id: "drive", title: "Local Disk", icon: "drive-c", width: 780, height: 550 },
  internet: { id: "internet", title: "Floppyy Net", icon: "dialup", width: 355, height: 470 },
  "ie-browser": { id: "ie-browser", title: "Microsoft Internet Explorer", icon: "ie", width: 840, height: 580 },
  netscape: { id: "netscape", title: "Netscape Navigator", icon: "netscape", width: 760, height: 520 },
  msdos: { id: "msdos", title: "MS-DOS Prompt", icon: "prompt", width: 640, height: 400 },
  notepad: { id: "notepad", title: "Untitled - Notepad", icon: "notepad", width: 600, height: 440 },
  mediaplayer: { id: "mediaplayer", title: "Windows Media Player", icon: "sound", width: 420, height: 380 },
  minesweeper: { id: "minesweeper", title: "Minesweeper", icon: "mine", width: 300, height: 380, minWidth: 292, minHeight: 365 },
  outlook: { id: "outlook", title: "Outlook Express", icon: "msoutlook", width: 720, height: 500 },
  projects: { id: "projects", title: "Projects", icon: "folder", width: 720, height: 500 },
  games: { id: "games", title: "Games", icon: "joystick", width: 760, height: 560 },
  music: { id: "music", title: "Winamp", icon: "winamp", width: 290, height: 560 },
  norton: { id: "norton", title: "Norton Commander", icon: "console", width: 760, height: 500 },
  paint: { id: "paint", title: "untitled - Paint", icon: "paint", width: 800, height: 620 },
  "recycle-bin": { id: "recycle-bin", title: "Recycle Bin", icon: "trash", width: 720, height: 500 },
  screensaver: { id: "screensaver", title: "Screensaver", icon: "monitor", width: 460, height: 330 },
  snake: { id: "snake", title: "Snake", icon: "snake", width: 330, height: 414, minWidth: 330, minHeight: 414 },
  solitaire: { id: "solitaire", title: "Solitaire", icon: "cards", width: 720, height: 500, minWidth: 560, minHeight: 400 },
  run: { id: "run", title: "Run", icon: "run", width: 420, height: 210 },
  settings: { id: "settings", title: "Settings", icon: "gears", width: 520, height: 380 },
  share: { id: "share", title: "Send to a Friend", icon: "garfield", width: 400, height: 555 },
  duke: { id: "duke", title: "Duke Nukem 3D", icon: "doom", width: 720, height: 560, minWidth: 480, minHeight: 380 },
  "shadow-warrior": { id: "shadow-warrior", title: "Shadow Warrior", icon: "doom", width: 720, height: 560, minWidth: 480, minHeight: 380 },
  "project-details": {
    id: "project-details",
    title: "Project Details",
    icon: "folder",
    width: 460,
    height: 330,
  },
};

export type RenderWindow = (props: WindowComponentProps) => ReactNode;

export type DesktopIconDefinition = {
  id: string;
  label: string;
  icon: string;
  windowId?: WindowId;
  payload?: string;
  message?: string;
};

export const desktopIcons: DesktopIconDefinition[] = [
  { id: "computer", label: "My Computer", icon: "computer", windowId: "computer" },
  { id: "dialup", label: "Dial-Up Networking", icon: "dialup", windowId: "internet" },
  { id: "internet", label: "Internet Explorer", icon: "ie", windowId: "ie-browser" },
  { id: "documents", label: "My Documents", icon: "documents", windowId: "documents" },
  { id: "winamp", label: "Winamp", icon: "winamp", windowId: "music" },
  { id: "recycle", label: "Recycle Bin", icon: "trash", windowId: "recycle-bin" },
  { id: "prompt", label: "MS-DOS Prompt", icon: "prompt", windowId: "msdos" },
  { id: "paint", label: "Paint", icon: "painticon", windowId: "paint" },
  { id: "doom", label: "Doom", icon: "doom", windowId: "doom" },
  { id: "calculator", label: "Calculator", icon: "calculator", windowId: "calculator" },
  { id: "credits", label: "Credits", icon: "credits", windowId: "about", payload: "welcome" },
  { id: "minesweeper", label: "Minesweeper", icon: "mine", windowId: "minesweeper" },
  { id: "solitaire", label: "Solitaire", icon: "cards", windowId: "solitaire" },
  { id: "outlook", label: "Outlook Express", icon: "msoutlook", windowId: "outlook" },
  { id: "notepad", label: "Notepad", icon: "notepad", windowId: "notepad" },
  { id: "netscape", label: "Netscape Navigator", icon: "netscape", windowId: "netscape" },
  { id: "legend", label: "legend", icon: "video", windowId: "mediaplayer", payload: "Rick Astley - Never Gonna Give You Up" },
  { id: "share", label: "Share", icon: "garfield", windowId: "share" },
];

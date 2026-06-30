# Floppyy

<img src="public/og-image.jpg">

Floppyy is a browser desktop built on pure nostalgia.
Boot up, click around, remember everything — minus the dial-up wait.
Mostly.

> The web you grew up on.

![Floppyy](https://img.shields.io/badge/Floppyy-v3.0-008080?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)

## What is Floppyy?

Floppyy is a retro computer in your browser.

It brings back the feeling of old desktop systems, pixel windows, floppy disks, BIOS boot screens, Winamp vibes, classic games, and the early web — rebuilt as a playful browser experience.

Not an emulator.

Not a productivity tool.

Just a small machine for good old internet memories.

## Features

### Desktop Environment
- BIOS POST → boot sequence → desktop
- Draggable desktop icons with grid snapping
- Drag icons onto the Recycle Bin to delete them (with empty/full bin states and Empty Recycle Bin)
- Right-click context menu (Arrange Icons, Line Up, Refresh, Properties, Empty Recycle Bin)
- Window management — open, close, minimize, maximize, drag, resize, z-order
- Start Menu with program list and Shut Down
- Taskbar with Start button, quick launch, window buttons, and a live system tray clock (double-click to open Date/Time)
- Keyboard shortcuts — Ctrl+Esc (Start), Alt+F4 (close), Enter (open), Ctrl+Alt+Backspace (restart)

### Applications
- **Notepad** — text editor with File/Edit/Search/Format menus, word wrap
- **Paint** — drawing app with an authentic toolbox (pencil, brush, airbrush, eraser, fill, color picker, text, line, shapes), per-tool size/width options, color palette, and undo
- **Calculator** — functional calculator
- **Internet Explorer** — loads real 1998 websites via Wayback Machine
- **Netscape Navigator** — retro alternative browser
- **MS-DOS Prompt** — command-line interface with working commands
- **Outlook Express** — email client UI
- **Norton Commander** — dual-pane file manager
- **Windows Media Player** — video playback
- **Winamp** — music player (frameless, authentic skin)
- **My Computer / My Documents / Local Disk** — file system browsing
- **Projects** — portfolio browser with project details
- **Control Panel & Display Settings** — system configuration
- **Date/Time Properties** — live clock with analog face, calendar, and time zone (double-click the taskbar clock)
- **Disk Defragmenter** — animated defrag utility
- **Recycle Bin** — holds deleted desktop icons, restore or empty
- **Run** dialog, **Share** dialog, and **About / Credits**
- **Help** — Floppyy Help (getting started, platform-aware keyboard shortcuts, and the full list of secrets)
- **Screensavers** — Pipes, Starfield, Maze, Mystify, Flying Windows

### Games
- **Doom** — 3D raycasting FPS with enemies, weapons, 3 levels
- **Minesweeper** — classic mine-clearing puzzle
- **Solitaire** — card game (drag or click-to-move)

### System
- Sound effects via Web Audio API with oscillator fallback
- Screensaver activation after idle timeout
- Service worker for offline support
- Safe Mode boot option
- Shut Down with "It's now safe to turn off your computer" screen
- Share dialog for social sharing

## Easter Eggs

Floppyy occasionally fights back. A few things to try — the full list lives in **Start → Help → Tips & Secrets**:

- Open **My Computer** four times in a row to trigger a cascade of errors → blue screen → reboot
- Press **Ctrl+Alt+Backspace** (⌃ + ⌥ + ⌫ on Mac) for an on-demand crash & restart
- Type `format c:`, `del *.*`, or `deltree` into the **Run** dialog... and say goodbye
- Internet Explorer and Netscape occasionally throw a fatal error mid-browse (true to the era)
- A few minutes into a session, McAfee "finds a virus" — once per machine, and it's bluffing
- Lose at Minesweeper and the computer may rub it in
- Secret **Run** words: `llama`, `nostalgia`, `clouds`, `stars`, `floppyy`
- Drag My Computer onto the Recycle Bin — Floppyy will refuse

## Tech Stack

- **Next.js 16** — App Router, Turbopack
- **React 19** — latest concurrent features
- **TypeScript 5.9** — strict type safety
- **Tailwind CSS 4** — utility-first styling + custom Win98 CSS
- **Web Audio API** — sound effects
- **Canvas API** — Paint app, Doom renderer
- **HTML5 Video** — Media Player
- **Service Worker** — offline caching

## Getting Started

> Requires Node.js 20.9.0 or later.

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Browser Support

Works in all modern browsers. Best experienced on desktop at 1024×768 or higher.

## License

MIT

---

Visit [www.floppyy.com](https://www.floppyy.com)

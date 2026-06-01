"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BootScreen, BootMode } from "@/components/boot/BootScreen";
import { ContextMenu } from "./ContextMenu";
import { DesktopIcon } from "./DesktopIcon";
import { NotificationBalloon } from "./NotificationBalloon";
import { StartMenu } from "./StartMenu";
import { Taskbar } from "./Taskbar";
import { WindowFrame } from "@/components/windows/WindowFrame";
import { AboutWindow } from "@/components/windows/AboutWindow";
import { CalculatorWindow } from "@/components/windows/CalculatorWindow";
import { ComputerWindow } from "@/components/windows/ComputerWindow";
import { DoomWindow } from "@/components/windows/DoomWindow";
import { GamesWindow } from "@/components/windows/GamesWindow";
import { InternetWindow } from "@/components/windows/InternetWindow";
import { IEBrowserWindow } from "@/components/windows/IEBrowserWindow";
import { NetscapeWindow } from "@/components/windows/NetscapeWindow";
import { MsDosWindow } from "@/components/windows/MsDosWindow";
import { MediaPlayerWindow } from "@/components/windows/MediaPlayerWindow";
import { MinesweeperWindow } from "@/components/windows/MinesweeperWindow";
import { MusicWindow } from "@/components/windows/MusicWindow";
import { NortonCommanderWindow } from "@/components/windows/NortonCommanderWindow";
import { NotepadWindow } from "@/components/windows/NotepadWindow";
import { OutlookWindow } from "@/components/windows/OutlookWindow";
import { PaintWindow } from "@/components/windows/PaintWindow";
import { ProjectDetailsWindow } from "@/components/windows/ProjectDetailsWindow";
import { ProjectsWindow } from "@/components/windows/ProjectsWindow";
import { RunWindow } from "@/components/windows/RunWindow";
import { ScreensaverWindow } from "@/components/windows/ScreensaverWindow";
import { SettingsWindow } from "@/components/windows/SettingsWindow";
import { ShareWindow } from "@/components/windows/ShareWindow";
import { DefragWindow } from "@/components/windows/DefragWindow";
import { DocumentsWindow } from "@/components/windows/DocumentsWindow";
import { RecycleBinWindow } from "@/components/windows/RecycleBinWindow";
import { ShutDownOverlay } from "@/components/windows/ShutDownOverlay";
import { ScreensaverOverlay } from "@/components/screensavers/ScreensaverOverlay";
import { useDoubleClick } from "@/hooks/useDoubleClick";
import { useScreensaver } from "@/hooks/useScreensaver";
import { useSound } from "@/hooks/useSound";
import { useWindowManager } from "@/hooks/useWindowManager";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { desktopIcons, WindowComponentProps, WindowId } from "@/lib/windows";

type MenuState = { x: number; y: number; target?: string } | null;
type IconPosition = { x: number; y: number };
type IconDrag = {
  id: string;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  moved: boolean;
} | null;
type WindowDrag = { instanceId: string; dx: number; dy: number } | null;

const ICON_WIDTH = 75;
const ICON_HEIGHT = 68;
const ICON_COLUMN_GAP = 4;
const ICON_ROW_GAP = 4;
const ICON_STEP_X = ICON_WIDTH + ICON_COLUMN_GAP;
const ICON_STEP_Y = ICON_HEIGHT + ICON_ROW_GAP;
const DESKTOP_PADDING = 6;
const TASKBAR_HEIGHT = 28;

function initialIconPositions() {
  return iconGridPositions(desktopIcons.map((icon) => icon.id));
}

function iconGridPositions(ids: string[]) {
  const availableHeight = typeof window === "undefined" ? 740 : window.innerHeight - TASKBAR_HEIGHT - DESKTOP_PADDING * 2;
  const availableWidth = typeof window === "undefined" ? 1024 : window.innerWidth - DESKTOP_PADDING * 2;
  const rows = Math.max(1, Math.floor(availableHeight / ICON_STEP_Y));
  const maxCols = Math.max(1, Math.floor(availableWidth / ICON_STEP_X));
  return Object.fromEntries(
    ids.map((id, index) => {
      // Place "share" icon at bottom-right
      if (id === "share") {
        return [
          id,
          {
            x: DESKTOP_PADDING + (maxCols - 1) * ICON_STEP_X,
            y: DESKTOP_PADDING + (rows - 1) * ICON_STEP_Y,
          },
        ];
      }
      const column = Math.floor(index / rows);
      const row = index % rows;
      return [
        id,
        {
          x: DESKTOP_PADDING + column * ICON_STEP_X,
          y: DESKTOP_PADDING + row * ICON_STEP_Y,
        },
      ];
    }),
  ) as Record<string, IconPosition>;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function cellKey(column: number, row: number) {
  return `${column}:${row}`;
}

function nearestFreeGridPosition(id: string, x: number, y: number, positions: Record<string, IconPosition>) {
  const maxRows = Math.max(1, Math.floor((window.innerHeight - TASKBAR_HEIGHT - DESKTOP_PADDING * 2) / ICON_STEP_Y));
  const maxColumns = Math.max(1, Math.floor((window.innerWidth - DESKTOP_PADDING * 2) / ICON_STEP_X));
  const targetColumn = clamp(Math.round((x - DESKTOP_PADDING) / ICON_STEP_X), 0, maxColumns - 1);
  const targetRow = clamp(Math.round((y - DESKTOP_PADDING) / ICON_STEP_Y), 0, maxRows - 1);
  const occupied = new Set<string>();

  Object.entries(positions).forEach(([otherId, position]) => {
    if (otherId === id) return;
    const column = clamp(Math.round((position.x - DESKTOP_PADDING) / ICON_STEP_X), 0, maxColumns - 1);
    const row = clamp(Math.round((position.y - DESKTOP_PADDING) / ICON_STEP_Y), 0, maxRows - 1);
    occupied.add(cellKey(column, row));
  });

  for (let radius = 0; radius <= Math.max(maxRows, maxColumns); radius += 1) {
    for (let column = targetColumn - radius; column <= targetColumn + radius; column += 1) {
      for (let row = targetRow - radius; row <= targetRow + radius; row += 1) {
        if (column < 0 || row < 0 || column >= maxColumns || row >= maxRows) continue;
        if (Math.max(Math.abs(column - targetColumn), Math.abs(row - targetRow)) !== radius) continue;
        if (!occupied.has(cellKey(column, row))) {
          return {
            x: DESKTOP_PADDING + column * ICON_STEP_X,
            y: DESKTOP_PADDING + row * ICON_STEP_Y,
          };
        }
      }
    }
  }

  return {
    x: DESKTOP_PADDING + targetColumn * ICON_STEP_X,
    y: DESKTOP_PADDING + targetRow * ICON_STEP_Y,
  };
}

export default function Desktop() {
  const [booted, setBooted] = useState(false);
  const [bootMode, setBootMode] = useState<BootMode>("normal");
  const [dialupDone, setDialupDone] = useState(false);
  const [pendingStartup, setPendingStartup] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<MenuState>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [mcAfeeOpen, setMcAfeeOpen] = useState(false);
  const [shutdownOpen, setShutdownOpen] = useState(false);
  const [safeToTurnOff, setSafeToTurnOff] = useState(false);
  const [iconPositions, setIconPositions] = useState<Record<string, IconPosition>>(() => initialIconPositions());
  const iconDrag = useRef<IconDrag>(null);
  const winampDrag = useRef<WindowDrag>(null);
  const wm = useWindowManager();
  const { playSound, fadeOutSound, muted, setMuted } = useSound();
  const screensaver = useScreensaver(60000);
  useServiceWorker();

  const notify = useCallback(
    (message: string) => {
      setNotification(message);
      playSound("notification");
      window.setTimeout(() => setNotification(null), 2800);
    },
    [playSound],
  );

  const openWindow = useCallback(
    (id: WindowId, payload?: string) => {
      wm.openWindow(id, payload);
      setStartOpen(false);
      setContextMenu(null);
      playSound("open");
    },
    [playSound, wm],
  );

  const handleDialupConnected = useCallback(() => {
    setDialupDone(true);
  }, []);

  const handleQuickLaunch = useCallback(
    (id: string) => {
      if (id === "internet") {
        openWindow("ie-browser");
      } else {
        openWindow(id as WindowId);
      }
    },
    [openWindow],
  );

  const handleShowDesktop = useCallback(() => {
    wm.minimizeAll();
    playSound("click");
  }, [wm, playSound]);

  const iconClick = useDoubleClick<string>(
    (id) => {
      setSelectedIcon(id);
      playSound("click");
    },
    (id) => {
      setSelectedIcon(id);
      const icon = desktopIcons.find((item) => item.id === id);
      if (icon?.windowId) {
        if (id === "recycle") playSound("recycle");
        openWindow(icon.windowId, icon.payload);
      } else {
        if (id === "recycle") playSound("recycle");
        notify(icon?.message ?? "Shortcut is resting on the desktop.");
      }
    },
  );

  const moveIcon = useCallback((event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = iconDrag.current;
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) > 4) {
      drag.moved = true;
    }
    if (!drag.moved) return;
    setIconPositions((positions) => ({
      ...positions,
      [drag.id]: {
        x: clamp(drag.originX + dx, 0, window.innerWidth - ICON_WIDTH),
        y: clamp(drag.originY + dy, 0, window.innerHeight - TASKBAR_HEIGHT - ICON_HEIGHT),
      },
    }));
  }, []);

  const releaseIcon = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      const drag = iconDrag.current;
      if (!drag) return;
      event.currentTarget.releasePointerCapture(event.pointerId);
      iconDrag.current = null;
      if (!drag.moved) {
        iconClick(drag.id);
      } else {
        setIconPositions((positions) => ({
          ...positions,
          [drag.id]: nearestFreeGridPosition(drag.id, positions[drag.id]?.x ?? drag.originX, positions[drag.id]?.y ?? drag.originY, positions),
        }));
        playSound("click");
      }
    },
    [iconClick, playSound],
  );

  const arrangeIcons = useCallback(() => {
    setIconPositions(initialIconPositions());
    setContextMenu(null);
    playSound("click");
  }, [playSound]);

  const lineUpIcons = useCallback(() => {
    const orderedIds = desktopIcons
      .map((icon) => icon.id)
      .sort((a, b) => {
        const aPosition = iconPositions[a] ?? { x: 0, y: 0 };
        const bPosition = iconPositions[b] ?? { x: 0, y: 0 };
        return aPosition.x - bPosition.x || aPosition.y - bPosition.y;
      });
    setIconPositions(iconGridPositions(orderedIds));
    setContextMenu(null);
    playSound("click");
  }, [iconPositions, playSound]);

  const refreshDesktop = useCallback(() => {
    setContextMenu(null);
    setSelectedIcon(null);
    notify("Desktop refreshed.");
  }, [notify]);

  const showProperties = useCallback(() => {
    if (contextMenu?.target) {
      const icon = desktopIcons.find((item) => item.id === contextMenu.target);
      notify(`${icon?.label ?? "Shortcut"} properties are not installed.`);
    } else {
      openWindow("settings");
    }
    setContextMenu(null);
  }, [contextMenu, notify, openWindow]);

  const renderWindow = (props: WindowComponentProps) => {
    switch (props.window.id) {
      case "about":
        return <AboutWindow {...props} />;
      case "calculator":
        return <CalculatorWindow {...props} />;
      case "computer":
        return <ComputerWindow {...props} />;
      case "projects":
        return <ProjectsWindow {...props} />;
      case "project-details":
        return <ProjectDetailsWindow {...props} />;
      case "internet":
        return <InternetWindow {...props} onConnected={handleDialupConnected} />;
      case "ie-browser":
        return <IEBrowserWindow {...props} />;
      case "netscape":
        return <NetscapeWindow {...props} />;
      case "msdos":
        return <MsDosWindow {...props} />;
      case "mediaplayer":
        return <MediaPlayerWindow {...props} />;
      case "minesweeper":
        return <MinesweeperWindow {...props} />;
      case "games":
        return <GamesWindow {...props} />;
      case "doom":
        return <DoomWindow {...props} />;
      case "music":
        return <MusicWindow {...props} />;
      case "norton":
        return <NortonCommanderWindow {...props} />;
      case "notepad":
        return <NotepadWindow {...props} />;
      case "outlook":
        return <OutlookWindow {...props} />;
      case "paint":
        return <PaintWindow />;
      case "run":
        return <RunWindow {...props} />;
      case "settings":
        return <SettingsWindow {...props} />;
      case "share":
        return <ShareWindow {...props} />;
      case "defrag":
        return <DefragWindow {...props} />;
      case "documents":
        return <DocumentsWindow {...props} />;
      case "recycle-bin":
        return <RecycleBinWindow {...props} />;
      case "screensaver":
        return <ScreensaverWindow {...props} />;
      default:
        return null;
    }
  };

  // Play pending startup sound on first user interaction with desktop
  useEffect(() => {
    if (!pendingStartup) return;
    const play = () => {
      playSound("startup");
      setPendingStartup(false);
    };
    window.addEventListener("pointerdown", play, { once: true });
    window.addEventListener("keydown", play, { once: true });
    return () => {
      window.removeEventListener("pointerdown", play);
      window.removeEventListener("keydown", play);
    };
  }, [pendingStartup, playSound]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContextMenu(null);
        setStartOpen(false);
      }
      if (event.ctrlKey && event.key === "Escape") {
        event.preventDefault();
        setStartOpen((value) => !value);
      }
      if (event.altKey && event.key === "F4" && wm.activeWindow) {
        event.preventDefault();
        wm.closeWindow(wm.activeWindow.instanceId);
        playSound("close");
      }
      if (event.key === "Enter" && selectedIcon) {
        const icon = desktopIcons.find((item) => item.id === selectedIcon);
        if (icon?.windowId) openWindow(icon.windowId, icon.payload);
        else if (icon?.message) notify(icon.message);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [notify, openWindow, playSound, selectedIcon, wm]);

  const commonProps = useMemo(
    () => ({
      openWindow,
      closeWindow: (instanceId: string) => {
        wm.closeWindow(instanceId);
        playSound("close");
      },
      minimizeWindow: wm.minimizeWindow,
      notify,
      playSound,
      fadeOutSound,
      startScreensaver: screensaver.start,
      internetConnected: dialupDone,
    }),
    [notify, openWindow, playSound, fadeOutSound, screensaver.start, wm, dialupDone],
  );

  if (!booted) {
    return (
      <BootScreen
        onComplete={(mode) => {
          setBootMode(mode);
          setBooted(true);
          setPendingStartup(true);
        }}
        playSound={playSound}
      />
    );
  }

  const isSafeMode = bootMode === "safe";

  return (
    <main
      className={`h-screen w-screen overflow-hidden pb-[28px] ${isSafeMode ? "bg-[#008080]" : "floppyy-wallpaper"}`}
      onClick={() => {
        setContextMenu(null);
        setStartOpen(false);
        setSelectedIcon(null);
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        setContextMenu({ x: event.clientX, y: event.clientY });
      }}
    >
      <div className="relative h-[calc(100vh-28px)]">
        {desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            label={icon.label}
            icon={icon.icon}
            selected={selectedIcon === icon.id}
            x={iconPositions[icon.id]?.x ?? DESKTOP_PADDING}
            y={iconPositions[icon.id]?.y ?? DESKTOP_PADDING}
            onPointerDown={(event) => {
              if (event.button !== 0) return;
              event.preventDefault();
              event.stopPropagation();
              setContextMenu(null);
              setStartOpen(false);
              setSelectedIcon(icon.id);
              const position = iconPositions[icon.id] ?? { x: DESKTOP_PADDING, y: DESKTOP_PADDING };
              iconDrag.current = {
                id: icon.id,
                startX: event.clientX,
                startY: event.clientY,
                originX: position.x,
                originY: position.y,
                moved: false,
              };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={moveIcon}
            onPointerUp={releaseIcon}
            onContextMenu={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setSelectedIcon(icon.id);
              setContextMenu({ x: event.clientX, y: event.clientY, target: icon.id });
            }}
          />
        ))}
      </div>

      {wm.windows.map((item) => {
        // Winamp renders without standard Windows frame
        if (item.id === "music") {
          return (
            <div
              key={item.instanceId}
              className={`fixed ${item.minimized ? "hidden" : ""}`}
              style={{
                left: item.maximized ? 0 : item.x,
                top: item.maximized ? 0 : item.y,
                zIndex: item.zIndex,
              }}
              onPointerDown={() => wm.focusWindow(item.instanceId)}
              onPointerMove={(event) => {
                if (!winampDrag.current) return;
                wm.moveWindow(
                  winampDrag.current.instanceId,
                  event.clientX - winampDrag.current.dx,
                  event.clientY - winampDrag.current.dy,
                );
              }}
              onPointerUp={() => {
                winampDrag.current = null;
              }}
            >
              <div
                className="relative"
                onPointerDown={(event) => {
                  const target = event.target as HTMLElement;
                  if (target.closest("button,input")) return;
                  if (!target.closest(".winamp-titlebar,.winamp-eq-titlebar,.winamp-pl-titlebar")) return;
                  event.stopPropagation();
                  wm.focusWindow(item.instanceId);
                  winampDrag.current = {
                    instanceId: item.instanceId,
                    dx: event.clientX - item.x,
                    dy: event.clientY - item.y,
                  };
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
              >
                {renderWindow({ window: item, ...commonProps })}
              </div>
            </div>
          );
        }

        return (
          <WindowFrame
            key={item.instanceId}
            window={item}
            active={wm.activeWindow?.instanceId === item.instanceId}
            onFocus={() => wm.focusWindow(item.instanceId)}
            onClose={() => {
              wm.closeWindow(item.instanceId);
              playSound("close");
            }}
            onMinimize={() => wm.minimizeWindow(item.instanceId)}
            onMaximize={() => wm.maximizeWindow(item.instanceId)}
            onMove={(x, y) => wm.moveWindow(item.instanceId, x, y)}
            onResize={(width, height) => wm.resizeWindow(item.instanceId, width, height)}
          >
            {renderWindow({ window: item, ...commonProps })}
          </WindowFrame>
        );
      })}

      {startOpen && (
        <StartMenu
          onOpen={openWindow}
          onScreensaver={() => {
            setStartOpen(false);
            screensaver.start("stars");
          }}
          onShutdown={() => {
            setStartOpen(false);
            setShutdownOpen(true);
          }}
        />
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          target={contextMenu.target}
          onOpen={() => {
            const icon = desktopIcons.find((item) => item.id === contextMenu.target);
            if (icon?.windowId) {
              openWindow(icon.windowId, icon.payload);
            } else {
              notify(icon?.message ?? "Desktop properties are feeling nostalgic.");
            }
          }}
          onArrangeIcons={arrangeIcons}
          onLineUpIcons={lineUpIcons}
          onRefresh={refreshDesktop}
          onProperties={showProperties}
          onClose={() => setContextMenu(null)}
        />
      )}

      {notification && <NotificationBalloon message={notification} />}

      <Taskbar
        windows={wm.windows}
        activeId={wm.activeWindow?.instanceId}
        startOpen={startOpen}
        internetConnected={dialupDone}
        muted={muted}
        onStart={() => {
          setStartOpen((value) => !value);
          playSound("click");
        }}
        onTask={(instanceId) => wm.focusWindow(instanceId)}
        onDisconnectRequest={() => {
          setDisconnectOpen(true);
          playSound("click");
        }}
        onMcAfeeOpen={() => {
          setMcAfeeOpen(true);
          playSound("open");
        }}
        onToggleMute={() => setMuted((value) => !value)}
        onQuickLaunch={handleQuickLaunch}
        onShowDesktop={handleShowDesktop}
      />

      {shutdownOpen && (
        <ShutDownOverlay
          safe={safeToTurnOff}
          onRestart={() => {
            playSound("shutdown");
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }}
          onShutdown={() => {
            playSound("shutdown");
            setSafeToTurnOff(true);
          }}
          onCancel={() => setShutdownOpen(false)}
        />
      )}

      {disconnectOpen && (
        <DisconnectDialog
          onCancel={() => setDisconnectOpen(false)}
          onDisconnect={() => {
            setDialupDone(false);
            setDisconnectOpen(false);
            notify("Disconnected from Floppyy Net.");
          }}
        />
      )}

      {mcAfeeOpen && (
        <McAfeePropertiesDialog
          onClose={() => {
            setMcAfeeOpen(false);
            playSound("close");
          }}
        />
      )}

      {screensaver.active && <ScreensaverOverlay mode={screensaver.mode} onExit={screensaver.stop} />}

      {isSafeMode && (
        <>
          <div className="fixed top-1 left-2 text-[#ffff00] font-bold text-[12px] font-mono pointer-events-none z-9999">Safe Mode</div>
          <div className="fixed top-1 right-2 text-[#ffff00] font-bold text-[12px] font-mono pointer-events-none z-9999">Safe Mode</div>
          <div className="fixed bottom-[30px] left-2 text-[#ffff00] font-bold text-[12px] font-mono pointer-events-none z-9999">Safe Mode</div>
          <div className="fixed bottom-[30px] right-2 text-[#ffff00] font-bold text-[12px] font-mono pointer-events-none z-9999">Safe Mode</div>
        </>
      )}
    </main>
  );
}

function McAfeePropertiesDialog({ onClose }: { onClose: () => void }) {
  const navItems = [
    "System Scan",
    "E-Mail Scan",
    "Download Scan",
    "Internet Filter",
    "Security",
  ];

  return (
    <div className="fixed inset-0 z-[7300] flex items-center justify-center" onClick={onClose}>
      <div
        className="w-[468px] bg-[#c0c0c0] p-[3px]"
        style={{
          boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-[18px] items-center justify-between bg-gradient-to-r from-[#000080] to-[#1084d0] px-[4px]">
          <span className="text-[11px] font-bold text-white">McAffee Virus Scan</span>
          <div className="flex gap-[2px]">
            <button className="win-button flex h-[13px] w-[15px] items-center justify-center p-0 text-[9px] leading-none" style={{ minHeight: 0 }}>?</button>
            <button className="win-button flex h-[13px] w-[15px] items-center justify-center p-0 text-[9px] leading-none" style={{ minHeight: 0 }} onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div className="flex gap-[8px] p-[8px] pb-[6px]">
          <aside
            className="flex w-[90px] shrink-0 flex-col items-center gap-[8px] bg-white p-[6px]"
            style={{ boxShadow: "inset -1px -1px #ffffff, inset 1px 1px #0a0a0a" }}
          >
            {navItems.map((item) => (
              <button
                key={item}
                className={`flex w-full flex-col items-center gap-[2px] px-[2px] py-[1px] text-center text-[11px] ${
                  item === "Download Scan" ? "bg-[#c0c0c0]" : ""
                }`}
              >
                <img src="/icons/McAfee.png" alt="" width={32} height={32} draggable={false} style={{ imageRendering: "pixelated" }} />
                <span>{item}</span>
              </button>
            ))}
          </aside>

          <section className="min-w-0 flex-1">
            <div className="flex h-[24px] items-center px-[2px]">
              <span className="text-[13px] font-bold">McAfee 4.0</span>
            </div>
            <div
              className="min-h-[330px] bg-[#c0c0c0] p-[10px]"
              style={{ boxShadow: "inset -1px -1px #404040, inset 1px 1px #ffffff" }}
            >
              <div className="mb-[12px] flex items-start gap-[10px]">
                <img src="/icons/McAfee.png" alt="" width={38} height={38} draggable={false} style={{ imageRendering: "pixelated" }} />
                <p className="text-[11px] leading-[14px]">
                  Enable scanning of files downloaded from the Internet, and specify the types of files to scan.
                  Right click on &quot;Program files only&quot; for more information.
                </p>
              </div>

              <label className="mb-[8px] flex items-center gap-[6px] text-[11px]">
                <input type="checkbox" checked readOnly />
                <span>Enable Internet download scanning</span>
              </label>

              <fieldset className="min-h-[235px] border border-[#808080] px-[10px] pb-[10px] pt-[8px]">
                <legend className="px-[4px]">What to scan</legend>
                <label className="mb-[7px] flex items-center gap-[6px] text-[11px]">
                  <input type="radio" checked readOnly />
                  <span>All files</span>
                </label>
                <div className="mb-[12px] flex items-center gap-[8px]">
                  <label className="flex items-center gap-[6px] text-[11px]">
                    <input type="radio" readOnly />
                    <span>Program files only</span>
                  </label>
                  <button className="win-button min-w-[72px] text-[#808080]">Extensions...</button>
                </div>
                <label className="flex items-center gap-[6px] text-[11px]">
                  <input type="checkbox" checked readOnly />
                  <span>Scan compressed files</span>
                </label>
                <div className="mt-[102px] flex justify-end">
                  <button className="win-button min-w-[74px]">Advanced...</button>
                </div>
              </fieldset>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between px-[8px] pb-[8px]">
          <button className="win-button min-w-[88px]">Wizard...</button>
          <div className="flex gap-[6px]">
            <button className="win-button min-w-[74px]" onClick={onClose}>OK</button>
            <button className="win-button min-w-[74px]" onClick={onClose}>Cancel</button>
            <button className="win-button min-w-[74px]">Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DisconnectDialog({
  onCancel,
  onDisconnect,
}: {
  onCancel: () => void;
  onDisconnect: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[7200] flex items-center justify-center" onClick={onCancel}>
      <div
        className="w-[330px] bg-[#c0c0c0] p-[3px]"
        style={{
          boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-[18px] items-center justify-between bg-gradient-to-r from-[#000080] to-[#1084d0] px-[4px]">
          <span className="text-[11px] font-bold text-white">Disconnect Floppyy Net</span>
          <button className="win-button flex h-[14px] min-h-0 w-[16px] items-center justify-center p-0 text-[10px]" onClick={onCancel}>
            ×
          </button>
        </div>
        <div className="flex gap-[12px] p-[14px]">
          <img
            src="/icons/connection.png"
            alt=""
            width={32}
            height={32}
            draggable={false}
            style={{ imageRendering: "pixelated" }}
          />
          <div className="text-[11px] leading-[15px]">
            <p className="mb-[8px]">You are currently connected to Floppyy Net.</p>
            <p>Do you want to disconnect now?</p>
          </div>
        </div>
        <div className="flex justify-end gap-[6px] px-[10px] pb-[10px]">
          <button className="win-button min-w-[82px] font-bold" onClick={onDisconnect}>
            Disconnect
          </button>
          <button className="win-button min-w-[70px]" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

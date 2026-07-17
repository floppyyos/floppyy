"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DesktopWindow, WindowId, windowDefinitions } from "@/lib/windows";

const STORAGE_KEY = "floppyy-windows";
const SAVE_DEBOUNCE_MS = 400;
const TALL_MOBILE_WINDOWS = new Set<WindowId>(["internet", "screensaver", "share", "solitaire"]);
const COMPACT_MOBILE_WINDOWS = new Set<WindowId>([
  "minesweeper",
  "snake",
  "tetris",
  "breakout",
  "pixel-puzzle",
  "typing-game",
  "checkers",
]);

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function loadPersistedWindows(): DesktopWindow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    return parsed.flatMap((entry): DesktopWindow[] => {
      if (!entry || typeof entry !== "object") return [];
      const item = entry as Partial<DesktopWindow>;
      const definition = item.id ? windowDefinitions[item.id] : undefined;
      if (!definition || definition.ephemeral) return [];
      if (typeof item.instanceId !== "string") return [];
      if (
        typeof item.x !== "number" ||
        typeof item.y !== "number" ||
        typeof item.width !== "number" ||
        typeof item.height !== "number"
      ) {
        return [];
      }

      const mobile = viewportWidth < 640;
      const mobileHeightLimit = TALL_MOBILE_WINDOWS.has(definition.id)
        ? Math.round(viewportHeight * 0.9)
        : Math.round(viewportHeight * 0.72);
      const maxWidth = mobile && COMPACT_MOBILE_WINDOWS.has(definition.id)
        ? Math.min(definition.width, Math.max(200, viewportWidth - 16))
        : Math.max(200, viewportWidth - 16);
      const maxHeight = mobile
        ? Math.min(definition.height, Math.max(120, viewportHeight - 42), Math.max(320, mobileHeightLimit))
        : Math.max(120, viewportHeight - 42);
      const minWidth = Math.min(definition.minWidth ?? 200, maxWidth);
      const minHeight = Math.min(definition.minHeight ?? 120, maxHeight);
      const width = clamp(item.width, minWidth, maxWidth);
      const height = clamp(item.height, minHeight, maxHeight);
      return [
        {
          instanceId: item.instanceId,
          id: item.id as WindowId,
          title: typeof item.title === "string" ? item.title : definition.title,
          icon: typeof item.icon === "string" ? item.icon : definition.icon,
          x: clamp(item.x, 0, Math.max(0, viewportWidth - 80)),
          y: clamp(item.y, 0, Math.max(0, viewportHeight - 60)),
          width,
          height,
          minimized: Boolean(item.minimized),
          maximized: Boolean(item.maximized),
          zIndex: typeof item.zIndex === "number" ? item.zIndex : 10,
          payload: typeof item.payload === "string" ? item.payload : undefined,
        },
      ];
    });
  } catch {
    return [];
  }
}

export function useWindowManager() {
  const [windows, setWindows] = useState<DesktopWindow[]>(loadPersistedWindows);
  const [zCounter, setZCounter] = useState(() => windows.reduce((max, item) => Math.max(max, item.zIndex), 10));

  const nextZ = useCallback(() => {
    const z = zCounter + 1;
    setZCounter(z);
    return z;
  }, [zCounter]);

  const focusWindow = useCallback((instanceId: string) => {
    setWindows((items) => {
      const maxZ = Math.max(10, ...items.map((item) => item.zIndex)) + 1;
      setZCounter(maxZ);
      return items.map((item) => (item.instanceId === instanceId ? { ...item, zIndex: maxZ, minimized: false } : item));
    });
  }, []);

  const openWindow = useCallback(
    (id: WindowId, payload?: string) => {
      const definition = windowDefinitions[id];
      const title =
        id === "paint" && payload === "clouds"
          ? "Clouds.bmp - Paint"
          : id === "notepad" && payload === "readme"
            ? "README.txt - Notepad"
            : definition.title;
      const instanceId =
        (id === "project-details" || id === "drive") && payload ? `${id}-${payload}` : id;
      setWindows((items) => {
        const existing = items.find((item) => item.instanceId === instanceId);
        const maxZ = Math.max(10, ...items.map((item) => item.zIndex)) + 1;
        setZCounter(maxZ);
        if (existing) {
          return items.map((item) =>
            item.instanceId === instanceId ? { ...item, title, minimized: false, zIndex: maxZ, payload } : item,
          );
        }
        const offset = items.length * 26;
        const viewportWidth = typeof window === "undefined" ? 1024 : window.innerWidth;
        const viewportHeight = typeof window === "undefined" ? 768 : window.innerHeight;
        const mobile = viewportWidth < 640;
        const width = mobile
          ? COMPACT_MOBILE_WINDOWS.has(id)
            ? Math.min(definition.width, viewportWidth - 16)
            : viewportWidth - 16
          : Math.min(definition.width, viewportWidth - 32);
        const mobileHeightLimit = TALL_MOBILE_WINDOWS.has(id)
          ? Math.round(viewportHeight * 0.9)
          : Math.round(viewportHeight * 0.72);
        const height = mobile
          ? Math.min(definition.height, Math.max(320, mobileHeightLimit), viewportHeight - 42)
          : Math.min(definition.height, viewportHeight - 42);
        return [
          ...items,
          {
            instanceId,
            id,
            title:
              payload && id === "project-details"
                ? "Project Details"
                : payload && id === "mediaplayer"
                  ? payload
                  : payload && id === "drive"
                    ? payload === "A"
                      ? "3½ Floppy (A:)"
                      : payload === "D"
                      ? "(D:)"
                      : "(C:)"
                    : title,
            icon: payload && id === "drive" ? (payload === "A" ? "floppy" : `drive-${payload.toLowerCase()}`) : definition.icon,
            x: mobile ? 8 : clamp(80 + offset, 8, viewportWidth - width - 8),
            y: mobile ? 8 : clamp(40 + offset, 8, viewportHeight - height - 36),
            width,
            height,
            minimized: false,
            maximized: false,
            zIndex: maxZ,
            payload,
          },
        ];
      });
    },
    [],
  );

  const closeWindow = useCallback((instanceId: string) => {
    setWindows((items) => items.filter((item) => item.instanceId !== instanceId));
  }, []);

  const minimizeWindow = useCallback((instanceId: string) => {
    setWindows((items) => items.map((item) => (item.instanceId === instanceId ? { ...item, minimized: true } : item)));
  }, []);

  const maximizeWindow = useCallback((instanceId: string) => {
    setWindows((items) =>
      items.map((item) =>
        item.instanceId === instanceId ? { ...item, maximized: !item.maximized, minimized: false } : item,
      ),
    );
  }, []);

  const moveWindow = useCallback((instanceId: string, x: number, y: number) => {
    setWindows((items) =>
      items.map((item) =>
        item.instanceId === instanceId
          ? {
              ...item,
              x: clamp(x, 0, window.innerWidth - 80),
              y: clamp(y, 0, window.innerHeight - 60),
            }
          : item,
      ),
    );
  }, []);

  const resizeWindow = useCallback((instanceId: string, width: number, height: number) => {
    setWindows((items) =>
      items.map((item) => {
        if (item.instanceId !== instanceId) return item;
        const definition = windowDefinitions[item.id];
        const maxWidth = Math.max(200, window.innerWidth - item.x);
        const maxHeight = Math.max(120, window.innerHeight - item.y - 28);
        const minWidth = Math.min(definition.minWidth ?? 260, maxWidth);
        const minHeight = Math.min(definition.minHeight ?? 180, maxHeight);
        return {
          ...item,
          width: clamp(width, minWidth, maxWidth),
          height: clamp(height, minHeight, maxHeight),
          maximized: false,
        };
      }),
    );
  }, []);

  const minimizeAll = useCallback(() => {
    setWindows((items) => items.map((item) => ({ ...item, minimized: true })));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const timer = window.setTimeout(() => {
      try {
        const toSave = windows.filter((item) => !windowDefinitions[item.id]?.ephemeral);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch {
        /* ignore quota/serialization errors */
      }
    }, SAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [windows]);

  const activeWindow = useMemo(
    () =>
      windows
        .filter((item) => !item.minimized)
        .slice()
        .sort((a, b) => b.zIndex - a.zIndex)[0],
    [windows],
  );

  return useMemo(
    () => ({
      windows,
      activeWindow,
      openWindow,
      closeWindow,
      minimizeWindow,
      minimizeAll,
      maximizeWindow,
      moveWindow,
      resizeWindow,
      focusWindow,
      nextZ,
    }),
    [
      windows,
      activeWindow,
      openWindow,
      closeWindow,
      minimizeWindow,
      minimizeAll,
      maximizeWindow,
      moveWindow,
      resizeWindow,
      focusWindow,
      nextZ,
    ],
  );
}

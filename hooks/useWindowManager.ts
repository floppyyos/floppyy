"use client";

import { useCallback, useMemo, useState } from "react";
import { DesktopWindow, WindowId, windowDefinitions } from "@/lib/windows";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function useWindowManager() {
  const [windows, setWindows] = useState<DesktopWindow[]>([]);
  const [zCounter, setZCounter] = useState(10);

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
      const instanceId = id === "project-details" && payload ? `${id}-${payload}` : id;
      setWindows((items) => {
        const existing = items.find((item) => item.instanceId === instanceId);
        const maxZ = Math.max(10, ...items.map((item) => item.zIndex)) + 1;
        setZCounter(maxZ);
        if (existing) {
          return items.map((item) =>
            item.instanceId === instanceId ? { ...item, minimized: false, zIndex: maxZ, payload } : item,
          );
        }
        const offset = items.length * 26;
        const viewportWidth = typeof window === "undefined" ? 1024 : window.innerWidth;
        const viewportHeight = typeof window === "undefined" ? 768 : window.innerHeight;
        const mobile = viewportWidth < 640;
        const width = mobile ? viewportWidth - 16 : Math.min(definition.width, viewportWidth - 32);
        const height = mobile
          ? Math.min(definition.height, Math.round(viewportHeight * 0.72))
          : Math.min(definition.height, viewportHeight - 42);
        return [
          ...items,
          {
            instanceId,
            id,
            title: payload && id === "project-details" ? "Project Details" : payload && id === "mediaplayer" ? `Windows Media Player - ${payload}` : definition.title,
            icon: definition.icon,
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
        const minWidth = definition.minWidth ?? 260;
        const minHeight = definition.minHeight ?? 180;
        return {
          ...item,
          width: clamp(width, minWidth, window.innerWidth - item.x),
          height: clamp(height, minHeight, window.innerHeight - item.y - 28),
          maximized: false,
        };
      }),
    );
  }, []);

  const minimizeAll = useCallback(() => {
    setWindows((items) => items.map((item) => ({ ...item, minimized: true })));
  }, []);

  const activeWindow = useMemo(
    () =>
      windows
        .filter((item) => !item.minimized)
        .slice()
        .sort((a, b) => b.zIndex - a.zIndex)[0],
    [windows],
  );

  return {
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
  };
}

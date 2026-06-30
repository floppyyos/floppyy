"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { soundFiles, toneMap } from "@/lib/sounds";

export function useSound() {
  const [enabled, setEnabled] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioContext = useRef<AudioContext | null>(null);
  const audioCache = useRef<Record<string, HTMLAudioElement>>({});
  const fadeTimers = useRef<Set<ReturnType<typeof setInterval>>>(new Set());

  // Load persisted sound settings once on mount (client only).
  useEffect(() => {
    try {
      const m = globalThis.localStorage.getItem("floppyy-muted");
      if (m !== null) setMuted(m === "1");
      const v = globalThis.localStorage.getItem("floppyy-volume");
      if (v !== null) {
        const n = Number(v);
        if (!Number.isNaN(n)) setVolume(Math.min(1, Math.max(0, n)));
      }
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  useEffect(() => {
    try {
      globalThis.localStorage.setItem("floppyy-muted", muted ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [muted]);

  useEffect(() => {
    try {
      globalThis.localStorage.setItem("floppyy-volume", String(volume));
    } catch {
      /* ignore */
    }
  }, [volume]);

  useEffect(() => {
    const enable = () => setEnabled(true);
    const timers = fadeTimers.current;
    window.addEventListener("pointerdown", enable, { once: true });
    window.addEventListener("keydown", enable, { once: true });
    return () => {
      window.removeEventListener("pointerdown", enable);
      window.removeEventListener("keydown", enable);

      timers.forEach((timer) => clearInterval(timer));
      timers.clear();
    };
  }, []);

  // Apply mute + volume globally to every media element on the page,
  // including ones mounted later (Winamp, Media Player, games, etc.).
  useEffect(() => {
    if (typeof document === "undefined") return;

    const applyTo = (node: Node) => {
      if (node instanceof HTMLMediaElement) {
        node.muted = muted;
        node.volume = volume;
      } else if (node instanceof Element) {
        node.querySelectorAll("audio, video").forEach((el) => {
          (el as HTMLMediaElement).muted = muted;
          (el as HTMLMediaElement).volume = volume;
        });
      }
    };

    applyTo(document.body);

    // Also cover the in-memory audio elements used for UI sound effects.
    Object.values(audioCache.current).forEach((audio) => {
      audio.muted = muted;
      audio.volume = volume;
    });

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach(applyTo);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [muted, volume]);

  const playTone = useCallback((name: string) => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioContext.current ??= new AudioContextClass();
    const context = audioContext.current;
    const [a, b, type] = toneMap[name] ?? toneMap.click;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.05, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.18);
    gain.connect(context.destination);

    [a, b].filter(Boolean).forEach((frequency, index) => {
      const osc = context.createOscillator();
      osc.type = type;
      osc.frequency.value = frequency;
      osc.connect(gain);
      osc.start(context.currentTime + index * 0.055);
      osc.stop(context.currentTime + 0.18 + index * 0.055);
    });
  }, []);

  const playSound = useCallback(
    (name: string) => {
      if (!enabled || muted) return;
      const src = soundFiles[name];
      if (src) {
        audioCache.current[name] ??= new Audio(src);
        const audio = audioCache.current[name];
        audio.currentTime = 0;
        audio.volume = volume;
        audio.play().catch(() => playTone(name));
        return;
      }
      playTone(name);
    },
    [enabled, muted, volume, playTone],
  );

  const fadeOutSound = useCallback(
    (name: string, duration = 1000) => {
      const audio = audioCache.current[name];
      if (!audio || audio.paused) return;
      const steps = 20;
      const interval = duration / steps;
      const volumeStep = audio.volume / steps;
      const timer = setInterval(() => {
        if (audio.volume - volumeStep <= 0) {
          audio.volume = 0;
          audio.pause();
          clearInterval(timer);
          fadeTimers.current.delete(timer);
        } else {
          audio.volume -= volumeStep;
        }
      }, interval);
      fadeTimers.current.add(timer);
    },
    [],
  );

  return { playSound, fadeOutSound, muted, setMuted, volume, setVolume, enabled };
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

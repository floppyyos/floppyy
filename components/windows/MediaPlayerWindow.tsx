"use client";

import { useRef, useState, useCallback } from "react";
import type { WindowComponentProps } from "@/lib/windows";

export function MediaPlayerWindow({ window: win }: WindowComponentProps) {
  const hasVideo = !!win.payload;
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume] = useState(70);
  const [useEmbed, setUseEmbed] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    setMuted(false);
    video.play().catch(() => {
      // If unmuted play fails, switch to YouTube embed
      setUseEmbed(true);
    });
  }, []);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
  }, []);

  const stop = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    setProgress(0);
    setCurrentTime(0);
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const ct = video.currentTime;
    const dur = video.duration || 0;
    setCurrentTime(ct);
    setDuration(dur);
    setProgress(dur > 0 ? (ct / dur) * 100 : 0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = pct * video.duration;
  };

  const handleVideoError = () => {
    // If local video fails to load, switch to YouTube embed
    setVideoError(true);
    setUseEmbed(true);
  };

  // YouTube embed URL (Rick Astley - Never Gonna Give You Up)
  const youtubeEmbedUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0";

  return (
    <div className="flex flex-col h-full" style={{ background: "#c0c0c0" }}>
      {/* Menu bar */}
      <div className="window-menu-bar">
        <button className="window-menu-item">File</button>
        <button className="window-menu-item">View</button>
        <button className="window-menu-item">Play</button>
        <button className="window-menu-item">Navigate</button>
        <button className="window-menu-item">Favorites</button>
        <button className="window-menu-item">Help</button>
      </div>

      {/* Video/Display area */}
      <div className="flex-1 flex items-center justify-center mx-[3px] mt-[3px] relative overflow-hidden min-h-0" style={{ background: "#000" }}>
        {hasVideo ? (
          useEmbed || videoError ? (
            /* YouTube embed fallback */
            <iframe
              src={youtubeEmbedUrl}
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Rick Astley - Never Gonna Give You Up"
            />
          ) : (
            /* Native video player */
            <>
              <video
                ref={videoRef}
                autoPlay
                muted={muted}
                playsInline
                loop
                preload="auto"
                className="w-full h-full object-contain cursor-pointer"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.muted = false;
                    setMuted(false);
                  }
                }}
                onTimeUpdate={handleTimeUpdate}
                onCanPlay={() => {
                  if (videoRef.current) {
                    setDuration(videoRef.current.duration);
                  }
                }}
                onLoadedMetadata={() => {
                  if (videoRef.current) setDuration(videoRef.current.duration);
                }}
                onError={handleVideoError}
                onStalled={() => {
                  setTimeout(() => {
                    if (videoRef.current && videoRef.current.readyState < 3) {
                      setUseEmbed(true);
                    }
                  }, 5000);
                }}
              >
                <source src="/video/never-gonna-give-you-up.mp4" type="video/mp4" />
              </video>
              {muted && (
                <div
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 text-[11px] cursor-pointer"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = false;
                      setMuted(false);
                    }
                  }}
                  style={{
                    background: "rgba(0,0,0,0.7)",
                    color: "#fff",
                    borderRadius: "3px",
                  }}
                >
                  🔊 Click to enable sound
                </div>
              )}
            </>
          )
        ) : (
          <div className="relative">
            <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
              <g transform="translate(20, 10) rotate(-5)">
                <rect x="0" y="0" width="35" height="35" fill="#ff0000" rx="2" transform="skewY(-5) skewX(-3)" />
                <rect x="40" y="0" width="35" height="35" fill="#00b800" rx="2" transform="skewY(-5) skewX(-3)" />
                <rect x="0" y="40" width="35" height="35" fill="#0000ff" rx="2" transform="skewY(-5) skewX(-3)" />
                <rect x="40" y="40" width="35" height="35" fill="#ffb800" rx="2" transform="skewY(-5) skewX(-3)" />
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* Track info bar */}
      <div
        className="flex items-center h-[20px] mx-[3px] mt-[3px] px-2 text-[10px]"
        style={{ background: "#fff", boxShadow: "inset 1px 1px #808080, inset -1px -1px #dfdfdf" }}
      >
        <span className="text-[11px] mr-1">🎬</span>
        <span className="truncate flex-1" style={{ color: "#000" }}>{win.payload || "Windows Media Player"}</span>
        {hasVideo && !useEmbed && duration > 0 && (
          <span className="text-[9px] ml-2 shrink-0" style={{ color: "#808080" }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        )}
      </div>

      {/* Transport controls */}
      <div className="flex items-center gap-[2px] mx-[3px] mt-[3px] mb-[2px] px-[2px] h-[26px]">
        <button
          onClick={useEmbed ? undefined : play}
          className="win-button w-[26px] h-[22px] flex items-center justify-center text-[12px]"
          title="Play"
          style={{ background: "#c0c0c0" }}
        >
          ▶
        </button>
        <button
          onClick={useEmbed ? undefined : pause}
          className="win-button w-[26px] h-[22px] flex items-center justify-center text-[11px]"
          title="Pause"
          style={{ background: "#c0c0c0" }}
        >
          ⏸
        </button>
        <button
          onClick={useEmbed ? undefined : stop}
          className="win-button w-[26px] h-[22px] flex items-center justify-center text-[11px]"
          title="Stop"
          style={{ background: "#c0c0c0" }}
        >
          ⏹
        </button>

        <div className="flex-1" />

        {/* Volume */}
        <span className="text-[12px] ml-1">🔊</span>
        <div className="w-[60px] h-[6px] ml-1 relative" style={{ border: "1px solid #808080", background: "#fff" }}>
          <div className="h-full" style={{ width: `${volume}%`, background: "#000080" }} />
        </div>
      </div>

      {/* Seek/Progress bar */}
      {!useEmbed && (
        <div
          className="mx-[3px] mb-[3px] h-[10px] cursor-pointer relative"
          style={{ boxShadow: "inset 1px 1px #808080, inset -1px -1px #dfdfdf", background: "#000" }}
          onClick={handleSeek}
        >
          <div
            className="h-full"
            style={{ width: `${progress}%`, background: "linear-gradient(to right, #000080, #1084d0)", transition: "width 0.1s" }}
          />
        </div>
      )}
    </div>
  );
}

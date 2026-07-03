"use client";

import { useEffect, useState } from "react";
import type { WinampTrack } from "./WinampPlayer";

type Props = {
  tracks: WinampTrack[];
  currentTrack: number;
  onSelect: (index: number) => void;
  elapsed: number;
  totalTime: string;
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function WinampPlaylist({ tracks, currentTrack, onSelect, elapsed, totalTime }: Props) {
  // Single click highlights a row; double click actually plays it (like real Winamp).
  const [selected, setSelected] = useState(currentTrack);
  useEffect(() => setSelected(currentTrack), [currentTrack]);

  return (
    <div className="winamp-pl w-[275px] mt-0">
      <div className="winamp-pl-titlebar flex items-center justify-between h-[14px] px-[3px]">
        <span className="text-[8px] font-bold tracking-wider winamp-text-green">WINAMP PLAYLIST</span>
        <button className="winamp-tiny-btn" aria-label="Close Playlist">×</button>
      </div>

      <div className="winamp-pl-body">
        <div className="winamp-pl-list">
          {tracks.map((track, index) => (
            <button
              key={index}
              className={`winamp-pl-item ${index === selected ? "active" : ""} ${index === currentTrack ? "playing" : ""}`}
              onClick={() => setSelected(index)}
              onDoubleClick={() => {
                setSelected(index);
                onSelect(index);
              }}
            >
              <span className="winamp-pl-item-num">{index + 1}.</span>
              <span className="winamp-pl-item-title truncate">
                {track.artist} - {track.title}
              </span>
              <span className="winamp-pl-item-duration">
                {formatDuration(track.duration)}
              </span>
            </button>
          ))}
        </div>

        <div className="winamp-pl-controls">
          <div className="flex gap-[2px]">
            <button className="winamp-pl-btn">ADD</button>
            <button className="winamp-pl-btn">REM</button>
            <button className="winamp-pl-btn">SEL</button>
            <button className="winamp-pl-btn">MISC</button>
          </div>

          <div className="winamp-pl-time font-mono">
            <span className="winamp-text-green text-[9px]">
              {formatDuration(elapsed)}/{totalTime}
            </span>
          </div>

          <div className="flex gap-[2px]">
            <button className="winamp-pl-btn">LIST OPTS</button>
          </div>
        </div>
      </div>
    </div>
  );
}

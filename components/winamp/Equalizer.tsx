"use client";

import { useRef } from "react";

type Props = {
  on: boolean;
  onToggle: () => void;
  bands: number[];
  onBandChange: (index: number, value: number) => void;
  preamp: number;
  onPreampChange: (value: number) => void;
};

const BAND_LABELS = ["60", "170", "310", "600", "1K", "3K", "6K", "12K", "14K", "16K"];

export function WinampEqualizer({ on, onToggle, bands, onBandChange, preamp, onPreampChange }: Props) {
  return (
    <div className="winamp-eq w-[275px] mt-0">

      <div className="winamp-eq-titlebar flex items-center justify-between h-[14px] px-[3px]">
        <span className="text-[8px] font-bold tracking-wider winamp-text-green">WINAMP EQUALIZER</span>
        <button className="winamp-tiny-btn" aria-label="Close EQ">×</button>
      </div>

      <div className="winamp-eq-body px-[7px] pt-[3px] pb-[5px]">

        <div className="flex items-center gap-[6px] mb-[4px]">
          <button
            className={`winamp-eq-toggle ${on ? "active" : ""}`}
            onClick={onToggle}
          >
            ON
          </button>
          <button className="winamp-eq-toggle">AUTO</button>
          <div className="winamp-eq-graph flex-1 h-[10px] mx-[4px]" />
          <button className="winamp-eq-preset-btn">PRESETS</button>
        </div>

        <div className="flex items-center mb-[2px]">
          <div className="flex flex-col items-center text-[6px] winamp-text-dim mr-[4px]">
            <span>+12db</span>
            <span className="my-[12px]">+0 db</span>
            <span>-12db</span>
          </div>
        </div>

        <div className="flex gap-[2px] items-stretch">
          {/* Preamp */}
          <div className="flex flex-col items-center">
            <EqVerticalSlider value={preamp} onChange={onPreampChange} />
            <span className="text-[6px] winamp-text-dim mt-[2px]">PREAMP</span>
          </div>

          <div className="w-[4px]" />

          {bands.map((value, i) => (
            <div key={i} className="flex flex-col items-center">
              <EqVerticalSlider value={value} onChange={(v) => onBandChange(i, v)} />
              <span className="text-[6px] winamp-text-dim mt-[2px]">{BAND_LABELS[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EqVerticalSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    updateValue(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons > 0) updateValue(e);
  };

  const updateValue = (e: React.PointerEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    // Inverted: top = 100, bottom = 0
    const percent = Math.max(0, Math.min(100, 100 - ((e.clientY - rect.top) / rect.height) * 100));
    onChange(percent);
  };

  return (
    <div
      ref={trackRef}
      className="winamp-eq-slider"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      <div className="winamp-eq-slider-track" />

      <div
        className="winamp-eq-slider-fill"
        style={{ height: `${value}%` }}
      />

      <div
        className="winamp-eq-slider-thumb"
        style={{ bottom: `${value}%` }}
      />
    </div>
  );
}

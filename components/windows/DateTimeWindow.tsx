"use client";

import { useEffect, useMemo, useState } from "react";
import type { WindowComponentProps } from "@/lib/windows";
import { Win98Select } from "@/components/ui/Win98Select";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/** Analog clock face with live ticking hands, Win98 style. */
function AnalogClock({ now }: { now: Date }) {
  const seconds = now.getSeconds();
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  const hourAngle = hours * 30;
  const minuteAngle = minutes * 6;
  const secondAngle = seconds * 6;

  const cx = 60;
  const cy = 60;

  const point = (angleDeg: number, length: number) => {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + Math.cos(a) * length, y: cy + Math.sin(a) * length };
  };
  // perpendicular offset from center, to build the kite-shaped hands
  const side = (angleDeg: number, length: number) => point(angleDeg + 90, length);

  const teal = "#1f7a7a";
  const tealDark = "#0f4f4f";

  const hourTip = point(hourAngle, 28);
  const hourL = side(hourAngle, 5);
  const hourR = side(hourAngle, -5);
  const minuteTip = point(minuteAngle, 44);
  const minuteL = side(minuteAngle, 4);
  const minuteR = side(minuteAngle, -4);
  const secondTip = point(secondAngle, 46);
  const secondTail = point(secondAngle + 180, 12);

  return (
    <svg width="124" height="124" viewBox="0 0 120 120" aria-hidden="true">
      {/* tick marks */}
      {Array.from({ length: 60 }).map((_, i) => {
        const a = ((i * 6 - 90) * Math.PI) / 180;
        const radius = 52;
        const x = cx + Math.cos(a) * radius;
        const y = cy + Math.sin(a) * radius;
        const major = i % 5 === 0;
        return (
          <rect
            key={i}
            x={x - (major ? 2.5 : 1)}
            y={y - (major ? 2.5 : 1)}
            width={major ? 5 : 2}
            height={major ? 5 : 2}
            fill={major ? teal : "#404040"}
          />
        );
      })}
      {/* hour hand */}
      <polygon
        points={`${hourTip.x},${hourTip.y} ${hourL.x},${hourL.y} ${cx},${cy} ${hourR.x},${hourR.y}`}
        fill={teal}
        stroke={tealDark}
        strokeWidth="0.75"
        strokeLinejoin="round"
      />
      {/* minute hand */}
      <polygon
        points={`${minuteTip.x},${minuteTip.y} ${minuteL.x},${minuteL.y} ${cx},${cy} ${minuteR.x},${minuteR.y}`}
        fill={teal}
        stroke={tealDark}
        strokeWidth="0.75"
        strokeLinejoin="round"
      />
      {/* second hand */}
      <line x1={secondTail.x} y1={secondTail.y} x2={secondTip.x} y2={secondTip.y} stroke="#b33b3b" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="2.5" fill={teal} stroke={tealDark} strokeWidth="0.75" />
    </svg>
  );
}

export function DateTimeWindow({ window: win, closeWindow, notify, playSound }: WindowComponentProps) {
  const [now, setNow] = useState(() => new Date());

  // The date the user is browsing (defaults to today, purely a view selection).
  const [viewYear, setViewYear] = useState(() => now.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => now.getMonth());
  const [selectedDay, setSelectedDay] = useState(() => now.getDate());

  // Live tick.
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const timeZoneName = useMemo(() => {
    try {
      const formatted = new Intl.DateTimeFormat(undefined, { timeZoneName: "long" }).formatToParts(now);
      const part = formatted.find((p) => p.type === "timeZoneName");
      if (part) return part.value;
    } catch {
      /* ignore */
    }
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }, [now]);

  const digitalTime = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const totalDays = daysInMonth(viewYear, viewMonth);

  // Build calendar cells (leading blanks + day numbers).
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  const changeYear = (delta: number) => {
    setViewYear((y) => Math.min(2099, Math.max(1980, y + delta)));
    playSound("click");
  };

  const close = () => closeWindow(win.instanceId);

  return (
    <div className="flex h-full flex-col text-[11px] text-black">
      {/* Tab strip (single tab) */}
      <div className="datetime-tabstrip">
        <span className="datetime-tab">Date &amp; Time</span>
      </div>

      {/* Panel */}
      <div className="datetime-panel min-h-0 flex-1">
        <div className="flex h-full flex-col">
          <div className="flex gap-[10px]">
            {/* Date fieldset */}
            <fieldset className="datetime-fieldset flex-1">
              <legend>Date</legend>
              <div className="flex items-start gap-[6px]">
                <Win98Select
                  className="flex-1"
                  value={String(viewMonth)}
                  onChange={(v) => {
                    setViewMonth(Number(v));
                    playSound("click");
                  }}
                  ariaLabel="Month"
                  options={MONTHS.map((m, i) => ({ value: String(i), label: m }))}
                />
                <div className="flex">
                  <input
                    className="datetime-input w-[42px] text-right"
                    value={viewYear}
                    readOnly
                    aria-label="Year"
                  />
                  <div className="ml-[1px] flex flex-col justify-center">
                    <button className="datetime-spin" onClick={() => changeYear(1)} aria-label="Year up">▲</button>
                    <button className="datetime-spin" onClick={() => changeYear(-1)} aria-label="Year down">▼</button>
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <div className="datetime-calendar mt-[6px]">
                <div className="grid grid-cols-7">
                  {WEEKDAYS.map((d, i) => (
                    <div key={i} className="flex h-[18px] items-center justify-center font-bold text-[#000080]">
                      {d}
                    </div>
                  ))}
                  {cells.map((day, i) => {
                    const isSelected = day !== null && day === selectedDay;
                    return (
                      <div key={i} className="flex h-[18px] items-center justify-center">
                        <button
                          disabled={day === null}
                          onClick={() => {
                            if (day !== null) {
                              setSelectedDay(day);
                              playSound("click");
                            }
                          }}
                          className={`flex h-[16px] w-[20px] items-center justify-center tabular-nums ${
                            day === null ? "invisible" : ""
                          }`}
                          style={
                            isSelected
                              ? { background: "#000080", color: "#ffffff" }
                              : undefined
                          }
                        >
                          {day ?? ""}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </fieldset>

            {/* Time fieldset */}
            <fieldset className="datetime-fieldset w-[148px]">
              <legend>Time</legend>
              <div className="flex flex-col items-center">
                <AnalogClock now={now} />
                <div className="mt-[12px] flex">
                  <input
                    className="datetime-input w-[92px] text-center tabular-nums"
                    value={digitalTime}
                    readOnly
                    aria-label="Current time"
                  />
                  <div className="ml-[1px] flex flex-col justify-center">
                    <button className="datetime-spin" aria-label="Time up" tabIndex={-1}>▲</button>
                    <button className="datetime-spin" aria-label="Time down" tabIndex={-1}>▼</button>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>

          <div className="mt-auto pt-[10px]">
            Current time zone: {timeZoneName}
          </div>
        </div>
      </div>

      {/* Dialog buttons */}
      <div className="mt-[8px] flex justify-end gap-[6px] px-[2px] pb-[2px]">
        <button className="win-button min-w-[75px]" onClick={close}>OK</button>
        <button className="win-button min-w-[75px]" onClick={close}>Cancel</button>
        <button
          className="win-button min-w-[75px]"
          onClick={() => notify("The Floppyy system clock follows your real computer time.")}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

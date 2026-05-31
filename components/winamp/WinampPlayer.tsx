"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WinampEqualizer } from "./Equalizer";
import { WinampPlaylist } from "./Playlist";

export interface WinampTrack {
  title: string;
  artist: string;
  duration: number; 
  file?: string;
}

const DEFAULT_TRACKS: WinampTrack[] = [
  { title: "Winamp Intro", artist: "Winamp", duration: 0, file: "/winamp/winamp-intro.mp3" },
  { title: "Alternative", artist: "Winamp", duration: 0, file: "/winamp/winamp-alternative.mp3" },
];

const IDLE_BARS = Array(19).fill(2);

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatTotalTime(tracks: WinampTrack[]): string {
  const total = tracks.reduce((sum, t) => sum + t.duration, 0);
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function WinampPlayer({ playSound }: { playSound: (name: string) => void }) {
  const [tracks, setTracks] = useState<WinampTrack[]>(DEFAULT_TRACKS);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(78);
  const [balance, setBalance] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showEq, setShowEq] = useState(true);
  const [showPl, setShowPl] = useState(true);
  const [eqOn, setEqOn] = useState(true);
  const [eqBands, setEqBands] = useState<number[]>([50, 50, 50, 50, 50, 50, 50, 50, 50, 50]);
  const [preamp, setPreamp] = useState(50);
  const [marqueeOffset, setMarqueeOffset] = useState(0);
  const [visBars, setVisBars] = useState<number[]>(IDLE_BARS);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);

  const track = tracks[currentTrack];
  const trackDuration = duration || track.duration || 0;
  const displayText = `${track.artist} - ${track.title}  ***  `;

  // Marquee scrolling
  useEffect(() => {
    const timer = window.setInterval(() => {
      setMarqueeOffset((prev) => (prev + 1) % (displayText.length * 6));
    }, 60);
    return () => window.clearInterval(timer);
  }, [displayText]);

  // Visualizer animation
  useEffect(() => {
    if (!playing) {
      // Reset bars on the next frame rather than synchronously during the
      // effect to avoid cascading renders.
      const reset = requestAnimationFrame(() => setVisBars(IDLE_BARS));
      return () => cancelAnimationFrame(reset);
    }

    // If we have an analyser, use real data
    if (analyserRef.current) {
      const analyser = analyserRef.current;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const animate = () => {
        analyser.getByteFrequencyData(dataArray);
        const bars: number[] = [];
        const step = Math.floor(dataArray.length / 19);
        for (let i = 0; i < 19; i++) {
          const val = dataArray[i * step] || 0;
          bars.push(Math.max(2, (val / 255) * 16));
        }
        setVisBars(bars);
        animFrameRef.current = requestAnimationFrame(animate);
      };
      animate();
      return () => cancelAnimationFrame(animFrameRef.current);
    }

    // Fallback: fake visualizer
    const timer = window.setInterval(() => {
      setVisBars(Array.from({ length: 19 }, () => 2 + Math.random() * 14));
    }, 100);
    return () => window.clearInterval(timer);
  }, [playing]);

  // Audio playback — create the element once on mount and wire up listeners
  // that don't depend on changing state.
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTimeUpdate = () => setElapsed(Math.floor(audio.currentTime));
    const onLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(Math.floor(audio.duration));
        setTracks((prev) => {
          const idx = prev.findIndex((t) => t.file && audio.src.endsWith(t.file));
          if (idx < 0) return prev;
          const updated = [...prev];
          updated[idx] = { ...updated[idx], duration: Math.floor(audio.duration) };
          return updated;
        });
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  const nextTrack = useCallback(() => {
    if (shuffle) {
      const next = Math.floor(Math.random() * tracks.length);
      setCurrentTrack(next);
    } else if (currentTrack < tracks.length - 1) {
      setCurrentTrack(currentTrack + 1);
    } else if (repeat) {
      setCurrentTrack(0);
    } else {
      setPlaying(false);
    }
    setElapsed(0);
  }, [shuffle, repeat, currentTrack, tracks.length]);

  // Re-bind the "ended" handler whenever nextTrack changes so it always
  // advances using the latest shuffle/repeat/track state.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => nextTrack();
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [nextTrack]);

  useEffect(() => {
    if (playing && (!audioRef.current || audioRef.current.paused)) {
      intervalRef.current = window.setInterval(() => {
        setElapsed((prev) => {
          if (prev >= trackDuration && trackDuration > 0) {
            nextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [playing, currentTrack, trackDuration, nextTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const prevTrack = () => {
    if (elapsed > 3) {
      setElapsed(0);
      if (audioRef.current) audioRef.current.currentTime = 0;
    } else {
      setCurrentTrack(currentTrack > 0 ? currentTrack - 1 : tracks.length - 1);
      setElapsed(0);
    }
  };

  const handlePlay = () => {
    playSound("music");
    setPlaying(true);

    if (track.file) {
      if (audioRef.current) {
        if (audioRef.current.src !== window.location.origin + track.file) {
          audioRef.current.src = track.file;
        }
        audioRef.current.play().then(() => {
          // Setup Web Audio API for visualizer
          if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioContext();
            analyserRef.current = audioCtxRef.current.createAnalyser();
            analyserRef.current.fftSize = 64;
            sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current!);
            sourceRef.current.connect(analyserRef.current);
            analyserRef.current.connect(audioCtxRef.current.destination);
          }
        }).catch(() => {

        });
      }
    }
  };

  const handlePause = () => {
    if (playing) {
      setPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    } else {
      handlePlay();
    }
  };

  const handleStop = () => {
    setPlaying(false);
    setElapsed(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleSeek = (percent: number) => {
    const newTime = Math.floor((percent / 100) * trackDuration);
    setElapsed(newTime);
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleTrackSelect = (index: number) => {
    playSound("music");
    setCurrentTrack(index);
    setElapsed(0);
    setDuration(tracks[index].duration || 0);
    setPlaying(true);

    if (tracks[index].file) {
      if (audioRef.current) {
        audioRef.current.src = tracks[index].file!;
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const seekPercent = trackDuration > 0 ? (elapsed / trackDuration) * 100 : 0;

  return (
    <div className="winamp-container flex flex-col items-center select-none">
      {/* Main Player Window */}
      <div className="winamp-main w-[275px] relative">
        {/* Title bar area */}
        <div className="winamp-titlebar flex items-center justify-between h-[14px] px-[3px]">
          <div className="flex items-center gap-[2px]">
            <WinampClutterBar />
          </div>
          <span className="winamp-title-text text-[8px] font-bold tracking-wider">WINAMP</span>
          <div className="flex items-center gap-px">
            <button className="winamp-tiny-btn" aria-label="Minimize">_</button>
            <button className="winamp-tiny-btn" aria-label="Shade">▬</button>
            <button className="winamp-tiny-btn" aria-label="Close">×</button>
          </div>
        </div>

        <div className="winamp-display mx-[7px] mt-[2px] h-[42px] flex">

          <div className="winamp-vis-area w-[63px] h-full flex flex-col relative">
            <div className="flex items-baseline px-[2px] pt-[2px]">
              <span className="text-[16px] font-mono font-bold winamp-text-green leading-none tracking-tight">
                {formatTime(elapsed)}
              </span>
            </div>

            <div className="winamp-vis flex items-end gap-px px-[2px] mt-auto mb-[2px]">
              {visBars.map((h, i) => (
                <span
                  key={i}
                  className="winamp-vis-bar"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col ml-[6px] overflow-hidden">
            <div className="winamp-marquee h-[12px] overflow-hidden relative mt-[3px]">
              <div
                className="whitespace-nowrap text-[9px] winamp-text-green font-mono font-bold absolute top-0 left-0"
                style={{ transform: `translateX(-${marqueeOffset}px)` }}
              >
                {displayText}{displayText}
              </div>
            </div>

            <div className="flex items-center gap-[6px] mt-[5px] text-[8px] font-mono">
              <span className="winamp-text-green font-bold">128</span>
              <span className="winamp-text-label text-[7px]">kbps</span>
              <span className="winamp-text-green font-bold">44</span>
              <span className="winamp-text-label text-[7px]">kHz</span>
              <div className="ml-auto flex gap-[6px]">
                <span className="winamp-text-dim text-[7px]">mono</span>
                <span className="winamp-text-green text-[7px] font-bold">stereo</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-[12px] mt-[4px] mb-px">
          <WinampSlider
            value={seekPercent}
            onChange={handleSeek}
            className="winamp-seek"
            thumbClass="winamp-seek-thumb"
          />
        </div>

        <div className="flex items-center mx-[7px] mt-[3px] gap-[4px]">
          <div className="flex items-center gap-[4px]">
            <WinampSlider
              value={volume}
              onChange={setVolume}
              className="winamp-volume"
              thumbClass="winamp-vol-thumb"
              width={68}
            />
            <WinampSlider
              value={balance + 50}
              onChange={(v) => setBalance(v - 50)}
              className="winamp-balance"
              thumbClass="winamp-bal-thumb"
              width={38}
            />
          </div>
          <div className="flex gap-[3px] ml-auto">
            <button
              className={`winamp-toggle-btn ${showEq ? "active" : ""}`}
              onClick={() => setShowEq(!showEq)}
            >
              EQ
            </button>
            <button
              className={`winamp-toggle-btn ${showPl ? "active" : ""}`}
              onClick={() => setShowPl(!showPl)}
            >
              PL
            </button>
          </div>
        </div>

        <div className="flex items-center mx-[7px] mt-[5px] mb-[4px] gap-px">
          <button className="winamp-transport-btn" onClick={prevTrack} aria-label="Previous">
            <TransportPrev />
          </button>
          <button className="winamp-transport-btn" onClick={handlePlay} aria-label="Play">
            <TransportPlay />
          </button>
          <button className="winamp-transport-btn" onClick={handlePause} aria-label="Pause">
            <TransportPause />
          </button>
          <button className="winamp-transport-btn" onClick={handleStop} aria-label="Stop">
            <TransportStop />
          </button>
          <button className="winamp-transport-btn" onClick={() => { nextTrack(); }} aria-label="Next">
            <TransportNext />
          </button>
          <button className="winamp-transport-btn winamp-eject-btn" aria-label="Eject">
            <TransportEject />
          </button>

          <div className="ml-auto flex gap-[4px]">
            <button
              className={`winamp-option-btn ${shuffle ? "active" : ""}`}
              onClick={() => setShuffle(!shuffle)}
            >
              SHUFFLE
            </button>
            <button
              className={`winamp-option-btn ${repeat ? "active" : ""}`}
              onClick={() => setRepeat(!repeat)}
            >
              REPEAT
            </button>
          </div>
        </div>
      </div>

      {showEq && (
        <WinampEqualizer
          on={eqOn}
          onToggle={() => setEqOn(!eqOn)}
          bands={eqBands}
          onBandChange={(i, v) => {
            const newBands = [...eqBands];
            newBands[i] = v;
            setEqBands(newBands);
          }}
          preamp={preamp}
          onPreampChange={setPreamp}
        />
      )}

      {showPl && (
        <WinampPlaylist
          tracks={tracks}
          currentTrack={currentTrack}
          onSelect={handleTrackSelect}
          elapsed={elapsed}
          totalTime={formatTotalTime(tracks)}
        />
      )}
    </div>
  );
}

function WinampClutterBar() {
  return (
    <div className="flex flex-col gap-px">
      {["O", "A", "I", "D", "V"].map((letter) => (
        <span key={letter} className="text-[5px] winamp-text-dim leading-none">{letter}</span>
      ))}
    </div>
  );
}

function WinampSlider({
  value,
  onChange,
  className = "",
  thumbClass = "",
  width,
}: {
  value: number;
  onChange: (v: number) => void;
  className?: string;
  thumbClass?: string;
  width?: number;
}) {
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
    const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    onChange(percent);
  };

  return (
    <div
      ref={trackRef}
      className={`winamp-slider ${className}`}
      style={width ? { width: `${width}px` } : undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      <div className="winamp-slider-track" />
      <div
        className={`winamp-slider-thumb ${thumbClass}`}
        style={{ left: `${value}%` }}
      />
    </div>
  );
}

function TransportPrev() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
      <rect x="0" y="1" width="2" height="6" />
      <polygon points="8,1 3,4 8,7" />
    </svg>
  );
}

function TransportPlay() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
      <polygon points="1,0 8,4 1,8" />
    </svg>
  );
}

function TransportPause() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
      <rect x="1" y="1" width="2" height="6" />
      <rect x="5" y="1" width="2" height="6" />
    </svg>
  );
}

function TransportStop() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
      <rect x="1" y="1" width="6" height="6" />
    </svg>
  );
}

function TransportNext() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
      <polygon points="0,1 5,4 0,7" />
      <rect x="6" y="1" width="2" height="6" />
    </svg>
  );
}

function TransportEject() {
  return (
    <svg width="9" height="8" viewBox="0 0 9 8" fill="currentColor">
      <polygon points="1,5 4.5,1 8,5" />
      <rect x="1" y="6" width="7" height="2" />
    </svg>
  );
}

"use client";

import { useState, useEffect } from "react";
import type { WindowComponentProps } from "@/lib/windows";
import { ToolbarIcon } from "./ToolbarIcon";

const WAYBACK_PREFIX = "https://web.archive.org/web/1999if_/";
const HOME_URL = "https://www.aol.com/";
const FAVORITES = [
  ["AOL", "https://www.aol.com/"],
  ["Yahoo!", "https://www.yahoo.com/"],
  ["GeoCities", "https://www.geocities.com/"],
  ["Space Jam", "https://www.spacejam.com/1996/"],
] as const;

function toWaybackUrl(url: string): string {
  if (url.startsWith("https://web.archive.org/")) return url;
  let cleanUrl = url.trim();
  // Block dangerous URL schemes
  const lower = cleanUrl.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:") || lower.startsWith("blob:") || lower.startsWith("vbscript:")) {
    return WAYBACK_PREFIX + "https://www.aol.com/";
  }
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = "http://" + cleanUrl;
  }
  return WAYBACK_PREFIX + cleanUrl;
}

function getDisplayUrl(url: string): string {
  // Show the original URL in address bar (without wayback prefix)
  if (url.startsWith(WAYBACK_PREFIX)) {
    return url.slice(WAYBACK_PREFIX.length);
  }
  // Handle other wayback URL formats
  const waybackMatch = url.match(/^https:\/\/web\.archive\.org\/web\/[^/]+\/(.*)/);
  if (waybackMatch) {
    return waybackMatch[1];
  }
  return url;
}

export function IEBrowserWindow({ playSound, window: win, internetConnected, crashSystem }: WindowComponentProps) {
  const initialUrl = win.payload && win.payload.trim() ? win.payload.trim() : HOME_URL;
  const [address, setAddress] = useState(initialUrl);
  const [currentUrl, setCurrentUrl] = useState(toWaybackUrl(initialUrl));
  const [history, setHistory] = useState<string[]>([toWaybackUrl(initialUrl)]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [loading, setLoading] = useState(Boolean(internetConnected));
  const [statusText, setStatusText] = useState(internetConnected ? "Opening page..." : "Cannot find server");
  const [progress, setProgress] = useState(0);

  // Animate the classic status-bar progress meter while a page loads.
  useEffect(() => {
    if (!loading) {
      setProgress(0);
      return;
    }
    setProgress(8);
    const id = setInterval(() => {
      // Creep towards ~90% and stall there until the page finishes.
      setProgress((p) => (p >= 90 ? p : p + Math.max(1, Math.round((90 - p) * 0.12))));
    }, 180);
    return () => clearInterval(id);
  }, [loading]);

  const navigate = (url: string) => {
    if (!internetConnected) {
      setAddress(url);
      setLoading(false);
      setStatusText("Cannot find server");
      playSound("error");
      return;
    }
    // Easter egg: a nod to '90s browser instability — pages occasionally
    // take the whole system down with a blue screen.
    if (Math.random() < 0.08) {
      playSound("error");
      crashSystem?.({
        variant: "fatal",
        message: "Internet Explorer has caused a fatal error in MSHTML.DLL and will be terminated.",
      });
      return;
    }
    const waybackUrl = toWaybackUrl(url);
    setLoading(true);
    setStatusText(`Opening page ${url}...`);
    setCurrentUrl(waybackUrl);
    setAddress(getDisplayUrl(waybackUrl));
    const newHistory = [...history.slice(0, historyIndex + 1), waybackUrl];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    playSound("click");
  };

  const goBack = () => {
    if (!internetConnected) return;
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setAddress(getDisplayUrl(history[newIndex]));
      setLoading(true);
      setStatusText("Opening page...");
      playSound("click");
    }
  };

  const goForward = () => {
    if (!internetConnected) return;
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setAddress(getDisplayUrl(history[newIndex]));
      setLoading(true);
      setStatusText("Opening page...");
      playSound("click");
    }
  };

  const handleGo = () => {
    const url = address.trim();
    if (url) navigate(url);
  };

  return (
    <div
      className={`flex h-full flex-col bg-[#c0c0c0] text-[11px] ${loading ? "cursor-loading" : ""}`}
      aria-busy={loading}
    >
      {/* Menu bar */}
      <div className="flex items-center h-[20px] px-1 border-b border-[#808080] bg-[#c0c0c0]">
        <span className="px-2 hover:underline cursor-default">File</span>
        <span className="px-2 hover:underline cursor-default">Edit</span>
        <span className="px-2 hover:underline cursor-default">View</span>
        <span className="px-2 hover:underline cursor-default">Favorites</span>
        <span className="px-2 hover:underline cursor-default">Tools</span>
        <span className="px-2 hover:underline cursor-default">Help</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center h-[50px] px-2 gap-1 border-b border-[#808080] bg-[#c0c0c0]">
        <button
          onClick={goBack}
          disabled={historyIndex <= 0}
          className="group flex flex-col items-center justify-center w-[50px] h-[42px] hover:bg-[#dfdfdf] disabled:opacity-40 cursor-default text-[10px]"
        >
          <span className="flex h-[20px] items-center justify-center grayscale transition-[filter] duration-150 group-hover:grayscale-0"><ToolbarIcon name="back" /></span>
          <span>Back</span>
        </button>
        <button
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
          className="group flex flex-col items-center justify-center w-[54px] h-[42px] hover:bg-[#dfdfdf] disabled:opacity-40 cursor-default text-[10px]"
        >
          <span className="flex h-[20px] items-center justify-center grayscale transition-[filter] duration-150 group-hover:grayscale-0"><ToolbarIcon name="forward" /></span>
          <span>Forward</span>
        </button>
        <div className="w-px h-[36px] bg-[#808080] mx-1" />
        <button
          onClick={() => { setLoading(false); setStatusText(internetConnected ? "Done" : "Cannot find server"); }}
          className="group flex flex-col items-center justify-center w-[42px] h-[42px] hover:bg-[#dfdfdf] cursor-default text-[10px]"
        >
          <span className="flex h-[20px] items-center justify-center grayscale transition-[filter] duration-150 group-hover:grayscale-0"><ToolbarIcon name="stop" /></span>
          <span>Stop</span>
        </button>
        <button
          onClick={() => navigate(getDisplayUrl(currentUrl))}
          className="group flex flex-col items-center justify-center w-[50px] h-[42px] hover:bg-[#dfdfdf] cursor-default text-[10px]"
        >
          <span className="flex h-[20px] items-center justify-center grayscale transition-[filter] duration-150 group-hover:grayscale-0"><ToolbarIcon name="refresh" /></span>
          <span>Refresh</span>
        </button>
        <button
          onClick={() => navigate(HOME_URL)}
          className="group flex flex-col items-center justify-center w-[42px] h-[42px] hover:bg-[#dfdfdf] cursor-default text-[10px]"
        >
          <span className="flex h-[20px] items-center justify-center grayscale transition-[filter] duration-150 group-hover:grayscale-0"><ToolbarIcon name="home" /></span>
          <span>Home</span>
        </button>
        <div className="w-px h-[36px] bg-[#808080] mx-1" />
        <button className="group flex flex-col items-center justify-center w-[48px] h-[42px] hover:bg-[#dfdfdf] cursor-default text-[10px]">
          <span className="flex h-[20px] items-center justify-center grayscale transition-[filter] duration-150 group-hover:grayscale-0"><ToolbarIcon name="search" /></span>
          <span>Search</span>
        </button>
        <button className="group flex flex-col items-center justify-center w-[56px] h-[42px] hover:bg-[#dfdfdf] cursor-default text-[10px]">
          <span className="flex h-[20px] items-center justify-center grayscale transition-[filter] duration-150 group-hover:grayscale-0"><ToolbarIcon name="favorites" /></span>
          <span>Favorites</span>
        </button>
        <button className="group flex flex-col items-center justify-center w-[50px] h-[42px] hover:bg-[#dfdfdf] cursor-default text-[10px]">
          <span className="flex h-[20px] items-center justify-center grayscale transition-[filter] duration-150 group-hover:grayscale-0"><ToolbarIcon name="history" /></span>
          <span>History</span>
        </button>
        <div className="w-px h-[36px] bg-[#808080] mx-1" />
        <button className="group flex flex-col items-center justify-center w-[42px] h-[42px] hover:bg-[#dfdfdf] cursor-default text-[10px]">
          <span className="flex h-[20px] items-center justify-center grayscale transition-[filter] duration-150 group-hover:grayscale-0"><ToolbarIcon name="print" /></span>
          <span>Print</span>
        </button>
      </div>

      {/* Address bar */}
      <div className="flex items-center h-[24px] px-2 gap-1 border-b border-[#808080] bg-[#c0c0c0]">
        <span className="text-[11px] font-bold mr-1">Address</span>
        <div className="flex-1 flex items-center h-[18px] border border-[#808080] bg-white px-1">
          <span className="text-[12px] mr-1">🌐</span>
          <input
            className="flex-1 h-full bg-transparent outline-none text-[11px]"
            style={{ color: "#000" }}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleGo(); }}
          />
        </div>
        <button
          onClick={handleGo}
          className="h-[18px] px-2 border border-[#808080] bg-[#c0c0c0] text-[10px] hover:bg-[#dfdfdf]"
          style={{ background: "#c0c0c0" }}
        >
          ↗ Go
        </button>
      </div>

      <div className="flex h-[22px] items-center gap-2 border-b border-[#808080] bg-[#c0c0c0] px-2 text-[10px]">
        <span className="font-bold">Links</span>
        {FAVORITES.map(([label, url]) => (
          <button key={label} className="cursor-default hover:underline" onClick={() => navigate(url)}>
            {label}
          </button>
        ))}
      </div>

      {/* Content area - iframe */}
      <div className="flex-1 bg-white overflow-hidden relative">
        {!internetConnected ? (
          <NoInternetPage browser="Internet Explorer" address={address} />
        ) : loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-[12px] text-[#808080] animate-pulse">Loading...</div>
          </div>
        )}
        {internetConnected && (
          <iframe
            src={currentUrl}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
            referrerPolicy="no-referrer"
            onLoad={() => {
              setLoading(false);
              setStatusText("Done");
            }}
            title="Internet Explorer"
          />
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center h-[20px] gap-[2px] border-t border-[#dfdfdf] bg-[#c0c0c0] pl-2 pr-[2px]">
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <span className="text-[10px] truncate">{statusText}</span>
        </div>

        {/* Loading progress meter */}
        <div className="flex h-[16px] w-[110px] items-center border border-[#808080] border-t-[#404040] border-l-[#404040] bg-[#c0c0c0] px-[2px]">
          <div className="flex h-[10px] w-full gap-[1px] overflow-hidden">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="h-full flex-1"
                style={{
                  background: loading && progress >= ((i + 1) / 16) * 100 ? "#000080" : "transparent",
                }}
              />
            ))}
          </div>
        </div>

        {/* Zone indicators */}
        <div className="h-[16px] w-[26px] border border-[#808080] border-t-[#404040] border-l-[#404040] bg-[#c0c0c0]" />
        <div className="h-[16px] w-[26px] border border-[#808080] border-t-[#404040] border-l-[#404040] bg-[#c0c0c0]" />

        <div className="flex h-[16px] items-center gap-1 border border-[#808080] border-t-[#404040] border-l-[#404040] bg-[#c0c0c0] px-2">
          <img
            src="/icons/world.png"
            alt=""
            width={14}
            height={14}
            style={{ imageRendering: "pixelated" }}
            draggable={false}
          />
          <span className="text-[10px]">{internetConnected ? "Internet" : "Offline"}</span>
        </div>
      </div>
    </div>
  );
}

function NoInternetPage({ browser, address }: { browser: string; address: string }) {
  return (
    <div className="h-full bg-white p-6 font-[Arial] text-[13px] text-black">
      <div className="mb-5 flex items-start gap-4">
        <img src="/icons/ie.png" alt="" width={32} height={32} style={{ imageRendering: "pixelated" }} draggable={false} />
        <div>
          <h1 className="mb-3 text-[20px] font-bold">This page cannot be displayed</h1>
          <p>The page you are looking for is currently unavailable.</p>
        </div>
      </div>
      <p className="mb-3">The computer is not connected to the Internet.</p>
      <ul className="mb-4 ml-6 list-disc">
        <li>Open Dial-Up Networking and connect to the Internet.</li>
        <li>After the connection is established, click Refresh.</li>
        <li>Make sure the address is typed correctly: <strong>{address}</strong></li>
      </ul>
      <div className="mt-6 border-t border-[#c0c0c0] pt-3 text-[12px] text-[#666666]">
        {browser} could not find a connection. Error: Cannot find server.
      </div>
    </div>
  );
}

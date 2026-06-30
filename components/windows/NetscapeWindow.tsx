"use client";

import { useState } from "react";
import type { WindowComponentProps } from "@/lib/windows";
import { ToolbarIcon } from "./ToolbarIcon";

const WAYBACK_PREFIX = "https://web.archive.org/web/1999if_/";
const HOME_URL = "https://www.yahoo.com/";
const BOOKMARKS = [
  ["Yahoo!", "https://www.yahoo.com/"],
  ["AltaVista", "https://www.altavista.com/"],
  ["GeoCities", "https://www.geocities.com/"],
  ["Space Jam", "https://www.spacejam.com/1996/"],
] as const;

function toWaybackUrl(url: string): string {
  if (url.startsWith("https://web.archive.org/")) return url;
  let cleanUrl = url.trim();
  const lower = cleanUrl.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:") || lower.startsWith("blob:") || lower.startsWith("vbscript:")) {
    return WAYBACK_PREFIX + "https://www.yahoo.com/";
  }
  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    cleanUrl = "http://" + cleanUrl;
  }
  return WAYBACK_PREFIX + cleanUrl;
}

function getDisplayUrl(url: string): string {
  if (url.startsWith(WAYBACK_PREFIX)) {
    return url.slice(WAYBACK_PREFIX.length);
  }
  const waybackMatch = url.match(/^https:\/\/web\.archive\.org\/web\/[^/]+\/(.*)/);
  if (waybackMatch) {
    return waybackMatch[1];
  }
  return url;
}

export function NetscapeWindow({ playSound, internetConnected, crashSystem }: WindowComponentProps) {
  const [address, setAddress] = useState(HOME_URL);
  const [currentUrl, setCurrentUrl] = useState(toWaybackUrl(HOME_URL));
  const [history, setHistory] = useState<string[]>([toWaybackUrl(HOME_URL)]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [loading, setLoading] = useState(Boolean(internetConnected));
  const [statusText, setStatusText] = useState(internetConnected ? "Document: Loading..." : "Document: Cannot find server");

  const navigate = (url: string) => {
    if (!internetConnected) {
      setAddress(url);
      setLoading(false);
      setStatusText("Document: Cannot find server");
      playSound("error");
      return;
    }
    // Easter egg: a nod to '90s browser instability — pages occasionally
    // take the whole system down with a blue screen.
    if (Math.random() < 0.08) {
      playSound("error");
      crashSystem?.({
        variant: "fatal",
        message: "Netscape Navigator has performed an illegal operation and will be shut down.",
      });
      return;
    }
    const waybackUrl = toWaybackUrl(url);
    setLoading(true);
    setStatusText(`Document: Loading ${url}...`);
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
      setStatusText("Document: Loading...");
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
      setStatusText("Document: Loading...");
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
        <span className="px-2 hover:underline cursor-default">Go</span>
        <span className="px-2 hover:underline cursor-default">Window</span>
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
        <button
          onClick={() => navigate(getDisplayUrl(currentUrl))}
          className="group flex flex-col items-center justify-center w-[50px] h-[42px] hover:bg-[#dfdfdf] cursor-default text-[10px]"
        >
          <span className="flex h-[20px] items-center justify-center grayscale transition-[filter] duration-150 group-hover:grayscale-0"><ToolbarIcon name="refresh" /></span>
          <span>Reload</span>
        </button>
        <button
          onClick={() => navigate(HOME_URL)}
          className="group flex flex-col items-center justify-center w-[42px] h-[42px] hover:bg-[#dfdfdf] cursor-default text-[10px]"
        >
          <span className="flex h-[20px] items-center justify-center grayscale transition-[filter] duration-150 group-hover:grayscale-0"><ToolbarIcon name="home" /></span>
          <span>Home</span>
        </button>
        <button className="group flex flex-col items-center justify-center w-[48px] h-[42px] hover:bg-[#dfdfdf] cursor-default text-[10px]">
          <span className="flex h-[20px] items-center justify-center grayscale transition-[filter] duration-150 group-hover:grayscale-0"><ToolbarIcon name="search" /></span>
          <span>Search</span>
        </button>
        <button className="group flex flex-col items-center justify-center w-[48px] h-[42px] hover:bg-[#dfdfdf] cursor-default text-[10px]">
          <span className="flex h-[20px] items-center justify-center grayscale transition-[filter] duration-150 group-hover:grayscale-0"><ToolbarIcon name="print" /></span>
          <span>Print</span>
        </button>
        <button className="group flex flex-col items-center justify-center w-[54px] h-[42px] hover:bg-[#dfdfdf] cursor-default text-[10px]">
          <span className="flex h-[20px] items-center justify-center grayscale transition-[filter] duration-150 group-hover:grayscale-0"><ToolbarIcon name="security" /></span>
          <span>Security</span>
        </button>
        <button
          onClick={() => { setLoading(false); setStatusText(internetConnected ? "Document: Done" : "Document: Cannot find server"); }}
          className="group flex flex-col items-center justify-center w-[42px] h-[42px] hover:bg-[#dfdfdf] cursor-default text-[10px]"
        >
          <span className="flex h-[20px] items-center justify-center grayscale transition-[filter] duration-150 group-hover:grayscale-0"><ToolbarIcon name="stop" /></span>
          <span>Stop</span>
        </button>

        {/* Netscape N logo */}
        <div className="ml-auto flex items-center justify-center w-[40px] h-[40px]">
          <img
            src="/icons/netscape.png"
            alt="Netscape"
            width={32}
            height={32}
            style={{ imageRendering: "pixelated" }}
            draggable={false}
          />
        </div>
      </div>

      {/* Bookmarks / Location bar */}
      <div className="flex items-center h-[24px] px-2 gap-1 border-b border-[#808080] bg-[#c0c0c0]">
        <span className="text-[11px] mr-1">📑 Bookmarks</span>
        <span className="text-[11px] font-bold mr-1">Location:</span>
        <div className="flex-1 flex items-center h-[18px] border border-[#808080] bg-white px-1">
          <input
            className="flex-1 h-full bg-transparent outline-none text-[11px]"
            style={{ color: "#000" }}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleGo(); }}
          />
        </div>
      </div>

      {/* Quick links bar */}
      <div className="flex items-center h-[20px] px-2 gap-3 border-b border-[#808080] bg-[#c0c0c0] text-[10px]">
        {BOOKMARKS.map(([label, url]) => (
          <button key={label} className="hover:underline cursor-default" onClick={() => navigate(url)}>
            {label}
          </button>
        ))}
      </div>

      {/* Content area - iframe */}
      <div className="flex-1 bg-white overflow-hidden relative">
        {!internetConnected ? (
          <NetscapeOfflinePage address={address} />
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
              setStatusText("Document: Done");
            }}
            title="Netscape Navigator"
          />
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center h-[20px] px-2 border-t border-[#808080] bg-[#c0c0c0]">
        <span className="text-[10px]">{statusText}</span>
      </div>
    </div>
  );
}

function NetscapeOfflinePage({ address }: { address: string }) {
  return (
    <div className="h-full bg-white p-6 font-[Arial] text-[13px] text-black">
      <div className="mb-5 flex items-start gap-4">
        <img src="/icons/netscape.png" alt="" width={34} height={34} style={{ imageRendering: "pixelated" }} draggable={false} />
        <div>
          <h1 className="mb-3 text-[20px] font-bold">Netscape is unable to locate the server</h1>
          <p>The browser could not establish a network connection.</p>
        </div>
      </div>
      <p className="mb-3">There is no active dial-up connection.</p>
      <ul className="mb-4 ml-6 list-disc">
        <li>Connect using Dial-Up Networking.</li>
        <li>Try Reload after you&apos;re connected to the Internet.</li>
        <li>Check the location: <strong>{address}</strong></li>
      </ul>
      <div className="mt-6 border-t border-[#c0c0c0] pt-3 text-[12px] text-[#666666]">
        Network error: Cannot find server.
      </div>
    </div>
  );
}

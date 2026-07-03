"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { WindowComponentProps } from "@/lib/windows";
import { Win98Select } from "@/components/ui/Win98Select";
import {
  BODY_MAX_LENGTH,
  GUESTBOOK_CHANNEL,
  GuestbookMessage,
  NICK_MAX_LENGTH,
  STATUS_META,
  STATUS_OPTIONS,
  UserStatus,
  nickColor,
} from "@/lib/guestbook/types";

const NICK_STORAGE_KEY = "floppyy-irc-nick";
const STATUS_STORAGE_KEY = "floppyy-irc-status";
const POLL_INTERVAL_MS = 10000;

function timestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

type Peer = { nick: string; status: UserStatus; color: number };

function readStoredNick(): string {
  try {
    return globalThis.localStorage.getItem(NICK_STORAGE_KEY)?.slice(0, NICK_MAX_LENGTH) ?? "";
  } catch {
    return "";
  }
}

function readStoredStatus(): UserStatus {
  try {
    const saved = globalThis.localStorage.getItem(STATUS_STORAGE_KEY);
    if (saved && (STATUS_OPTIONS as readonly string[]).includes(saved)) return saved as UserStatus;
  } catch {
    /* localStorage unavailable */
  }
  return "online";
}

export function GuestbookWindow({ notify, playSound }: WindowComponentProps) {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [nick, setNick] = useState(readStoredNick);
  const [status, setStatus] = useState<UserStatus>(readStoredStatus);
  const [draft, setDraft] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logRef = useRef<HTMLDivElement>(null);
  const lastSeenId = useRef(0);
  const ownNick = useRef("");
  const initialised = useRef(false);

  useEffect(() => {
    ownNick.current = nick;
  }, [nick]);

  const applyMessages = useCallback(
    (incoming: GuestbookMessage[]) => {
      setMessages(incoming);
      const newest = incoming.length ? incoming[incoming.length - 1].id : 0;
      if (initialised.current && newest > lastSeenId.current) {
        const fromOthers = incoming.some(
          (m) => m.id > lastSeenId.current && m.nick !== ownNick.current,
        );
        if (fromOthers) playSound("icq");
      }
      lastSeenId.current = Math.max(lastSeenId.current, newest);
      initialised.current = true;
    },
    [playSound],
  );

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch("/api/guestbook", { cache: "no-store" });
      if (!response.ok) throw new Error("bad response");
      const data = (await response.json()) as { messages: GuestbookMessage[] };
      applyMessages(data.messages ?? []);
      setError(null);
    } catch {
      if (!initialised.current) setError("Could not connect to #floppyy.");
    } finally {
      setLoading(false);
    }
  }, [applyMessages]);

  useEffect(() => {
    fetchMessages();
    const timer = window.setInterval(fetchMessages, POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [fetchMessages]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const peers = useMemo(() => {
    const map = new Map<string, Peer>();
    for (const message of messages) {
      map.set(message.nick, { nick: message.nick, status: message.status, color: message.color });
    }
    return [...map.values()].sort((a, b) => a.nick.localeCompare(b.nick));
  }, [messages]);

  const send = useCallback(async () => {
    const trimmedNick = nick.trim();
    const trimmedBody = draft.trim();
    if (!trimmedNick) {
      setError("Pick a nickname first.");
      playSound("error");
      return;
    }
    if (!trimmedBody || sending) return;

    setSending(true);
    setError(null);
    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nick: trimmedNick, body: trimmedBody, status, website }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        message?: GuestbookMessage;
        error?: string;
      };
      if (!response.ok) {
        setError(data.error ?? "Message failed to send.");
        playSound("error");
        return;
      }
      setDraft("");
      try {
        globalThis.localStorage.setItem(NICK_STORAGE_KEY, trimmedNick);
        globalThis.localStorage.setItem(STATUS_STORAGE_KEY, status);
      } catch {
        /* ignore */
      }
      if (data.message) {
        lastSeenId.current = Math.max(lastSeenId.current, data.message.id);
        setMessages((current) =>
          current.some((m) => m.id === data.message!.id) ? current : [...current, data.message!],
        );
      }
      playSound("click");
      await fetchMessages();
    } catch {
      setError("Network error — message not sent.");
      playSound("error");
    } finally {
      setSending(false);
    }
  }, [nick, draft, status, website, sending, playSound, fetchMessages]);

  return (
    <div className="flex h-full flex-col bg-[#c0c0c0] text-[11px]">
      {/* Menu bar */}
      <div className="window-menu-bar">
        {["File", "Edit", "View"].map((item) => (
          <button key={item} className="window-menu-item">
            <span className="underline">{item[0]}</span>
            {item.slice(1)}
          </button>
        ))}
        <button
          className="window-menu-item"
          onClick={() => notify("Sign the Floppyy guestbook — leave a hello for the next visitor!")}
        >
          <span className="underline">H</span>elp
        </button>
      </div>

      {/* Channel topic bar */}
      <div className="field-border mx-[3px] mt-[3px] flex items-center gap-[6px] bg-white px-[6px] py-[3px]">
        <strong className="text-[#000080]">{GUESTBOOK_CHANNEL}</strong>
        <span className="truncate text-[#404040]">
          Topic: Sign the guestbook — mutual respect, no advertising, no spam. est. 1998
        </span>
      </div>

      {/* Body: log + nick list */}
      <div className="mx-[3px] mt-[3px] flex min-h-0 flex-1 gap-[3px]">
        <div
          ref={logRef}
          className="field-border flex-1 overflow-auto bg-white px-[6px] py-[4px] leading-[1.5]"
          style={{ fontFamily: "'Fixedsys', 'Consolas', monospace" }}
        >
          <div className="text-[#008000]">*** Now talking in {GUESTBOOK_CHANNEL}</div>
          <div className="text-[#008000]">
            *** Topic is &lsquo;Sign the guestbook — say hi to the next visitor!&rsquo;
          </div>
          <div className="text-[#008000]">
            *** Channel rules: 1) Mutual respect &nbsp;2) No advertising &nbsp;3) No spam or flooding
          </div>
          {loading && messages.length === 0 && (
            <div className="text-[#808080]">*** Connecting to server...</div>
          )}
          {!loading && messages.length === 0 && (
            <div className="text-[#808080]">*** No messages yet. Be the first to say hi!</div>
          )}
          {messages.map((message) => (
            <div key={message.id} className="break-words">
              <span className="text-[#808080]">[{timestamp(message.createdAt)}] </span>
              <span style={{ color: nickColor(message.nick, message.color), fontWeight: 700 }}>
                &lt;{message.nick}&gt;
              </span>{" "}
              <span className="text-black">{message.body}</span>
            </div>
          ))}
        </div>

        {/* Nick list with ICQ status flowers */}
        <div className="field-border w-[132px] shrink-0 overflow-auto bg-white px-[4px] py-[3px]">
          <div className="mb-[2px] border-b border-[#c0c0c0] pb-[2px] font-bold text-[#000080]">
            {peers.length} {peers.length === 1 ? "user" : "users"}
          </div>
          {peers.map((peer) => (
            <div key={peer.nick} className="flex items-center gap-[5px] py-[1px]" title={STATUS_META[peer.status].label}>
              <span
                className="inline-block h-[8px] w-[8px] shrink-0 rounded-full"
                style={{ background: STATUS_META[peer.status].color, boxShadow: "inset -1px -1px rgba(0,0,0,0.35)" }}
              />
              <span className="truncate" style={{ color: nickColor(peer.nick, peer.color) }}>
                {peer.nick}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div className="mx-[3px] mt-[3px] flex items-center gap-[4px]">
        <Win98Select
          className="w-[130px]"
          ariaLabel="Your status"
          value={status}
          onChange={(value) => setStatus(value as UserStatus)}
          options={STATUS_OPTIONS.map((value) => ({
            value,
            label: (
              <span className="flex items-center gap-[6px]">
                <span
                  className="inline-block h-[8px] w-[8px] shrink-0 rounded-full"
                  style={{ background: STATUS_META[value].color, boxShadow: "inset -1px -1px rgba(0,0,0,0.35)" }}
                />
                {STATUS_META[value].label}
              </span>
            ),
          }))}
        />
        <input
          className="win-bevel-inset h-[22px] w-[120px] px-[4px] text-[11px]"
          placeholder="Nickname"
          maxLength={NICK_MAX_LENGTH}
          value={nick}
          onChange={(event) => setNick(event.target.value)}
        />
      </div>

      <div className="m-[3px] flex items-center gap-[4px]">
        <input
          className="win-bevel-inset h-[24px] flex-1 px-[6px] text-[11px]"
          placeholder={`Message ${GUESTBOOK_CHANNEL}`}
          maxLength={BODY_MAX_LENGTH}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              send();
            }
          }}
        />
        {/* Honeypot — hidden from humans, tempting to bots */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />
        <button className="win-button min-w-[64px]" onClick={send} disabled={sending}>
          {sending ? "..." : "Send"}
        </button>
      </div>

      {/* Status bar */}
      <div className="status-bar mx-[3px] mb-[3px]">
        <div className="status-bar-field flex-none px-[8px]">{GUESTBOOK_CHANNEL}</div>
        <div className="status-bar-field truncate">
          {error ? (
            <span className="text-[#a00000]">{error}</span>
          ) : (
            <span>{messages.length} messages · connected as {nick.trim() || "guest"}</span>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { WindowComponentProps } from "@/lib/windows";

type Email = {
  from: string;
  subject: string;
  date: string;
  body: string;
  read: boolean;
};

const EMAILS: Email[] = [
  {
    from: "Floppyy Team",
    subject: "Welcome to Outlook Express!",
    date: "06/26/98 12:00 AM",
    body: `Dear User,

Welcome to Outlook Express on Floppyy!

This is your retro email client. Unfortunately, we can't actually send emails from 1998 — the internet was still on dial-up back then.

But hey, at least the interface looks authentic!

Best regards,
Floppyy Team
hi@floppyy.com`,
    read: false,
  },
];

const FOLDERS = [
  { name: "Outlook Express", indent: 0, icon: "📧" },
  { name: "Local Folders", indent: 1, icon: "📁" },
  { name: "Inbox (1)", indent: 2, icon: "📥", bold: true },
  { name: "Outbox", indent: 2, icon: "📤" },
  { name: "Sent Items", indent: 2, icon: "📨" },
  { name: "Deleted Items", indent: 2, icon: "🗑️" },
  { name: "Drafts", indent: 2, icon: "📝" },
];

export function OutlookWindow({ notify, playSound }: WindowComponentProps) {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emails, setEmails] = useState(EMAILS);

  const openEmail = (email: Email) => {
    setSelectedEmail(email);
    if (!email.read) {
      setEmails((prev) => prev.map((e) => (e === email ? { ...e, read: true } : e)));
      playSound("click");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0]">
      {/* Menu bar */}
      <div className="flex items-center h-[20px] px-1 border-b border-[#808080] text-[11px]">
        <span className="px-2 hover:underline cursor-default">File</span>
        <span className="px-2 hover:underline cursor-default">Edit</span>
        <span className="px-2 hover:underline cursor-default">View</span>
        <span className="px-2 hover:underline cursor-default">Tools</span>
        <span className="px-2 hover:underline cursor-default">Message</span>
        <span className="px-2 hover:underline cursor-default">Help</span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center h-[40px] px-2 gap-3 border-b border-[#808080]">
        <button
          onClick={() => notify("New Mail: Feature coming in Floppyy 99!")}
          className="flex flex-col items-center justify-center h-[36px] px-2 hover:bg-[#dfdfdf] cursor-default"
        >
          <span className="text-[14px]">📄</span>
          <span className="text-[9px]">New Mail</span>
        </button>
        <button className="flex flex-col items-center justify-center h-[36px] px-2 hover:bg-[#dfdfdf] cursor-default opacity-50">
          <span className="text-[14px]">📬</span>
          <span className="text-[9px]">Send/Recv</span>
        </button>
        <button className="flex flex-col items-center justify-center h-[36px] px-2 hover:bg-[#dfdfdf] cursor-default opacity-50">
          <span className="text-[14px]">📒</span>
          <span className="text-[9px]">Addresses</span>
        </button>
        <button className="flex flex-col items-center justify-center h-[36px] px-2 hover:bg-[#dfdfdf] cursor-default opacity-50">
          <span className="text-[14px]">🔍</span>
          <span className="text-[9px]">Find</span>
        </button>
      </div>

      {/* Header bar */}
      <div className="flex items-center h-[22px] px-2 bg-[#808080] text-white text-[12px] font-bold">
        <img src="/icons/msoutlook.png" alt="" width={16} height={16} className="mr-2" style={{ imageRendering: "pixelated" }} />
        Outlook Express
      </div>

      {/* Main content */}
      <div className="flex flex-1 min-h-0">
        {/* Folder panel */}
        <div className="w-[160px] border-r border-[#808080] bg-white overflow-auto p-1">
          <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-[11px] font-bold">Folders</span>
            <span className="text-[10px] cursor-pointer">✕</span>
          </div>
          {FOLDERS.map((folder, i) => (
            <div
              key={i}
              className="flex items-center gap-1 py-[2px] px-1 hover:bg-[#000080] hover:text-white text-[11px] cursor-default"
              style={{ paddingLeft: `${8 + folder.indent * 12}px` }}
            >
              <span className="text-[12px]">{folder.icon}</span>
              <span className={folder.bold ? "font-bold" : ""}>{folder.name}</span>
            </div>
          ))}

          <div className="mt-4 border-t border-[#808080] pt-2 px-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold">Contacts</span>
              <span className="text-[10px] cursor-pointer">✕</span>
            </div>
            <div className="text-[10px] text-[#808080]">
              There are no contacts to display.
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedEmail ? (
            /* Email view */
            <div className="flex-1 overflow-auto p-3">
              <div className="mb-2 pb-2 border-b border-[#c0c0c0]">
                <div className="text-[11px]"><strong>From:</strong> {selectedEmail.from}</div>
                <div className="text-[11px]"><strong>Date:</strong> {selectedEmail.date}</div>
                <div className="text-[11px]"><strong>Subject:</strong> {selectedEmail.subject}</div>
              </div>
              <pre className="text-[11px] whitespace-pre-wrap font-[system-ui]">{selectedEmail.body}</pre>
              <button
                onClick={() => setSelectedEmail(null)}
                className="mt-3 win-button px-3 py-0.5 text-[11px]"
              >
                ← Back to Inbox
              </button>
            </div>
          ) : (
            /* Inbox view */
            <div className="flex-1 flex flex-col">
              {/* Welcome banner */}
              <div className="p-3 border-b border-[#808080]">
                <div className="text-[18px] font-bold">
                  <span className="text-[#000080]">Outlook</span>
                  {" "}
                  <span className="text-[#00c8c8]">Express</span>
                </div>
              </div>

              {/* Email section */}
              <div className="p-3">
                <div className="text-[12px] font-bold mb-2">E-mail</div>
                <div className="flex items-center gap-2 mb-2">
                  <span>✉️</span>
                  <span className="text-[11px]">
                    There is <button onClick={() => openEmail(emails[0])} className="font-bold underline text-[#0000ff] cursor-pointer">1 unread Mail message</button> in your Inbox
                  </span>
                </div>

                {/* Email list */}
                <div className="border border-[#808080] mt-2">
                  <div className="flex items-center h-[18px] bg-[#c0c0c0] border-b border-[#808080] px-2 text-[10px] font-bold">
                    <span className="w-[30px]">!</span>
                    <span className="flex-1">From</span>
                    <span className="w-[200px]">Subject</span>
                    <span className="w-[100px]">Received</span>
                  </div>
                  {emails.map((email, i) => (
                    <div
                      key={i}
                      onClick={() => openEmail(email)}
                      className={`flex items-center h-[18px] px-2 text-[10px] cursor-default hover:bg-[#000080] hover:text-white ${!email.read ? "font-bold" : ""}`}
                    >
                      <span className="w-[30px]">{email.read ? "📧" : "✉️"}</span>
                      <span className="flex-1 truncate">{email.from}</span>
                      <span className="w-[200px] truncate">{email.subject}</span>
                      <span className="w-[100px]">{email.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center h-[20px] px-2 border-t border-[#808080] text-[10px]">
        <span>📧</span>
        <span className="ml-1">Working Online</span>
      </div>
    </div>
  );
}

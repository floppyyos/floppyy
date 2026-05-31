"use client";

import { useState } from "react";

const suits = ["♥", "♣", "♦", "♠"];

export function Solitaire({ playSound }: { playSound: (name: string) => void }) {
  const [cards, setCards] = useState([
    { id: 1, x: 18, y: 44, rank: "A", suit: "♥" },
    { id: 2, x: 86, y: 64, rank: "K", suit: "♠" },
    { id: 3, x: 154, y: 84, rank: "7", suit: "♦" },
  ]);

  return (
    <div className="win-bevel-inset relative h-64 overflow-hidden bg-[#008000]">
      <div className="absolute left-3 top-3 flex gap-3">
        {suits.map((suit) => (
          <div key={suit} className="h-20 w-14 border-2 border-[#004a00] text-center text-2xl text-[#004a00]">
            {suit}
          </div>
        ))}
      </div>
      {cards.map((card) => (
        <button
          key={card.id}
          draggable
          onDragStart={(event) => {
            event.dataTransfer.setData("text/plain", String(card.id));
            playSound("click");
          }}
          onDragEnd={(event) => {
            const bounds = event.currentTarget.parentElement?.getBoundingClientRect();
            if (!bounds) return;
            setCards((items) =>
              items.map((item) =>
                item.id === card.id ? { ...item, x: event.clientX - bounds.left - 28, y: event.clientY - bounds.top - 38 } : item,
              ),
            );
          }}
          className="absolute h-20 w-14 rounded-sm border border-black bg-white text-left text-lg shadow"
          style={{ left: card.x, top: card.y, color: card.suit === "♥" || card.suit === "♦" ? "#c00000" : "#000" }}
        >
          <span className="block px-1">{card.rank}</span>
          <span className="block text-center text-2xl">{card.suit}</span>
        </button>
      ))}
    </div>
  );
}

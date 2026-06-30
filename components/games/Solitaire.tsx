"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GameMenuBar, GameStatusBar } from "./GameChrome";

const CARD_W = 71;
const CARD_H = 96;
const COL_GAP = 12;
const TOP_Y = 14;
const TABLEAU_Y = TOP_Y + CARD_H + 16;
const FACE_DOWN_OFFSET = 5;
const FACE_UP_OFFSET = 19;

const SUIT_GLYPHS = ["\u2663", "\u2666", "\u2665", "\u2660"]; // clubs, diamonds, hearts, spades
const RANK_LABELS = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

// cards.png row 4 (y = -384) holds the 12 card-back designs in columns 1..12.
// Column 1 is the classic red robot. A random back is picked for each new deal.
const BACK_ROW_Y = 384;
const BACK_COUNT = 12;
const randomBack = () => Math.floor(Math.random() * BACK_COUNT) + 1;

type Card = {
  id: string;
  suit: number; // 0 clubs, 1 diamonds, 2 hearts, 3 spades
  rank: number; // 1..13
  faceUp: boolean;
};

type PileKind = "stock" | "waste" | "foundation" | "tableau";
type DragSource = { kind: PileKind; pile: number; index: number };

type GameState = {
  stock: Card[];
  waste: Card[];
  foundations: Card[][];
  tableau: Card[][];
};

const isRed = (suit: number) => suit === 1 || suit === 2;
const oppositeColor = (a: Card, b: Card) => isRed(a.suit) !== isRed(b.suit);

function buildDeck(): Card[] {
  const deck: Card[] = [];
  for (let suit = 0; suit < 4; suit++) {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({ id: `${suit}-${rank}`, suit, rank, faceUp: false });
    }
  }
  return deck;
}

function shuffle(deck: Card[]): Card[] {
  const out = [...deck];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function deal(): GameState {
  const deck = shuffle(buildDeck());
  const tableau: Card[][] = [[], [], [], [], [], [], []];
  let pointer = 0;
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = deck[pointer++];
      card.faceUp = row === col;
      tableau[col].push(card);
    }
  }
  const stock = deck.slice(pointer).map((card) => ({ ...card, faceUp: false }));
  return { stock, waste: [], foundations: [[], [], [], []], tableau };
}

export function Solitaire({ playSound }: { playSound: (name: string) => void }) {
  const [game, setGame] = useState<GameState>(() => deal());
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const [won, setWon] = useState(false);
  const [backIndex, setBackIndex] = useState<number>(() => randomBack());
  const dragRef = useRef<DragSource | null>(null);
  // Click-to-move selection (works alongside drag-and-drop, and on touch).
  const [selected, setSelected] = useState<DragSource | null>(null);

  const newGame = useCallback(() => {
    setGame(deal());
    setScore(0);
    setSeconds(0);
    setStarted(false);
    setWon(false);
    setSelected(null);
    setBackIndex(randomBack());
    playSound("click");
  }, [playSound]);

  // Timer
  useEffect(() => {
    if (!started || won) return;
    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, [started, won]);

  const begin = useCallback(() => {
    setStarted(true);
  }, []);

  const checkWin = useCallback((state: GameState) => {
    if (state.foundations.every((pile) => pile.length === 13)) {
      setWon(true);
      playSound("click");
    }
  }, [playSound]);

  // Draw from stock to waste (draw one), recycle when empty
  const drawStock = useCallback(() => {
    begin();
    setSelected(null);
    playSound("click");
    setGame((prev) => {
      if (prev.stock.length === 0) {
        if (prev.waste.length === 0) return prev;
        const stock = [...prev.waste].reverse().map((c) => ({ ...c, faceUp: false }));
        return { ...prev, stock, waste: [] };
      }
      const stock = [...prev.stock];
      const card = stock.pop()!;
      return { ...prev, stock, waste: [...prev.waste, { ...card, faceUp: true }] };
    });
  }, [begin, playSound]);

  const cardsFromSource = (state: GameState, src: DragSource): Card[] => {
    if (src.kind === "waste") return state.waste.slice(-1);
    if (src.kind === "foundation") return state.foundations[src.pile].slice(-1);
    if (src.kind === "tableau") return state.tableau[src.pile].slice(src.index);
    return [];
  };

  const removeFromSource = (state: GameState, src: DragSource, count: number): GameState => {
    const next = {
      stock: state.stock,
      waste: [...state.waste],
      foundations: state.foundations.map((p) => [...p]),
      tableau: state.tableau.map((p) => [...p]),
    };
    if (src.kind === "waste") next.waste.splice(-count, count);
    else if (src.kind === "foundation") next.foundations[src.pile].splice(-count, count);
    else if (src.kind === "tableau") {
      next.tableau[src.pile].splice(next.tableau[src.pile].length - count, count);
      const col = next.tableau[src.pile];
      if (col.length && !col[col.length - 1].faceUp) {
        col[col.length - 1] = { ...col[col.length - 1], faceUp: true };
      }
    }
    return next;
  };

  const canDropTableau = (target: Card[], moving: Card[]) => {
    const first = moving[0];
    if (target.length === 0) return first.rank === 13;
    const top = target[target.length - 1];
    return top.faceUp && oppositeColor(top, first) && top.rank === first.rank - 1;
  };

  const canDropFoundation = (target: Card[], moving: Card[]) => {
    if (moving.length !== 1) return false;
    const card = moving[0];
    if (target.length === 0) return card.rank === 1;
    const top = target[target.length - 1];
    return top.suit === card.suit && top.rank === card.rank - 1;
  };

  const performMove = useCallback(
    (src: DragSource, dest: { kind: "tableau" | "foundation"; pile: number }) => {
      setGame((prev) => {
        const moving = cardsFromSource(prev, src);
        if (moving.length === 0) return prev;
        if (src.kind === dest.kind && src.pile === dest.pile) return prev;

        if (dest.kind === "tableau") {
          if (!canDropTableau(prev.tableau[dest.pile], moving)) return prev;
          const next = removeFromSource(prev, src, moving.length);
          next.tableau[dest.pile] = [...next.tableau[dest.pile], ...moving.map((c) => ({ ...c, faceUp: true }))];
          let delta = 0;
          if (src.kind === "waste") delta = 5;
          if (src.kind === "foundation") delta = -15;
          setScore((v) => Math.max(0, v + delta));
          playSound("click");
          return next;
        }

        // foundation
        if (!canDropFoundation(prev.foundations[dest.pile], moving)) return prev;
        const next = removeFromSource(prev, src, 1);
        next.foundations[dest.pile] = [...next.foundations[dest.pile], { ...moving[0], faceUp: true }];
        setScore((v) => v + 10);
        playSound("click");
        checkWin(next);
        return next;
      });
    },
    [checkWin, playSound],
  );

  const tryDrop = useCallback(
    (dest: { kind: "tableau" | "foundation"; pile: number }) => {
      const src = dragRef.current;
      dragRef.current = null;
      if (!src) return;
      performMove(src, dest);
    },
    [performMove],
  );

  // ===== Click-to-move =====
  // Returns true if `selected` can legally move onto the given destination pile.
  const canMoveTo = useCallback(
    (src: DragSource, dest: { kind: "tableau" | "foundation"; pile: number }) => {
      if (src.kind === dest.kind && src.pile === dest.pile) return false;
      const moving = cardsFromSource(game, src);
      if (moving.length === 0) return false;
      return dest.kind === "tableau"
        ? canDropTableau(game.tableau[dest.pile], moving)
        : canDropFoundation(game.foundations[dest.pile], moving);
    },
    [game],
  );

  // Click a card: place the current selection here if legal, otherwise (re)select it.
  const handleCardClick = useCallback(
    (src: DragSource) => {
      begin();
      if (selected && (src.kind === "tableau" || src.kind === "foundation")) {
        if (selected.kind === src.kind && selected.pile === src.pile) {
          setSelected(null);
          return;
        }
        if (canMoveTo(selected, { kind: src.kind, pile: src.pile })) {
          performMove(selected, { kind: src.kind, pile: src.pile });
          setSelected(null);
          return;
        }
      }
      // toggle selection
      setSelected((curr) =>
        curr && curr.kind === src.kind && curr.pile === src.pile && curr.index === src.index ? null : src,
      );
    },
    [begin, selected, canMoveTo, performMove],
  );

  // Click a pile background / empty slot: drop the selection there if legal.
  const handlePileClick = useCallback(
    (dest: { kind: "tableau" | "foundation"; pile: number }) => {
      if (!selected) return;
      if (canMoveTo(selected, dest)) performMove(selected, dest);
      setSelected(null);
    },
    [selected, canMoveTo, performMove],
  );

  const isSelected = (kind: PileKind, pile: number, index: number) =>
    !!selected && selected.kind === kind && selected.pile === pile && index >= selected.index;

  // Double-click: auto-send a card to a valid foundation
  const autoToFoundation = useCallback(
    (src: DragSource) => {
      begin();
      setGame((prev) => {
        const moving = cardsFromSource(prev, src);
        if (moving.length !== 1) return prev;
        const card = moving[0];
        for (let f = 0; f < 4; f++) {
          const target = prev.foundations[f];
          const ok = target.length === 0 ? card.rank === 1 : target[target.length - 1].suit === card.suit && target[target.length - 1].rank === card.rank - 1;
          if (ok) {
            const next = removeFromSource(prev, src, 1);
            next.foundations[f] = [...next.foundations[f], { ...card, faceUp: true }];
            setScore((v) => v + 10);
            playSound("click");
            checkWin(next);
            return next;
          }
        }
        return prev;
      });
    },
    [begin, checkWin, playSound],
  );

  const handleDragStart = (src: DragSource) => {
    begin();
    dragRef.current = src;
  };

  const allowDrop = (e: React.DragEvent) => e.preventDefault();

  const foundationX = (i: number) => 16 + (3 + i) * (CARD_W + COL_GAP);
  const tableauX = (i: number) => 16 + i * (CARD_W + COL_GAP);

  return (
    <div className="flex h-full min-h-[420px] flex-col bg-[#c0c0c0]">
      <GameMenuBar
        items={[
          { label: "Game", onClick: newGame },
          { label: "Help", onClick: () => playSound("click") },
        ]}
      />
      <div
        className="relative min-h-0 flex-1 overflow-hidden"
        style={{
          background: "#008000",
          boxShadow: "inset 2px 2px #006000, inset -1px -1px #00a000",
        }}
      >
        {/* Stock */}
        <div
          className="absolute"
          style={{ left: 16, top: TOP_Y, width: CARD_W, height: CARD_H }}
          onClick={drawStock}
        >
          {game.stock.length > 0 ? (
            <CardBack backIndex={backIndex} />
          ) : (
            <EmptySlot recycle />
          )}
        </div>

        {/* Waste */}
        <div className="absolute" style={{ left: 16 + CARD_W + COL_GAP, top: TOP_Y, width: CARD_W, height: CARD_H }}>
          {game.waste.length === 0 ? (
            <EmptySlot />
          ) : (
            <CardFace
              card={game.waste[game.waste.length - 1]}
              draggable
              selected={isSelected("waste", 0, game.waste.length - 1)}
              onClick={() => handleCardClick({ kind: "waste", pile: 0, index: game.waste.length - 1 })}
              onDragStart={() => handleDragStart({ kind: "waste", pile: 0, index: game.waste.length - 1 })}
              onDoubleClick={() => autoToFoundation({ kind: "waste", pile: 0, index: game.waste.length - 1 })}
            />
          )}
        </div>

        {/* Foundations */}
        {game.foundations.map((pile, i) => (
          <div
            key={i}
            className="absolute"
            style={{ left: foundationX(i), top: TOP_Y, width: CARD_W, height: CARD_H }}
            onDragOver={allowDrop}
            onDrop={() => tryDrop({ kind: "foundation", pile: i })}
            onClick={() => handlePileClick({ kind: "foundation", pile: i })}
          >
            {pile.length === 0 ? (
              <EmptySlot suit={i} />
            ) : (
              <CardFace
                card={pile[pile.length - 1]}
                draggable
                selected={isSelected("foundation", i, pile.length - 1)}
                onClick={() => handleCardClick({ kind: "foundation", pile: i, index: pile.length - 1 })}
                onDragStart={() => handleDragStart({ kind: "foundation", pile: i, index: pile.length - 1 })}
              />
            )}
          </div>
        ))}

        {/* Tableau */}
        {game.tableau.map((pile, col) => (
          <div
            key={col}
            className="absolute"
            style={{ left: tableauX(col), top: TABLEAU_Y, width: CARD_W, height: CARD_H + pile.length * FACE_UP_OFFSET }}
            onDragOver={allowDrop}
            onDrop={() => tryDrop({ kind: "tableau", pile: col })}
            onClick={() => handlePileClick({ kind: "tableau", pile: col })}
          >
            {pile.length === 0 && <EmptySlot />}
            {pile.map((card, idx) => {
              const y = pile.slice(0, idx).reduce((acc, c) => acc + (c.faceUp ? FACE_UP_OFFSET : FACE_DOWN_OFFSET), 0);
              return (
                <div key={card.id} className="absolute left-0" style={{ top: y }}>
                  {card.faceUp ? (
                    <CardFace
                      card={card}
                      draggable
                      selected={isSelected("tableau", col, idx)}
                      onClick={() => handleCardClick({ kind: "tableau", pile: col, index: idx })}
                      onDragStart={() => handleDragStart({ kind: "tableau", pile: col, index: idx })}
                      onDoubleClick={() => idx === pile.length - 1 && autoToFoundation({ kind: "tableau", pile: col, index: idx })}
                    />
                  ) : (
                    <CardBack backIndex={backIndex} />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {won && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="win-bevel bg-[#c0c0c0] px-[28px] py-[20px] text-center">
              <div className="mb-[10px] text-[16px] font-bold">You won!</div>
              <button className="win-button min-w-[96px]" onClick={newGame}>
                Deal again
              </button>
            </div>
          </div>
        )}
      </div>
      <GameStatusBar>
        Score: {score}
        <span className="ml-auto">Time: {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}</span>
      </GameStatusBar>
    </div>
  );
}

function CardFace({
  card,
  draggable,
  selected,
  onClick,
  onDragStart,
  onDoubleClick,
}: {
  card: Card;
  draggable?: boolean;
  selected?: boolean;
  onClick?: () => void;
  onDragStart?: () => void;
  onDoubleClick?: () => void;
}) {
  return (
    <div
      draggable={draggable}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", card.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.();
      }}
      onDoubleClick={onDoubleClick}
      aria-label={`${RANK_LABELS[card.rank]} of ${["clubs", "diamonds", "hearts", "spades"][card.suit]}`}
      role="img"
      className="select-none rounded-[5px] bg-white"
      style={{
        width: CARD_W,
        height: CARD_H,
        boxShadow: selected ? "0 0 0 2px #1e90ff, 0 0 6px #1e90ff" : "0 0 0 1px #808080",
        backgroundImage: "url('/game-assets/solitaire/cards.png')",
        backgroundPosition: `${-(card.rank - 1) * CARD_W}px ${-card.suit * CARD_H}px`,
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
      }}
    />
  );
}

function CardBack({ backIndex }: { backIndex: number }) {
  return (
    <div
      aria-hidden="true"
      className="select-none rounded-[5px]"
      style={{
        width: CARD_W,
        height: CARD_H,
        boxShadow: "0 0 0 1px #808080",
        backgroundImage: "url('/game-assets/solitaire/cards.png')",
        backgroundPosition: `${-backIndex * CARD_W}px ${-BACK_ROW_Y}px`,
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
      }}
    />
  );
}

function EmptySlot({ suit, recycle }: { suit?: number; recycle?: boolean }) {
  return (
    <div
      className="flex items-center justify-center rounded-[5px]"
      style={{ width: CARD_W, height: CARD_H, border: "2px solid #006000" }}
    >
      {typeof suit === "number" && (
        <span className="text-[30px] text-[#006000]">{SUIT_GLYPHS[suit]}</span>
      )}
      {recycle && <span className="text-[26px] text-[#006000]">{"\u21BA"}</span>}
    </div>
  );
}

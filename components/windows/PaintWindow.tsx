"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Tool = "pencil" | "brush" | "eraser" | "fill" | "line" | "rect" | "filledRect" | "ellipse" | "filledEllipse" | "spray" | "picker" | "text" | "select";

const COLORS = [
  "#000000", "#808080", "#800000", "#808000", "#008000", "#008080", "#000080", "#800080",
  "#808040", "#004040", "#0080ff", "#004080", "#4000ff", "#804000",
  "#ffffff", "#c0c0c0", "#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff",
  "#ffff80", "#00ff80", "#80ffff", "#8080ff", "#ff0080", "#ff8040",
];

const TOOLS: { id: Tool; label: string; icon: string }[] = [
  { id: "select", label: "Select", icon: "✣" },
  { id: "eraser", label: "Eraser", icon: "▣" },
  { id: "picker", label: "Pick Color", icon: "⌇" },
  { id: "fill", label: "Fill", icon: "◈" },
  { id: "pencil", label: "Pencil", icon: "✎" },
  { id: "brush", label: "Brush", icon: "♜" },
  { id: "spray", label: "Airbrush", icon: "◒" },
  { id: "text", label: "Text", icon: "A" },
  { id: "line", label: "Line", icon: "╲" },
  { id: "rect", label: "Rectangle", icon: "□" },
  { id: "filledRect", label: "Filled Rectangle", icon: "▱" },
  { id: "ellipse", label: "Ellipse", icon: "○" },
  { id: "filledEllipse", label: "Filled Ellipse", icon: "▭" },
];

const BRUSH_SIZES = [1, 2, 3, 5, 8];

export function PaintWindow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>("pencil");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(2);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [statusText, setStatusText] = useState("For Help, click Help Topics on the Help Menu.");
  const [coords, setCoords] = useState("");
  const undoStack = useRef<ImageData[]>([]);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const saveUndo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStack.current.push(data);
    if (undoStack.current.length > 30) undoStack.current.shift();
  }, []);

  // Initialize canvas with white background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveUndo();
  }, [saveUndo]);

  const undo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (undoStack.current.length > 1) {
      undoStack.current.pop();
      const prev = undoStack.current[undoStack.current.length - 1];
      ctx.putImageData(prev, 0, 0);
    }
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    saveUndo();
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [bgColor, saveUndo]);

  const getCanvasPos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: Math.floor((e.clientX - rect.left) * scaleX),
      y: Math.floor((e.clientY - rect.top) * scaleY),
    };
  }, []);

  const drawLine = useCallback((ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, strokeColor: string, size: number) => {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }, []);

  const floodFill = useCallback((startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const w = canvas.width;
    const h = canvas.height;

    const idx = (startY * w + startX) * 4;
    const targetR = data[idx];
    const targetG = data[idx + 1];
    const targetB = data[idx + 2];
    const targetA = data[idx + 3];

    // Parse fill color
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 1;
    tempCanvas.height = 1;
    const tempCtx = tempCanvas.getContext("2d")!;
    tempCtx.fillStyle = fillColor;
    tempCtx.fillRect(0, 0, 1, 1);
    const fillData = tempCtx.getImageData(0, 0, 1, 1).data;
    const fillR = fillData[0];
    const fillG = fillData[1];
    const fillB = fillData[2];
    const fillA = fillData[3];

    if (targetR === fillR && targetG === fillG && targetB === fillB && targetA === fillA) return;

    const match = (i: number) =>
      data[i] === targetR && data[i + 1] === targetG && data[i + 2] === targetB && data[i + 3] === targetA;

    const stack: [number, number][] = [[startX, startY]];
    const visited = new Uint8Array(w * h);

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const pos = y * w + x;
      if (x < 0 || x >= w || y < 0 || y >= h) continue;
      if (visited[pos]) continue;
      const i = pos * 4;
      if (!match(i)) continue;

      visited[pos] = 1;
      data[i] = fillR;
      data[i + 1] = fillG;
      data[i + 2] = fillB;
      data[i + 3] = fillA;

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  }, []);

  const sprayAt = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = color;
    const radius = brushSize * 4;
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * radius;
      const px = Math.floor(x + Math.cos(angle) * dist);
      const py = Math.floor(y + Math.sin(angle) * dist);
      ctx.fillRect(px, py, 1, 1);
    }
  }, [color, brushSize]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setDrawing(true);
    setStartPos(pos);
    lastPos.current = pos;

    if (tool === "pencil" || tool === "brush") {
      saveUndo();
      ctx.fillStyle = color;
      const size = tool === "brush" ? brushSize * 2 : brushSize;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (tool === "eraser") {
      saveUndo();
      ctx.fillStyle = bgColor;
      const size = brushSize * 3;
      ctx.fillRect(pos.x - size / 2, pos.y - size / 2, size, size);
    } else if (tool === "fill") {
      saveUndo();
      floodFill(pos.x, pos.y, e.button === 2 ? bgColor : color);
    } else if (tool === "picker") {
      const pixel = ctx.getImageData(pos.x, pos.y, 1, 1).data;
      const hex = "#" + [pixel[0], pixel[1], pixel[2]].map(v => v.toString(16).padStart(2, "0")).join("");
      if (e.button === 2) {
        setBgColor(hex);
      } else {
        setColor(hex);
      }
    } else if (tool === "spray") {
      saveUndo();
      sprayAt(ctx, pos.x, pos.y);
    } else if (tool === "line" || tool === "rect" || tool === "filledRect" || tool === "ellipse" || tool === "filledEllipse") {
      saveUndo();
    }
  }, [tool, color, bgColor, brushSize, getCanvasPos, saveUndo, floodFill, sprayAt]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasPos(e);
    setCoords(`${pos.x}, ${pos.y}px`);

    if (!drawing) return;

    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;
    const ctx = canvas.getContext("2d");
    const overlayCtx = overlay.getContext("2d");
    if (!ctx || !overlayCtx) return;

    if (tool === "pencil" || tool === "brush") {
      const prev = lastPos.current || pos;
      const size = tool === "brush" ? brushSize * 2 : brushSize;
      drawLine(ctx, prev.x, prev.y, pos.x, pos.y, color, size);
      lastPos.current = pos;
    } else if (tool === "eraser") {
      const prev = lastPos.current || pos;
      const size = brushSize * 3;
      // Draw eraser path
      ctx.fillStyle = bgColor;
      const dx = pos.x - prev.x;
      const dy = pos.y - prev.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(1, Math.floor(dist));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = prev.x + dx * t;
        const y = prev.y + dy * t;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
      lastPos.current = pos;
    } else if (tool === "spray") {
      sprayAt(ctx, pos.x, pos.y);
      lastPos.current = pos;
    } else if ((tool === "line" || tool === "rect" || tool === "filledRect" || tool === "ellipse" || tool === "filledEllipse") && startPos) {
      // Draw preview on overlay
      overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
      overlayCtx.strokeStyle = color;
      overlayCtx.fillStyle = color;
      overlayCtx.lineWidth = brushSize;
      overlayCtx.lineCap = "round";

      if (tool === "line") {
        overlayCtx.beginPath();
        overlayCtx.moveTo(startPos.x, startPos.y);
        overlayCtx.lineTo(pos.x, pos.y);
        overlayCtx.stroke();
      } else if (tool === "rect") {
        const x = Math.min(startPos.x, pos.x);
        const y = Math.min(startPos.y, pos.y);
        const w = Math.abs(pos.x - startPos.x);
        const h = Math.abs(pos.y - startPos.y);
        overlayCtx.strokeRect(x, y, w, h);
      } else if (tool === "filledRect") {
        const x = Math.min(startPos.x, pos.x);
        const y = Math.min(startPos.y, pos.y);
        const w = Math.abs(pos.x - startPos.x);
        const h = Math.abs(pos.y - startPos.y);
        overlayCtx.fillRect(x, y, w, h);
      } else if (tool === "ellipse" || tool === "filledEllipse") {
        const cx = (startPos.x + pos.x) / 2;
        const cy = (startPos.y + pos.y) / 2;
        const rx = Math.abs(pos.x - startPos.x) / 2;
        const ry = Math.abs(pos.y - startPos.y) / 2;
        overlayCtx.beginPath();
        overlayCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        if (tool === "filledEllipse") {
          overlayCtx.fill();
        } else {
          overlayCtx.stroke();
        }
      }
    }
  }, [drawing, tool, color, bgColor, brushSize, getCanvasPos, startPos, drawLine, sprayAt]);

  const handleMouseUp = useCallback(() => {
    if (!drawing) return;
    setDrawing(false);

    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;
    const ctx = canvas.getContext("2d");
    const overlayCtx = overlay.getContext("2d");
    if (!ctx || !overlayCtx) return;

    if ((tool === "line" || tool === "rect" || tool === "filledRect" || tool === "ellipse" || tool === "filledEllipse") && startPos) {
      // Commit overlay to main canvas
      ctx.drawImage(overlay, 0, 0);
      overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
    }

    lastPos.current = null;
    setStartPos(null);
  }, [drawing, tool, startPos]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="flex h-full flex-col bg-[#c0c0c0] text-[11px]">
      {/* Menu bar */}
      <div className="window-menu-bar">
        {["File", "Edit", "View", "Image", "Colors", "Help"].map((item) => (
          <button key={item} className="window-menu-item">
            <span className="underline">{item[0]}</span>{item.slice(1)}
          </button>
        ))}
      </div>

      {/* Main area */}
      <div className="flex min-h-0 flex-1">
        {/* Toolbox */}
        <aside className="w-[58px] shrink-0 border-r border-[#808080] bg-[#c0c0c0] p-[3px]">
          <div className="grid grid-cols-2 gap-[1px]">
            {TOOLS.map((t) => (
              <button
                key={t.id}
                className={`flex h-[24px] w-[24px] items-center justify-center text-[13px] ${
                  tool === t.id ? "win-button active p-0" : "win-button p-0"
                }`}
                title={t.label}
                onClick={() => {
                  setTool(t.id);
                  setStatusText(t.label);
                }}
              >
                {t.icon}
              </button>
            ))}
          </div>

          {/* Brush size selector */}
          <div className="mt-[6px] border border-[#808080] bg-[#c0c0c0] p-[3px]">
            {BRUSH_SIZES.map((size) => (
              <button
                key={size}
                className={`mb-[2px] flex w-full items-center justify-center h-[14px] ${
                  brushSize === size ? "bg-[#000080]" : "bg-white"
                }`}
                onClick={() => setBrushSize(size)}
                title={`Size ${size}`}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: Math.min(size * 2, 16),
                    height: Math.min(size * 2, 16),
                    backgroundColor: brushSize === size ? "#ffffff" : "#000000",
                  }}
                />
              </button>
            ))}
          </div>
        </aside>

        {/* Canvas area */}
        <main className="relative min-w-0 flex-1 overflow-auto bg-[#808080] p-[2px]">
          <div className="relative inline-block">
            <canvas
              ref={canvasRef}
              width={640}
              height={400}
              className="block cursor-crosshair bg-white"
              style={{ imageRendering: "auto" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => { if (drawing) handleMouseUp(); }}
              onContextMenu={handleContextMenu}
            />
            <canvas
              ref={overlayRef}
              width={640}
              height={400}
              className="pointer-events-none absolute inset-0 block"
              style={{ imageRendering: "auto" }}
            />
            {/* Resize handles */}
            <span className="absolute -bottom-[3px] -right-[3px] h-[5px] w-[5px] bg-[#000080]" />
            <span className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 h-[5px] w-[5px] bg-[#000080]" />
            <span className="absolute top-1/2 -right-[3px] -translate-y-1/2 h-[5px] w-[5px] bg-[#000080]" />
          </div>
        </main>
      </div>

      {/* Color palette */}
      <div className="flex h-[38px] items-center border-t border-[#ffffff] bg-[#c0c0c0] px-[6px]">
        {/* Current colors indicator */}
        <div className="relative mr-[8px] h-[28px] w-[28px]">
          <div
            className="absolute bottom-0 right-0 h-[18px] w-[18px] border border-[#808080]"
            style={{ backgroundColor: bgColor }}
            title="Background color (right-click to set)"
          />
          <div
            className="absolute left-0 top-0 h-[18px] w-[18px] border border-[#808080]"
            style={{ backgroundColor: color }}
            title="Foreground color (left-click to set)"
          />
        </div>

        {/* Color swatches */}
        <div className="grid grid-cols-14 gap-[1px]">
          {COLORS.map((c) => (
            <button
              key={c}
              className="h-[14px] w-[14px] border border-[#808080]"
              style={{ background: c }}
              aria-label={c}
              onClick={() => setColor(c)}
              onContextMenu={(e) => {
                e.preventDefault();
                setBgColor(c);
              }}
              title={`Left: foreground, Right: background`}
            />
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="status-bar">
        <p className="status-bar-field flex-[2]">{statusText}</p>
        <p className="status-bar-field max-w-[120px] text-center">{coords}</p>
        <p className="status-bar-field max-w-[100px] text-center">
          <button className="text-[10px] underline" onClick={undo} title="Undo (Ctrl+Z)">Undo</button>
          {" | "}
          <button className="text-[10px] underline" onClick={clearCanvas} title="Clear canvas">Clear</button>
        </p>
      </div>
    </div>
  );
}

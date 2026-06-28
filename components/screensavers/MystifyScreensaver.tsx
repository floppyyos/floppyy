"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number; vx: number; vy: number };

export function MystifyScreensaver() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let animation = 0;
    let hue = 0;
    const shapes: Point[][] = Array.from({ length: 3 }, (_, shape) =>
      Array.from({ length: 4 }, (_, point) => ({
        x: 80 + shape * 110 + point * 35,
        y: 60 + point * 45,
        vx: 0.8 + ((shape + point) % 3) * 0.55,
        vy: 0.7 + ((shape * 2 + point) % 4) * 0.4,
      })),
    );

    const resize = () => {
      canvas.width = Math.max(320, window.innerWidth);
      canvas.height = Math.max(240, window.innerHeight);
      context.fillStyle = "#000";
      context.fillRect(0, 0, canvas.width, canvas.height);
    };

    const draw = () => {
      context.fillStyle = "rgba(0, 0, 0, 0.075)";
      context.fillRect(0, 0, canvas.width, canvas.height);
      hue = (hue + 0.8) % 360;

      shapes.forEach((points, shapeIndex) => {
        points.forEach((point) => {
          point.x += point.vx;
          point.y += point.vy;
          if (point.x <= 0 || point.x >= canvas.width) point.vx *= -1;
          if (point.y <= 0 || point.y >= canvas.height) point.vy *= -1;
        });

        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach((point) => context.lineTo(point.x, point.y));
        context.closePath();
        context.strokeStyle = `hsl(${(hue + shapeIndex * 105) % 360} 100% 62%)`;
        context.lineWidth = 2;
        context.stroke();
      });

      animation = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    animation = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(animation);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full bg-black" aria-label="Mystify screensaver" />;
}

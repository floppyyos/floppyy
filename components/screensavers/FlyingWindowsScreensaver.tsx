"use client";

const WINDOWS = Array.from({ length: 28 }, (_, index) => ({
  left: (index * 37) % 100,
  top: (index * 61) % 100,
  size: 18 + (index % 5) * 10,
  duration: 5 + (index % 7) * 0.7,
  delay: -(index % 9) * 0.8,
}));

export function FlyingWindowsScreensaver() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {WINDOWS.map((item, index) => (
        <img
          key={index}
          src="/icons/win.png"
          alt=""
          draggable={false}
          className="absolute select-none"
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
            width: item.size,
            height: item.size,
            imageRendering: "pixelated",
            animation: `flying-window ${item.duration}s linear ${item.delay}s infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes flying-window {
          0% {
            opacity: 0;
            transform: translate(-28vw, 32vh) scale(0.2) rotate(-14deg);
          }
          12% { opacity: 1; }
          88% { opacity: 1; }
          100% {
            opacity: 0;
            transform: translate(38vw, -42vh) scale(2.8) rotate(18deg);
          }
        }
      `}</style>
    </div>
  );
}

"use client";

export function PipesScreensaver() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {Array.from({ length: 18 }, (_, index) => (
        <span
          key={index}
          className="absolute block bg-[#37d65a] shadow-[inset_-5px_-5px_0_#0b6f28,inset_5px_5px_0_#afffbf]"
          style={{
            width: index % 2 ? 22 : 120,
            height: index % 2 ? 120 : 22,
            left: `${(index * 73) % 92}%`,
            top: `${(index * 41) % 88}%`,
            animation: `pipe ${4 + (index % 5)}s steps(8) infinite alternate`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes pipe {
          to {
            transform: translate(80px, 70px);
            filter: hue-rotate(80deg);
          }
        }
      `}</style>
    </div>
  );
}

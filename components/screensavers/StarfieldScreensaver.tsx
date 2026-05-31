"use client";

export function StarfieldScreensaver() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {Array.from({ length: 110 }, (_, index) => (
        <span
          key={index}
          className="absolute block rounded-full bg-white"
          style={{
            width: (index % 3) + 1,
            height: (index % 3) + 1,
            left: `${(index * 37) % 100}%`,
            top: `${(index * 61) % 100}%`,
            animation: `star ${1.4 + (index % 7) * 0.25}s linear infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes star {
          from {
            transform: translateZ(0) scale(0.4);
            opacity: 0.4;
          }
          to {
            transform: translate(42vw, 28vh) scale(2.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

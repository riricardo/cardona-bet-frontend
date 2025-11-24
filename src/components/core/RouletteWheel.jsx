import React, { useEffect, useRef, useState } from "react";

const numbers = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

const redNumbers = new Set([
  32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3,
]);

export default function RouletteWheel({ onSelect }) {
  const ref = useRef(null);
  const [layout, setLayout] = useState({
    radius: 200,
    buttonSize: 48,
  });

  // how much of the available arc each button uses
  // smaller = more gap
  const fillRatio = 0.7; // try 0.6, 0.8, 1.0 etc.

  useEffect(() => {
    const update = () => {
      if (!ref.current) return;

      const w = ref.current.offsetWidth;
      const h = ref.current.offsetHeight;

      // biggest circle that fits on screen
      const maxRadius = Math.min(w, h) / 2 - 20;
      const radius = maxRadius;

      const count = numbers.length;
      const circumference = 2 * Math.PI * radius;

      const spacing = circumference / count; // distance from center of one button to the next along the arc

      // button size is a fraction of that spacing -> creates visual gap
      const idealButton = spacing * fillRatio;

      const buttonSize = Math.max(
        6, // minimum so it doesn't disappear
        Math.min(48, idealButton) // don't let it get huge
      );

      setLayout({ radius, buttonSize });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { radius, buttonSize } = layout;

  return (
    <div
      ref={ref}
      className="w-full h-screen flex items-center justify-center bg-neutral-900"
    >
      <div
        className="relative"
        style={{
          width: radius * 2 + buttonSize * 2,
          height: radius * 2 + buttonSize * 2,
        }}
      >
        {numbers.map((num, i) => {
          const angle = (i / numbers.length) * 2 * Math.PI;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          const backgroundColor =
            num === 0
              ? "#0f0" // green
              : redNumbers.has(num)
              ? "#c00" // red
              : "#000"; // black

          return (
            <button
              key={num}
              onClick={() => onSelect?.(num)}
              className="absolute rounded-full text-white font-bold flex items-center justify-center shadow-md"
              style={{
                width: buttonSize,
                height: buttonSize,
                fontSize: buttonSize * 0.35,
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
                backgroundColor,
              }}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}

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

  const [highlightIndex, setHighlightIndex] = useState(-1);
  const count = numbers.length;

  // how much arc each button fills (lower = more gap)
  const fillRatio = 0.7;

  // recalc radius + button size
  useEffect(() => {
    const update = () => {
      if (!ref.current) return;

      const w = ref.current.offsetWidth;
      const h = ref.current.offsetHeight;

      const maxRadius = Math.min(w, h) / 2 - 20;
      const radius = maxRadius;

      const circumference = 2 * Math.PI * radius;
      const spacing = circumference / count;

      const buttonSize = Math.max(6, Math.min(48, spacing * fillRatio));

      setLayout({ radius, buttonSize });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { radius, buttonSize } = layout;

  // -----------------------------
  // ⭐ SPIN ANIMATION
  // -----------------------------
  function spin() {
    let index = 0;
    let speed = 30; // fast at start
    let steps = count * 3 + Math.floor(Math.random() * count); // random stop

    function animate() {
      setHighlightIndex(index % count);

      if (steps <= 0) {
        const finalNumber = numbers[index % count];
        onSelect?.(finalNumber);
        return;
      }

      steps--;
      index++;

      // slow down gradually
      speed += 3;

      setTimeout(animate, speed);
    }

    animate();
  }

  // -----------------------------
  // 🌟 RENDER
  // -----------------------------

  return (
    <div
      ref={ref}
      className="w-full h-screen flex flex-col items-center justify-center"
    >
      {/* SPIN BUTTON */}
      <button onClick={spin} className="btn btn-accent">
        SPIN
      </button>

      {/* THE WHEEL */}
      <div
        className="relative"
        style={{
          width: radius * 2 + buttonSize * 2,
          height: radius * 2 + buttonSize * 2,
        }}
      >
        {numbers.map((num, i) => {
          const angle = (i / count) * Math.PI * 2;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          const baseColor =
            num === 0
              ? "#0f0" // green
              : redNumbers.has(num)
              ? "#c00" // red
              : "#000"; // black

          const isHighlighted = highlightIndex === i;

          return (
            <div
              key={num}
              className="absolute rounded-full text-white font-bold flex items-center justify-center shadow-md transition-all duration-100"
              style={{
                width: buttonSize,
                height: buttonSize,
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
                backgroundColor: baseColor,
                opacity: isHighlighted ? 1 : 0.35,
                filter: isHighlighted ? "drop-shadow(0 0 6px #fff)" : "none",
                fontSize: buttonSize * 0.35,
              }}
            >
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
}

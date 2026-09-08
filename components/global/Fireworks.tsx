"use client";

import React, { useState } from "react";

export const PALETTE = [
  "#818CF8",
  "#F472B6",
  "#38BDF8",
  "#34D399",
  "#FBBF24",
  "#A78BFA",
  "#FB7185",
  "#2DD4BF",
];

interface Particle {
  id: number;
  tx: number;
  ty: number;
  color: string;
  delay: number;
  duration: number;
}

function generateParticles(particleCount: number): Particle[] {
  return Array.from({ length: particleCount }, (_, i) => {
    const angleJitter = Math.random() * 20 - 10;
    const angle = (i * 360) / particleCount + angleJitter;
    const distance = 160 + Math.random() * 110;
    const rad = (angle * Math.PI) / 180;
    const tx = Math.cos(rad) * distance;
    const ty = Math.sin(rad) * distance + 35;
    const delay = Math.random() * 120;
    const duration = 1000 + Math.random() * 300;

    return {
      id: i,
      tx,
      ty,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      delay,
      duration,
    };
  });
}

export function Fireworks({ particleCount = 48 }: { particleCount?: number }) {
  const [particles] = useState<Particle[]>(() =>
    generateParticles(particleCount),
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center overflow-visible motion-reduce:hidden"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="animate-firework-burst absolute size-2 rounded-full shadow-[0_0_8px_currentColor]"
          style={
            {
              color: p.color,
              backgroundColor: p.color,
              animationDelay: `${p.delay}ms`,
              animationDuration: `${p.duration}ms`,
              "--tx": `${p.tx}px`,
              "--ty": `${p.ty}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

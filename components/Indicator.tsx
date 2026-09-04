import { useEffect, useState, useMemo } from "react";

interface IndicatorProps {
  gridSize: number;
  frames: number[][];
  active?: boolean;
  interval?: number;
  primary?: string;
  secondary?: string;
}

export function Indicator({
  // add defaults (templates)
  gridSize,
  frames,

  primary = "#000",
  secondary = "#0001",
  interval = 150,
  active = true,
}: IndicatorProps) {
  const total = gridSize * gridSize;
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (!active || frames.length <= 1) return;
    const id = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, interval);
    return () => clearInterval(id);
  }, [active, frames, interval]);

  const frame = active ? frameIndex : 0;
  const filled = useMemo(() => new Set(frames[frame] ?? []), [frames, frame]);

  return (
    <div
      className="grid w-fit gap-0.5"
      style={{ gridTemplateColumns: `repeat(${gridSize}, auto)` }}
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="h-1 w-1 rounded-full transition-colors duration-200 ease-in-out"
          style={{ backgroundColor: filled.has(i) ? primary : secondary }}
        />
      ))}
    </div>
  );
}

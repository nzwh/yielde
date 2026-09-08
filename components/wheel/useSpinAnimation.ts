import { useRef, useCallback } from "react";

export function useSpinAnimation(sliceAngle: number) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const accumulatedRotationRef = useRef(0);

  const spinTo = useCallback(
    async (winningIndex: number) => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const sliceCenter = winningIndex * sliceAngle + sliceAngle / 2;
      const targetModulo = (360 - sliceCenter) % 360;
      const microJitter = (Math.random() - 0.5) * (sliceAngle * 0.65);

      const currentRotation = accumulatedRotationRef.current;
      const currentNormalized = currentRotation % 360;

      let rotationDelta = targetModulo + microJitter - currentNormalized;
      if (rotationDelta <= 0) rotationDelta += 360;
      rotationDelta += (prefersReduced ? 1 : 5) * 360;

      const finalRotation = currentRotation + rotationDelta;
      const duration = prefersReduced ? 750 : 5000;

      const animation = wheelRef.current?.animate(
        [
          { transform: `rotate(${currentRotation}deg)` },
          { transform: `rotate(${finalRotation}deg)` },
        ],
        {
          duration,
          easing: prefersReduced
            ? "ease-out"
            : "cubic-bezier(0.32, 0, 0.05, 1)",
          fill: "forwards",
        },
      );

      if (!animation) return false;

      try {
        await animation?.finished;
      } catch {
        return false;
      }
      accumulatedRotationRef.current = finalRotation;
      return true;
    },
    [sliceAngle],
  );

  return { wheelRef, spinTo };
}

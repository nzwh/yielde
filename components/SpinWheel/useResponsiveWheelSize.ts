"use client";

import { useState, useEffect } from "react";

export function useResponsiveWheelSize(maxSize: number, padding = 32) {
  const [size, setSize] = useState(maxSize);

  useEffect(() => {
    const update = () =>
      setSize(Math.min(maxSize, window.innerWidth - padding * 2));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [maxSize, padding]);

  return size;
}

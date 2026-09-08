"use client";

import { useRef, useCallback } from "react";

export function useSpinSound(muted: boolean, speed = 2.5, volume = 0.6) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  return useCallback(() => {
    if (muted) return;
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/spin.wav");
    }
    audioRef.current.volume = volume;
    audioRef.current.playbackRate = speed;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }, [muted, speed, volume]);
}

"use client";

import { useRef, useCallback } from "react";

export function useWinSound(muted: boolean, speed = 1.0, volume = 0.8) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  return useCallback(() => {
    if (muted) return;

    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/win.mp3");
    }

    const audio = audioRef.current;
    audio.volume = volume;
    audio.playbackRate = speed;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, [muted, speed, volume]);
}

"use client";

import { useRef, useCallback, useEffect } from "react";

export function useSpinSound(muted: boolean, speed = 2.5, volume = 0.6) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
    };
  }, []);

  return useCallback(() => {
    if (muted) return;
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/spin.wav");
    }
    audioRef.current.volume = volume;
    audioRef.current.playbackRate = speed;
    audioRef.current.currentTime = 0;
    try {
      Promise.resolve(audioRef.current.play()).catch(() => {});
    } catch {}
  }, [muted, speed, volume]);
}

"use client";

import { useRef, useCallback, useEffect } from "react";

export function useWinSound(muted: boolean, speed = 1.0, volume = 0.4) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef(false);
  const disposedRef = useRef(false);

  useEffect(() => {
    return () => {
      disposedRef.current = true;
      audioRef.current?.pause();
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.muted = false;
      }
    };
  }, []);

  const unlock = useCallback(() => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;

    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/win.mp3");
    }
    const audio = audioRef.current;
    audio.muted = true;

    try {
      Promise.resolve(audio.play())
        .then(() => {
          if (disposedRef.current) return;
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
        })
        .catch(() => {});
    } catch {}
  }, []);

  const play = useCallback(() => {
    if (disposedRef.current || muted || !audioRef.current) return;
    const audio = audioRef.current;
    audio.volume = volume;
    audio.playbackRate = speed;
    audio.currentTime = 0;
    try {
      Promise.resolve(audio.play()).catch(() => {});
    } catch {
      // ignore
    }
  }, [muted, speed, volume]);

  return { unlock, play };
}

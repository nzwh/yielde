"use client";

import React, { useState, useCallback } from "react";
import { Fireworks } from "../global/Fireworks";

import { PRIZES } from "./prizes";
import { WheelGeometry } from "./WheelGeometry";
import { WheelHub } from "./WheelHub";
import { WheelControls } from "./WheelControls";
import { WinnerAnnouncement } from "./WinnerAnnouncement";
import { SpinningRing } from "./SpinningRing";
import { RollHistory } from "./RollHistory";

import { useSpinWheel } from "./useSpinWheel";
import { useSpinSound } from "./useSpinSound";
import { useResponsiveWheelSize } from "./useResponsiveWheelSize";
import { useSpinAnimation } from "./useSpinAnimation";
import { useWinSound } from "./useWinSound";

type VisualState = "idle" | "spinning" | "celebrating";
const DESKTOP_MAX_SIZE = 440;

export default function SpinWheel() {
  const size = useResponsiveWheelSize(DESKTOP_MAX_SIZE);

  const { history, spin, releaseLock, fetchHistory } = useSpinWheel();
  const [visualState, setVisualState] = useState<VisualState>("idle");
  const [winner, setWinner] = useState<{
    id: string;
    label: string;
    color: string;
  } | null>(null);
  const [muted, setMuted] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const count = PRIZES.length;
  const sliceAngle = 360 / count;

  const { wheelRef, spinTo } = useSpinAnimation(sliceAngle);
  const playSpinSound = useSpinSound(muted);
  const playWinFanfare = useWinSound(muted);

  const handleSpin = useCallback(async () => {
    if (visualState === "spinning") return;

    setWinner(null);
    setAnnouncement("Wheel is spinning...");

    const result = await spin();
    if (!result || "error" in result) {
      setAnnouncement(result?.error ?? "Failed to spin. Please try again.");
      return;
    }

    setVisualState("spinning");
    playSpinSound();

    await spinTo(result.winningIndex);

    setWinner(result.prize);
    setVisualState("celebrating");
    setAnnouncement(`Result: You won ${result.prize.label}`);
    releaseLock();
    fetchHistory();

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([40, 60, 80]);
    }
    playWinFanfare();
  }, [
    visualState,
    spin,
    releaseLock,
    fetchHistory,
    spinTo,
    playSpinSound,
    playWinFanfare,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const isInteractiveTarget =
      target.tagName === "BUTTON" ||
      target.tagName === "A" ||
      target.tagName === "INPUT" ||
      target.isContentEditable;

    if (isInteractiveTarget) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (visualState === "idle" || visualState === "celebrating") handleSpin();
    }
  };

  const isInteractive = visualState === "idle" || visualState === "celebrating";

  return (
    <div
      className="flex flex-col items-center justify-center gap-12 p-6 outline-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Prize Wheel Game"
    >
      <div className="z-10 flex h-12 items-center justify-center text-center text-[#707070]">
        <WinnerAnnouncement visualState={visualState} winner={winner} />
      </div>
      <div className="sr-only" aria-live="polite" role="status">
        {announcement}
      </div>

      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <SpinningRing />
        {visualState === "celebrating" && <Fireworks />}
        <WheelGeometry
          prizes={PRIZES}
          size={size}
          innerRef={wheelRef}
          onClick={handleSpin}
          isInteractive={isInteractive}
        />
        <WheelHub
          onSpin={handleSpin}
          isInteractive={isInteractive}
          isSpinning={visualState === "spinning"}
        />
      </div>

      <WheelControls
        muted={muted}
        onToggleMute={() => setMuted((prev) => !prev)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      <RollHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
      />
    </div>
  );
}

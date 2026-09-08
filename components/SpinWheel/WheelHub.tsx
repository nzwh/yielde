"use client";

import { dmMono } from "@/app/fonts";
import { cn } from "@/lib/utils";
import { Indicator } from "../global/Indicator";

interface WheelHubProps {
  onSpin: () => void;
  isInteractive: boolean;
  isSpinning: boolean;
}

const ARROW_FRAMES = [
  [0, 1, 2],
  [1, 2, 5],
  [2, 5, 8],
  [5, 8, 7],
  [8, 7, 6],
  [7, 6, 3],
  [6, 3, 0],
  [3, 0, 1],
];

export function WheelHub({ onSpin, isInteractive, isSpinning }: WheelHubProps) {
  return (
    <>
      {/* indicator pin */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-1 left-1/2 z-30 -translate-x-1/2 scale-160"
      >
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
          <path
            d="M16 8.2C16 3.22 12.2 0 8 0C3.8 0 0 3.22 0 8.2C0 11.52 2.67 15.45 8 20C13.33 15.45 16 11.52 16 8.2Z"
            fill="#D9D9D9"
          />
          <path
            d="M16 8.2C16 3.22 12.2 0 8 0C3.8 0 0 3.22 0 8.2C0 11.52 2.67 15.45 8 20C13.33 15.45 16 11.52 16 8.2Z"
            fill="url(#paint0_radial_532_6003)"
          />
          <defs>
            <radialGradient
              id="paint0_radial_532_6003"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(8) rotate(90) scale(20 16)"
            >
              <stop stopColor="#EEEEEE" />
              <stop offset="0.95" stopColor="#D0D0D0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute z-10 flex size-20 items-center justify-center rounded-full bg-[#f0f0f0]" />

      {/* center button */}
      <button
        type="button"
        onClick={isInteractive ? onSpin : undefined}
        disabled={!isInteractive}
        aria-label="Spin the wheel"
        className="absolute z-20 flex size-16 cursor-pointer items-center justify-center rounded-full bg-radial-[at_50%_0%] from-[#EEEEEE] to-[#999999] to-100% p-1 text-xs font-black tracking-wider text-white shadow-[0_0_16px_rgba(0,0,0,0.3)] transition-all hover:scale-105 focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:outline-none active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:hover:scale-100"
      >
        <div
          className={cn(
            dmMono.className,
            "flex size-full items-center justify-center rounded-full bg-radial-[at_50%_100%] from-[#EEEEEE] to-[#999999] text-[#485CE0]",
          )}
        >
          {isSpinning ? (
            <Indicator
              gridSize={3}
              frames={ARROW_FRAMES}
              active={isSpinning}
              primary="#485CE0"
              secondary="#485CE010"
              interval={100}
            />
          ) : (
            "SPIN"
          )}
        </div>
      </button>
    </>
  );
}

"use client";

import { Badge } from "../global/Badge";
import { Logo } from "../global/Logo";
import { LogoutButton } from "../LoginCard/LogoutButton";
import { cn } from "@/lib/utils";

interface WheelControlsProps {
  muted: boolean;
  onToggleMute: () => void;
  onOpenHistory: () => void;
}

export function WheelControls({
  muted,
  onToggleMute,
  onOpenHistory,
}: WheelControlsProps) {
  return (
    <div className="z-10 flex items-center gap-4 font-semibold text-[#707070]">
      <Logo className="h-6 w-auto text-[#798BFF]" />

      <div className="h-3 w-px rounded-full bg-[#D9D9D9]" />

      <Badge
        type="button"
        onClick={onToggleMute}
        className={cn(
          muted ? "bg-transparent" : "",
          "flex cursor-pointer items-center gap-1.5 text-xs transition hover:text-[#454545]",
        )}
        aria-label={muted ? "Unmute audio effects" : "Mute audio effects"}
        padding="px-1.5 py-0.5"
      >
        {muted ? "Sound Off" : "Sound On"}
      </Badge>

      <Badge
        type="button"
        onClick={onOpenHistory}
        className="flex cursor-pointer items-center gap-1.5 text-xs transition hover:text-[#454545] hover:underline"
        padding="px-1.5 py-0.5"
      >
        History
      </Badge>

      <LogoutButton />
    </div>
  );
}

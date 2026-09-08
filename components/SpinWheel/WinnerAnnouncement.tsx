"use client";

import { Badge } from "../global/Badge";
import { FadeIn } from "../global/FadeFlyIn";

type VisualState = "idle" | "spinning" | "celebrating";

interface Winner {
  id: string;
  label: string;
  color: string;
}

interface WinnerAnnouncementProps {
  visualState: VisualState;
  winner: Winner | null;
}

export function WinnerAnnouncement({
  visualState,
  winner,
}: WinnerAnnouncementProps) {
  if (winner && visualState === "celebrating") {
    if (winner.id === "again") {
      return (
        <FadeIn
          key={`winner-${winner.id}`}
          className="flex flex-col items-center gap-2"
          elastic
        >
          <span className="text-sm">Better luck next time!</span>
          <span className="rounded-full bg-[#f0f0f0] px-4 py-1 text-lg font-bold text-[#707070]">
            {winner.label}
          </span>
        </FadeIn>
      );
    }

    return (
      <FadeIn
        key={`winner-${winner.id}`}
        className="flex flex-col items-center gap-2"
        elastic
      >
        <span className="text-sm font-medium">Congratulations! You won:</span>
        <span className="rounded-full bg-[#E4E8FF] px-4 py-1 text-lg font-bold text-[#798BFF]">
          {winner.label}
        </span>
      </FadeIn>
    );
  }

  return (
    <FadeIn
      key="idle-prompt"
      className="text-xs font-medium tracking-wider text-[#737373]"
      elastic
    >
      <p>
        Press<Badge>Space</Badge>or<Badge>Tap the Wheel</Badge>to Spin
      </p>
    </FadeIn>
  );
}

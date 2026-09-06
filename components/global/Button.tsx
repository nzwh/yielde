import { cn } from "@/lib/utils";
import { Indicator } from "./Indicator";

interface ButtonProps {
  submitting: boolean;
  setIsHovered: (hovered: boolean) => void;
  isHovered: boolean;
  label?: string;
  submittingLabel?: string;
}

// todo: convert to templates
const ARROW_FRAMES = [
  [0, 1, 4, 5, 6, 7],
  [1, 2, 5, 7, 8],
  [2, 8],
  [3],
  [0, 3, 4, 6],
];

export function Button({
  submitting,
  setIsHovered,
  isHovered,
  label = "Create your account",
  submittingLabel = "Sit tight! Creating your account...",
}: ButtonProps) {
  return (
    <button
      type="submit"
      disabled={submitting}
      aria-busy={submitting}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "border-[#8290EF] text-white focus:ring-[#3B4ACF]",
        "flex w-full cursor-pointer flex-row items-center justify-center gap-3 rounded-full border py-2",
        "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:brightness-110 focus:ring-1 focus:outline-none disabled:opacity-50",
        "bg-[radial-gradient(circle,#485ce0_10%,#909ff9_100%)]",
        "shadow-[inset_0_2px_0_0_rgba(255,255,255,0.25),0_4px_12px_0_rgba(0,10,144,0.2)]",
      )}
    >
      <Indicator
        gridSize={3}
        frames={ARROW_FRAMES}
        active={isHovered || submitting}
        primary="#fff"
        secondary="#fff1"
      />
      {submitting ? submittingLabel : label}
    </button>
  );
}

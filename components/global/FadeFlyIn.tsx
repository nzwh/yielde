import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  elastic?: boolean;
  className?: string;
}

export function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 500,
  elastic = false,
  className,
}: FadeInProps) {
  const distance = direction === "none" ? "0" : "12px";
  const transform = {
    up: `translateY(${distance})`,
    down: `translateY(-${distance})`,
    left: `translateX(${distance})`,
    right: `translateX(-${distance})`,
    none: "none",
  }[direction];

  return (
    <div
      className={cn("animate-fade-in motion-reduce:animate-none", className)}
      style={
        {
          "--fade-from-transform": transform,
          animationDelay: `${delay}ms`,
          animationDuration: `${duration}ms`,
          animationTimingFunction: elastic
            ? "cubic-bezier(0.34, 1.56, 0.64, 1)"
            : "ease-out",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

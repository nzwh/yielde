"use client";

import { cn } from "@/lib/utils";
import { FIELD_VALIDATOR } from "./validator";

function getPasswordStrength(v: string): number {
  let score = 0;
  score += Math.min(v.length / 12, 1) * 40;
  if (/[A-Z]/.test(v)) score += 20;
  if (/[0-9]/.test(v)) score += 20;
  if (/[^A-Za-z0-9]/.test(v)) score += 20;
  return Math.min(score, 100);
}

const TIERS = [
  { max: 0, label: "Too weak", color: "#737373" },
  { max: 33, label: "Weak", color: "#FF756A" },
  { max: 66, label: "Medium", color: "#FFB020" },
  { max: 100, label: "Strong", color: "#42DD61" },
];

interface PasswordStrengthMeterProps {
  value: string;
  active?: boolean;
  isValid?: boolean;
}

export function PasswordStrengthMeter({
  value,
  active = false,
  isValid = FIELD_VALIDATOR.password(value).valid,
}: PasswordStrengthMeterProps) {
  const hasValue = value.length > 0;
  const isTooWeak = hasValue && !isValid;

  const percent = hasValue ? getPasswordStrength(value) : 0;
  const tierIndex = TIERS.findIndex((t) => percent <= t.max);
  const tier = isTooWeak
    ? TIERS[0]
    : tierIndex === -1
      ? TIERS[TIERS.length - 1]
      : TIERS[tierIndex];

  const label = hasValue ? tier.label : "";
  const color = tier.color;

  const width = !hasValue || isTooWeak ? 0 : tierIndex * (100 / 3);

  return (
    <div
      className={cn(
        "flex flex-col gap-2 text-xs transition-all duration-200 ease-out",
        active
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-1 opacity-0",
      )}
    >
      <div
        className={cn(
          "flex h-1 w-full",
          width > 0 && width < 100 ? "gap-2" : "gap-0",
        )}
      >
        <div
          className="rounded-full transition-all duration-300 ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
        <div className="flex-1 rounded-full bg-[#EDEDED]" />
      </div>
      <div className="flex justify-between font-medium">
        <span className="text-[#737373]">Password Strength:</span>
        <span className="font-semibold" style={{ color }}>
          {label}
        </span>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import type { SpinRecord } from "./useSpinWheel";
import { FadeIn } from "../global/FadeFlyIn";
import { CgClose } from "react-icons/cg";

interface RollHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SpinRecord[];
}

export function RollHistory({
  isOpen,
  onClose,
  history,
}: RollHistoryModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    triggerRef.current = document.activeElement as HTMLElement;
    closeBtnRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        e.preventDefault();
        closeBtnRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
    >
      <FadeIn
        className="relative flex max-h-[60vh] w-full max-w-xs flex-col rounded-lg border border-[#D9D9D9] bg-[#f0f0f0] px-2 py-5 shadow-[inset_0_0_0_2px_#fff]"
        onClick={(e) => e.stopPropagation()}
        elastic
      >
        <div className="flex items-center justify-between px-3 text-[#454545]">
          <h2 id="history-modal-title">Spin History</h2>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close history modal"
          >
            <CgClose className="size-4" />
          </button>
        </div>

        <div className="mt-3 flex-1 scrollbar-thin [scrollbar-color:#E3E3E3_transparent] scrollbar-gutter-stable overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-track]:bg-transparent">
          {history.length === 0 ? (
            <p className="py-8 text-center text-xs text-[#737373]">
              No spins recorded yet, give the wheel a spin!
            </p>
          ) : (
            <ul className="flex flex-col">
              {history.map((spin) => (
                <li
                  key={spin.id}
                  className="flex items-center justify-between rounded-sm px-3 py-2 text-xs transition hover:bg-[#D9D9D9]/60"
                >
                  <span className="font-semibold text-[#454545]">
                    {spin.prize_label}
                  </span>
                  <span className="font-mono text-xs text-[#737373]">
                    {new Date(spin.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </FadeIn>
    </div>
  );
}

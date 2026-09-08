"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { selectPrize } from "@/lib/prizes";

export interface SpinResult {
  winningIndex: number;
  prize: { id: string; label: string; color: string };
}

export interface SpinError {
  error: string;
}

export type SpinMode = "loading" | "anonymous" | "authenticated";

export interface SpinRecord {
  id: string;
  prize_id: string;
  prize_label: string;
  created_at: string;
}

async function loadHistory(signal?: AbortSignal): Promise<SpinRecord[] | null> {
  try {
    const res = await fetch("/api/wheel/history", { signal });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.history) return data.history;
    return null;
  } catch {
    return null;
  }
}

export function useSpinWheel() {
  const [history, setHistory] = useState<SpinRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<SpinMode>("loading");
  const spinningRef = useRef(false);
  const modeRef = useRef<SpinMode>("loading");
  const modePromiseRef = useRef<Promise<SpinMode> | null>(null);

  const loadMode = useCallback(async () => {
    if (modePromiseRef.current) return modePromiseRef.current;

    modePromiseRef.current = fetch("/api/session")
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        return res.ok && data?.authenticated
          ? ("authenticated" as const)
          : ("anonymous" as const);
      })
      .catch(() => "anonymous" as const)
      .then((nextMode) => {
        modeRef.current = nextMode;
        setMode(nextMode);
        return nextMode;
      });

    return modePromiseRef.current;
  }, []);

  const fetchHistory = useCallback(async () => {
    const result = await loadHistory();
    if (result) setHistory(result);
  }, []);

  useEffect(() => {
    void loadMode().then(async (nextMode) => {
      if (nextMode !== "authenticated") return;
      const result = await loadHistory();
      if (result) setHistory(result);
    });
  }, [loadMode]);

  const spin = useCallback(async (): Promise<SpinResult | SpinError | null> => {
    if (spinningRef.current) return null;
    spinningRef.current = true;
    setErrorMessage(null);

    try {
      const currentMode = await loadMode();
      if (currentMode === "anonymous") {
        const { winningIndex, prize } = selectPrize();
        return { winningIndex, prize };
      }

      const res = await fetch("/api/wheel/spin", { method: "POST" });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message = data?.message ?? "Spin failed. Please try again.";
        setErrorMessage(message);
        spinningRef.current = false;
        return { error: message };
      }

      return { winningIndex: data.winningIndex, prize: data.prize };
    } catch {
      const message = "A network error occurred. Please check your connection.";
      setErrorMessage(message);
      spinningRef.current = false;
      return { error: message };
    }
  }, [loadMode]);

  const releaseLock = useCallback(() => {
    spinningRef.current = false;
  }, []);

  return {
    history,
    errorMessage,
    mode,
    spin,
    releaseLock,
    fetchHistory,
  };
}

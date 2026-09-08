"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface SpinResult {
  winningIndex: number;
  prize: { id: string; label: string; color: string };
}

export interface SpinError {
  error: string;
}

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
  const spinningRef = useRef(false);

  const fetchHistory = useCallback(async () => {
    const result = await loadHistory();
    if (result) setHistory(result);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      const result = await loadHistory(controller.signal);
      if (result) setHistory(result);
    })();
    return () => controller.abort();
  }, []);

  const spin = useCallback(async (): Promise<SpinResult | SpinError | null> => {
    if (spinningRef.current) return null;
    spinningRef.current = true;
    setErrorMessage(null);

    try {
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
  }, []);

  const releaseLock = useCallback(() => {
    spinningRef.current = false;
  }, []);

  return { history, errorMessage, spin, releaseLock, fetchHistory };
}

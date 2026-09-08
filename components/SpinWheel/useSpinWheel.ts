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

interface SessionInfo {
  mode: Exclude<SpinMode, "loading">;
  username: string | null;
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
  const [mode, setMode] = useState<SpinMode>("loading");
  const [username, setUsername] = useState<string | null>(null);
  const spinningRef = useRef(false);
  const sessionPromiseRef = useRef<Promise<SessionInfo> | null>(null);

  const loadMode = useCallback(async () => {
    if (sessionPromiseRef.current) return sessionPromiseRef.current;

    sessionPromiseRef.current = fetch("/api/session")
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        return {
          mode:
            res.ok && data?.authenticated
              ? ("authenticated" as const)
              : ("anonymous" as const),
          username: typeof data?.username === "string" ? data.username : null,
        };
      })
      .catch(() => ({ mode: "anonymous" as const, username: null }))
      .then((session) => {
        setMode(session.mode);
        setUsername(session.username);
        return session;
      });

    return sessionPromiseRef.current;
  }, []);

  const fetchHistory = useCallback(async () => {
    const result = await loadHistory();
    if (result) setHistory(result);
  }, []);

  useEffect(() => {
    void loadMode().then(async (session) => {
      if (session.mode !== "authenticated") return;
      const result = await loadHistory();
      if (result) setHistory(result);
    });
  }, [loadMode]);

  const spin = useCallback(async (): Promise<SpinResult | SpinError | null> => {
    if (spinningRef.current) return null;
    spinningRef.current = true;
    setErrorMessage(null);

    try {
      const session = await loadMode();
      if (session.mode === "anonymous") {
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
    username,
    spin,
    releaseLock,
    fetchHistory,
  };
}

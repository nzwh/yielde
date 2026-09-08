"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {
    } finally {
      router.push("/login");
      router.refresh();
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex cursor-pointer items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-xs transition hover:text-[#454545] hover:underline focus-visible:ring-1 focus-visible:ring-[#8290EF] focus-visible:outline-none"
    >
      {loading ? "Logging out..." : "Log out"}
    </button>
  );
}

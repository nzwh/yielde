"use client";

import { Suspense } from "react";
import LoginCard from "@/components/LoginCard/LoginCard";
import { FadeIn } from "@/components/global/FadeFlyIn";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh max-w-screen flex-col items-center justify-center gap-8 overflow-hidden p-4 text-black">
      <Suspense fallback={null}>
        <FadeIn delay={200} elastic className="w-full max-w-88">
          <LoginCard />
        </FadeIn>

        <FadeIn delay={300} elastic className="text-xs text-[#707070]">
          <Link href="/" aria-label="Go to Home" className="hover:underline">
            Spin without an account
          </Link>
        </FadeIn>
      </Suspense>
    </main>
  );
}

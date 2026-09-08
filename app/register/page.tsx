"use client";

import { FadeIn } from "@/components/global/FadeFlyIn";
import RegisterCard from "@/components/RegisterCard/RegisterCard";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-dvh max-w-screen flex-col items-center justify-center gap-8 overflow-hidden p-4 text-black">
      <FadeIn delay={100} className="w-full max-w-88" elastic>
        <RegisterCard />
      </FadeIn>

      <FadeIn delay={300} className="text-xs text-[#707070]" elastic>
        <Link href="/" aria-label="Go to Home" className="hover:underline">
          Spin without an account
        </Link>
      </FadeIn>
    </main>
  );
}

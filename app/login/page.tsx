import { Suspense } from "react";
import LoginCard from "@/components/LoginCard/LoginCard";
import { FadeIn } from "@/components/global/FadeFlyIn";

export default function LoginPage() {
  return (
    <main className="flex h-dvh max-w-screen items-center justify-center bg-white text-black">
      <Suspense fallback={null}>
        <FadeIn direction="up" delay={200} elastic>
          <LoginCard />
        </FadeIn>
      </Suspense>
    </main>
  );
}

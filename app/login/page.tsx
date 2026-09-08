import { Suspense } from "react";
import LoginCard from "@/components/LoginCard/LoginCard";
import { FadeIn } from "@/components/global/FadeFlyIn";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh max-w-screen items-center justify-center overflow-hidden p-4 text-black">
      <Suspense fallback={null}>
        <FadeIn direction="up" delay={200} elastic className="w-full max-w-88">
          <LoginCard />
        </FadeIn>
      </Suspense>
    </main>
  );
}

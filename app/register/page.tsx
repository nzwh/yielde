import { FadeIn } from "@/components/global/FadeFlyIn";
import RegisterCard from "@/components/RegisterCard/RegisterCard";

export default function Home() {
  return (
    <main className="flex min-h-dvh max-w-screen items-center justify-center overflow-hidden bg-white p-4 text-black">
      <FadeIn direction="up" delay={100} elastic className="w-full max-w-88">
        <RegisterCard />
      </FadeIn>
    </main>
  );
}

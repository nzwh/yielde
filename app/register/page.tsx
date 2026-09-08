import { FadeIn } from "@/components/global/FadeFlyIn";
import RegisterCard from "@/components/RegisterCard/RegisterCard";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-white text-black">
      <FadeIn direction="up" delay={100} elastic>
        <RegisterCard />
      </FadeIn>
    </main>
  );
}

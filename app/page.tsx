import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import Stores from "@/components/sections/Stores";
import Solutions from "@/components/sections/Solutions";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Solutions />
      <HowItWorks />
      <Stores />
    </main>
  );
}

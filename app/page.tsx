import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import TwoWays from "@/components/sections/TwoWays";
import EstimateTrack from "@/components/sections/EstimateTrack";
import Stores from "@/components/sections/Stores";
import Solutions from "@/components/sections/Solutions";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Solutions />
      <TwoWays />
      <HowItWorks />
      <EstimateTrack />
      <Stores />
    </main>
  );
}

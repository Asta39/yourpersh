import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import TwoWays from "@/components/sections/TwoWays";
import EstimateTrack from "@/components/sections/EstimateTrack";
import OrderCta from "@/components/sections/OrderCta";
import Faq from "@/components/sections/Faq";
import Trust from "@/components/sections/Trust";
import Stores from "@/components/sections/Stores";
import Solutions from "@/components/sections/Solutions";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <Solutions />
        <TwoWays />
        <HowItWorks />
        <EstimateTrack />
        <Stores />
        <Trust />
        <Faq />
        <OrderCta />
      </main>
      <Footer />
    </>
  );
}

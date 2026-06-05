import { DemoPreview } from "@/components/landing/DemoPreview";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";

export default function MarketingPage() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <DemoPreview />
    </main>
  );
}

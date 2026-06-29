import { Hero } from "@/features/landing/components/Hero";
import { StatsBar } from "@/features/landing/components/StatsBar";
import { Features } from "@/features/landing/components/Features";
import { HowItWorks } from "@/features/landing/components/HowItWorks";
import { Testimonials } from "@/features/landing/components/Testimonials";
import { Faq } from "@/features/landing/components/Faq";
import { CtaBanner } from "@/features/landing/components/CtaBanner";

export function LandingPage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Faq />
      <CtaBanner />
    </>
  );
}

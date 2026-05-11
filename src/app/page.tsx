import { Navigation } from "@/components/sections/Navigation";
import { Hero } from "@/components/sections/Hero";
import { HomeMockup } from "@/components/sections/home-mockup";
import { ProblemStatement } from "@/components/sections/ProblemStatement";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { UseCases } from "@/components/sections/UseCases";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-page-bg">
      <Navigation />
      <Hero />
      <HomeMockup />
      <ProblemStatement />
      <ProductShowcase />
      <HowItWorks />
      <UseCases />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}

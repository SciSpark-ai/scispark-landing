import { Navigation } from "@/components/sections/Navigation";
import { Hero } from "@/components/sections/Hero";
import { ProblemStatement } from "@/components/sections/ProblemStatement";
import { ProductShowcase } from "@/components/sections/product-showcase";

export default function Home() {
  return (
    <main className="min-h-screen bg-page-bg">
      <Navigation />
      <Hero />
      <ProblemStatement />
      <ProductShowcase />
    </main>
  );
}

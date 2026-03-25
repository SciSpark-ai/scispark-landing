import { Navigation } from "@/components/sections/Navigation";
import { Hero } from "@/components/sections/Hero";
import { ProblemStatement } from "@/components/sections/ProblemStatement";
import { EvidenceFeed } from "@/components/sections/product-showcase/EvidenceFeed";

export default function Home() {
  return (
    <main className="min-h-screen bg-page-bg">
      <Navigation />
      <Hero />
      <ProblemStatement />
      <EvidenceFeed />
    </main>
  );
}

import { Navigation } from "@/components/sections/Navigation";
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-page-bg">
      <Navigation />
      <Hero />
    </main>
  );
}

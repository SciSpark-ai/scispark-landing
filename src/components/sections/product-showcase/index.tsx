import { EvidenceFeed } from "./EvidenceFeed";
import { FlyWheelDivider } from "./FlyWheelDivider";
import { AIAgent } from "./AIAgent";
import { IntelligenceLayer } from "./IntelligenceLayer";

export function ProductShowcase() {
  return (
    <section>
      <EvidenceFeed />
      <FlyWheelDivider />
      <AIAgent />
      <IntelligenceLayer />
    </section>
  );
}

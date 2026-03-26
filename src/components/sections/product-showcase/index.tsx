import { EvidenceFeed } from "./EvidenceFeed";
import { DigestShowcase } from "./DigestShowcase";
import { FlyWheelDivider } from "./FlyWheelDivider";
import { AIAgent } from "./AIAgent";
import { IntelligenceLayer } from "./IntelligenceLayer";

export function ProductShowcase() {
  return (
    <section>
      <EvidenceFeed />
      <DigestShowcase />
      <FlyWheelDivider />
      <AIAgent />
      <IntelligenceLayer />
    </section>
  );
}

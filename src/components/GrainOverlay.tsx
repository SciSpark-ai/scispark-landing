/**
 * Tileable grain texture overlay.
 * Renders as an absolutely-positioned div — parent must be `relative`.
 *
 * intensity:
 *   "light"  → opacity-[0.12]  (sections — visible but not distracting)
 *   "medium" → opacity-[0.20]  (default — clearly textured)
 *   "heavy"  → opacity-[0.30]  (small colored surfaces like card headers)
 */
export function GrainOverlay({
  intensity = "medium",
}: {
  intensity?: "light" | "medium" | "heavy";
}) {
  const opacityClass =
    intensity === "light"
      ? "opacity-[0.12]"
      : intensity === "heavy"
        ? "opacity-[0.30]"
        : "opacity-[0.20]";

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${opacityClass}`}
      style={{
        backgroundImage: "url(/textures/grain.png)",
        backgroundRepeat: "repeat",
      }}
    />
  );
}

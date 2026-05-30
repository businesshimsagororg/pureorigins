import { Button } from "@/components/Button";

const hero = {
  badge: "Clean packs, trusted daily nutrition",
  title: "Premium seeds and superfoods for a healthier routine",
  subtitle:
    "Black seed, chia, flax, moringa and honey sourced with care, packed neatly, and delivered across Bangladesh.",
  primaryCta: "Shop products",
  secondaryCta: "View combo offers",
  proof: [
    ["Trusted sourcing", "Selected from reliable suppliers"],
    ["Clean packaging", "Packed for everyday family use"],
    ["Simple support", "Order confirmation and after-sale help"]
  ] as const,
  features: [
    ["Direct sourcing", "Collected from trusted farmers and suppliers."],
    ["Quality checked", "Every batch is reviewed before packing."],
    ["Easy routine", "Use with smoothies, oats, yogurt or breakfast."],
    ["Family friendly", "Clean packs for simple repeat orders."]
  ] as const
};

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-media" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">{hero.badge}</p>
          <h1>{hero.title}</h1>
          <p>{hero.subtitle}</p>
          <div className="hero-actions">
            <Button href="/shop">{hero.primaryCta}</Button>
            <Button href="/combos" variant="secondary">
              {hero.secondaryCta}
            </Button>
          </div>
          <div className="hero-proof">
            {hero.proof.map(([title, copy]) => (
              <div className="proof-item" key={title}>
                <strong>{title}</strong>
                <span>{copy}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="feature-grid" aria-label="PureOrigiins features">
          {hero.features.map(([title, copy]) => (
            <div className="feature-card" key={title}>
              <strong>{title}</strong>
              <span>{copy}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Button } from "@/components/Button";
import { hero } from "@/lib/content";

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
        <div className="feature-grid" aria-label="PureOrigins features">
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

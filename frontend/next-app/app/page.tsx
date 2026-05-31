import Link from "next/link";
import { Button } from "@/components/Button";
import { CategoryPills } from "@/components/CategoryPills";
import Hero from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { ReviewCarousel } from "@/components/ReviewCarousel";
import { home, trustStrip } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <Hero />

      <div className="trust-strip">
        <div className="container trust-strip-inner">
          {trustStrip.map(([icon, text]) => (
            <div className="trust-strip-item" key={text}>
              <span aria-hidden="true">{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">{home.categories.eyebrow}</p>
              <h2>{home.categories.title}</h2>
              <p className="muted">{home.categories.subtitle}</p>
            </div>
          </div>
          <CategoryPills />
        </div>
      </section>

      <section className="section surface-band">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">{home.bestSellers.eyebrow}</p>
              <h2>{home.bestSellers.title}</h2>
              <p className="muted">{home.bestSellers.subtitle}</p>
            </div>
            <Button href="/shop" variant="secondary">
              সব পণ্য দেখুন
            </Button>
          </div>
          <ProductGrid limit={6} showSavings={false} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">{home.healthBenefits.eyebrow}</p>
              <h2>{home.healthBenefits.title}</h2>
              <p className="muted">{home.healthBenefits.subtitle}</p>
            </div>
          </div>
          <div className="info-grid">
            {home.healthBenefits.items.map((item) => (
              <div className="info-card" key={item.title}>
                <span className="benefit-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <h3>{item.title}</h3>
                <p className="muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section combo-band">
        <div className="container combo-inner">
          <div>
            <p className="eyebrow">{home.combo.eyebrow}</p>
            <h2>{home.combo.title}</h2>
            <p>{home.combo.subtitle}</p>
          </div>
          <Button href="/combos">কম্বো দেখুন</Button>
        </div>
      </section>

      <section className="section sunnah-awareness-section">
        <div className="container">
          <div className="sunnah-preview-grid">
            <div className="panel sunnah-preview-card dark">
              <p className="eyebrow">{home.sunnahPreview.eyebrow}</p>
              <h2>{home.sunnahPreview.title}</h2>
              <p className="muted">{home.sunnahPreview.text}</p>
              <Button href="/sunnah">{home.sunnahPreview.cta}</Button>
            </div>
            <div className="panel sunnah-preview-card">
              <h2>{home.sunnahPreview.awarenessTitle}</h2>
              <p className="muted">{home.sunnahPreview.awarenessText}</p>
              <div className="pill-row">
                {home.sunnahPreview.pills.map((pill) => (
                  <span className="pill" key={pill}>
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section trust-section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">{home.trust.eyebrow}</p>
              <h2>{home.trust.title}</h2>
            </div>
          </div>
          <div className="info-grid">
            {home.trust.cards.map((card) => (
              <div className="info-card" key={card.title}>
                <h3>{card.title}</h3>
                <p className="muted">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ReviewCarousel />

      <section className="section">
        <div className="container panel cta-panel">
          <h2>{home.cta.title}</h2>
          <p className="muted">{home.cta.subtitle}</p>
          <Link className="btn btn-primary" href="/shop">
            {home.cta.button}
          </Link>
        </div>
      </section>
    </>
  );
}

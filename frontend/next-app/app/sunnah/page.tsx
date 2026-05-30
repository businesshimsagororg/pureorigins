import { Button } from "@/components/Button";
import { sunnah } from "@/lib/content";

export const metadata = {
  title: "সুন্নাহ কর্নার"
};

export default function SunnahPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">সুন্নাহ কর্নার</p>
            <h1>{sunnah.title}</h1>
            <p className="muted">{sunnah.subtitle}</p>
          </div>
        </div>

        <div className="sunnah-preview-grid">
          <div className="panel sunnah-preview-card dark">
            <p className="eyebrow">{sunnah.kalonji.eyebrow}</p>
            <h2>{sunnah.kalonji.title}</h2>
            <p className="muted">{sunnah.kalonji.text}</p>
            <p className="sunnah-sources">
              সূত্র:{" "}
              {sunnah.kalonji.sources.map((source, index) => (
                <span key={source.href}>
                  {index > 0 ? " এবং " : null}
                  <a href={source.href} target="_blank" rel="noopener noreferrer">
                    {source.label}
                  </a>
                </span>
              ))}
            </p>
            <ul className="policy-list">
              {sunnah.kalonji.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
          <div className="panel sunnah-preview-card">
            <p className="eyebrow">{sunnah.honey.eyebrow}</p>
            <h2>{sunnah.honey.title}</h2>
            <p className="muted">{sunnah.honey.text}</p>
            <ul className="policy-list">
              {sunnah.honey.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
            <Button href="/shop">{sunnah.honey.cta}</Button>
          </div>
        </div>

        <div className="panel sunnah-safe-panel">
          <h2>{sunnah.safeUse.title}</h2>
          <div className="info-grid">
            {sunnah.safeUse.steps.map((step, index) => (
              <div className="info-card" key={step.title}>
                <span className="benefit-icon" aria-hidden="true">
                  {index + 1}
                </span>
                <h3>{step.title}</h3>
                <p className="muted">{step.text}</p>
              </div>
            ))}
          </div>
          <div className="policy-note">{sunnah.safeUse.warning}</div>
        </div>
      </div>
    </section>
  );
}

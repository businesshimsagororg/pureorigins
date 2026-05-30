import { faqPage, faqs } from "@/lib/content";

export const metadata = {
  title: "FAQ"
};

export default function FaqPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">{faqPage.eyebrow}</p>
            <h1>{faqPage.title}</h1>
            <p className="muted">{faqPage.subtitle}</p>
          </div>
        </div>
        <div className="info-grid">
          {faqs.map(([question, answer]) => (
            <article className="info-card" key={question}>
              <h2>{question}</h2>
              <p className="muted">{answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

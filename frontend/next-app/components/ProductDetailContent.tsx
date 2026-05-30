import type { Product } from "@/lib/products";
import { healthDisclaimer } from "@/lib/productCopy";

export function ProductDetailContent({ product }: { product: Product }) {
  const paragraphs = product.description.split(/\n\n+/).filter(Boolean);

  return (
    <div className="product-detail-copy">
      {product.tagline ? <p className="product-tagline">{product.tagline}</p> : null}
      {product.shortDescription ? <p className="lead">{product.shortDescription}</p> : null}

      {paragraphs.length ? (
        <div className="product-long-desc">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="muted">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      {product.benefits?.length ? (
        <section className="product-detail-block">
          <h2>উপকারিতা</h2>
          <ul className="benefit-list">
            {product.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {product.howToUse?.length ? (
        <section className="product-detail-block">
          <h2>ব্যবহারবিধি</h2>
          <div className="how-to-grid">
            {product.howToUse.map((section) => (
              <article className="how-to-card" key={`${section.title}-${section.body.slice(0, 24)}`}>
                <h3>{section.title}</h3>
                <p className="muted">{section.body}</p>
                {section.tip ? <p className="how-to-tip">{section.tip}</p> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {product.disclaimer ? (
        <blockquote className="product-disclaimer">{product.disclaimer}</blockquote>
      ) : null}

      <blockquote className="product-disclaimer product-disclaimer-global">{healthDisclaimer}</blockquote>
    </div>
  );
}

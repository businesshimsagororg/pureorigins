import { Button } from "@/components/Button";
import { ProductGrid } from "@/components/ProductGrid";
import { comboBandCopy, combosPage } from "@/lib/content";

export const metadata = {
  title: "কম্বো অফার"
};

export default function CombosPage() {
  return (
    <>
      <section className="section combo-band">
        <div className="container combo-inner">
          <div>
            <p className="eyebrow">{comboBandCopy.eyebrow}</p>
            <h1>{combosPage.title}</h1>
            <p>{combosPage.subtitle}</p>
          </div>
          <Button href="/checkout">এখনই অর্ডার করুন</Button>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ProductGrid category="combos" />
        </div>
      </section>
    </>
  );
}

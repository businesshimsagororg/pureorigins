import { CategoryPills } from "@/components/CategoryPills";
import { ProductGrid } from "@/components/ProductGrid";
import { shopPage } from "@/lib/content";

export const metadata = {
  title: "পণ্যসমূহ"
};

export default async function ShopPage({
  searchParams
}: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category = params?.category;

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">{shopPage.eyebrow}</p>
            <h1>{shopPage.title}</h1>
          </div>
        </div>
        <CategoryPills active={category} />
        <div style={{ height: 24 }} />
        <ProductGrid category={category} />
      </div>
    </section>
  );
}

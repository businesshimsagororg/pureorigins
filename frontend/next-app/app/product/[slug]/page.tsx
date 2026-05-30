import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailContent } from "@/components/ProductDetailContent";
import { getProduct, getProducts } from "@/lib/products";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.displayTitle || product.nameBn,
    description: product.shortDescription
  };
}

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <section className="section">
      <div className="container">
        <div className="checkout-layout product-detail-layout">
          <ProductCard product={product} />
          <div className="panel product-detail-panel">
            <p className="eyebrow">{product.nameEn}</p>
            <h1>{product.displayTitle || product.nameBn}</h1>
            <ProductDetailContent product={product} />
          </div>
        </div>
      </div>
    </section>
  );
}

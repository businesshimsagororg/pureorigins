import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

export async function ProductGrid({
  category,
  limit,
  showSavings = true
}: {
  category?: string;
  limit?: number;
  showSavings?: boolean;
}) {
  const products = await getProducts();
  const filtered = category
    ? products.filter((product) => product.category === category)
    : products;
  const visible = typeof limit === "number" ? filtered.slice(0, limit) : filtered;

  return (
    <div className="product-grid">
      {visible.map((product) => (
        <ProductCard product={product} showSavings={showSavings} key={product.id} />
      ))}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { useCart } from "@/components/CartProvider";
import type { Product } from "@/lib/products";
import { firstVariant, variantPrice } from "@/lib/products";

export function ProductCard({
  product,
  showSavings = true
}: {
  product: Product;
  showSavings?: boolean;
}) {
  const [weight, setWeight] = useState(firstVariant(product));
  const { addItem } = useCart();
  const router = useRouter();
  const price = variantPrice(product, weight);
  const savings = useMemo(() => {
    if (!Number.isFinite(price) || !product.oldPrice || product.oldPrice <= price) return 0;
    return product.oldPrice - price;
  }, [price, product.oldPrice]);

  return (
    <article className="product-card">
      <div className="product-media" aria-hidden="true">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt="" className="product-photo" />
        ) : (
          product.imageIcon
        )}
      </div>
      <div className="product-body">
        <div>
          <h3 className="product-title">{product.nameBn}</h3>
          <p className="product-copy">{product.shortDescription}</p>
        </div>
        <select
          className="variant-select"
          value={weight}
          aria-label={`${product.nameEn} weight`}
          onChange={(event) => setWeight(event.target.value)}
        >
          {Object.keys(product.variantPrices).map((variant) => (
            <option value={variant} key={variant}>
              {variant}
            </option>
          ))}
        </select>
        <div className="price-row">
          <span className="price-now">৳{Number.isFinite(price) ? price : "—"}</span>
          {product.oldPrice ? <span className="price-old">৳{product.oldPrice}</span> : null}
        </div>
        {showSavings && savings ? <span className="save-tag">Save ৳{savings}</span> : null}
        <div className="card-actions">
          <Button type="button" variant="secondary" onClick={() => addItem(product, weight)}>
            Add to Cart
          </Button>
          <Button
            type="button"
            onClick={() => {
              addItem(product, weight);
              router.push("/checkout");
            }}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </article>
  );
}

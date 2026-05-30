import Link from "next/link";
import { categories } from "@/lib/products";

export function CategoryPills({ active }: { active?: string }) {
  return (
    <div className="category-pills" aria-label="Product categories">
      {categories.map((category) => (
        <Link
          className={`category-pill ${active && category.href.includes(active) ? "active" : ""}`}
          href={category.href}
          key={category.href}
        >
          {category.label}
        </Link>
      ))}
    </div>
  );
}

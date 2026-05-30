import Link from "next/link";

const categories = [
  { label: "সব", href: "/shop", key: "" },
  { label: "সিডস", href: "/shop?category=seeds", key: "seeds" },
  { label: "পাউডার", href: "/shop?category=powders", key: "powders" },
  { label: "মধু", href: "/shop?category=honey", key: "honey" },
  { label: "কম্বো", href: "/combos", key: "combos" }
];

export function CategoryPills({ active }: { active?: string }) {
  return (
    <div className="category-pills" aria-label="Product categories">
      {categories.map((category) => (
        <Link
          className={`category-pill ${active === category.key || (!active && !category.key) ? "active" : ""}`}
          href={category.href}
          key={category.href}
        >
          {category.label}
        </Link>
      ))}
    </div>
  );
}

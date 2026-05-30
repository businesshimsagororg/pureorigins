"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "@/components/Icons";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  return (
    <form
      className="panel"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        router.push(`/shop?search=${encodeURIComponent(query)}`);
      }}
    >
      <label htmlFor="product-search">
        Search products
        <input
          id="product-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search seeds, honey, powders"
        />
      </label>
      <button className="btn btn-secondary" type="submit" aria-label="Search">
        <SearchIcon />
        Search
      </button>
    </form>
  );
}

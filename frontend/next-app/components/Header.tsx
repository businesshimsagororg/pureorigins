"use client";

import Link from "next/link";
import { useState } from "react";
import { BagIcon, MenuIcon, SearchIcon } from "@/components/Icons";
import { useCart } from "@/components/CartProvider";
import { topTicker } from "@/lib/content";

const links = [
  ["Home", "/"],
  ["Shop", "/shop"],
  ["Combos", "/combos"],
  ["Sunnah", "/sunnah"],
  ["Reviews", "/reviews"],
  ["Account", "/account"],
  ["Track", "/order-lookup"],
  ["Contact", "/contact"]
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <>
      <div className="top-ticker">
        <div className="ticker-track">
          {[...topTicker, ...topTicker].map((line, index) => (
            <span key={`${line}-${index}`}>{line}</span>
          ))}
        </div>
      </div>
      <header className="site-header">
        <div className="container header-row">
          <button
            className="icon-button"
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen((value) => !value)}
          >
            <MenuIcon />
          </button>

          <Link className="brand-lockup" href="/" onClick={() => setOpen(false)}>
            <span className="brand-mark">PO</span>
            <span className="brand-copy">
              <span className="brand-name">PureOrigiins</span>
              <span className="brand-tagline">healthy habit start here</span>
            </span>
          </Link>

          <div className="header-actions">
            <Link className="icon-button" href="/shop" aria-label="Search products">
              <SearchIcon />
            </Link>
            <Link className="btn btn-primary" href="/cart" aria-label="Open cart">
              <BagIcon />
              {count ? <span className="cart-badge">{count}</span> : <span>Cart</span>}
            </Link>
          </div>
        </div>
        <nav className="desktop-nav container" aria-label="Primary">
          {links.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className={`mobile-menu ${open ? "open" : ""}`}>
          <nav className="container" aria-label="Mobile primary">
            {links.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}

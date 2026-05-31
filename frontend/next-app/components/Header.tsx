"use client";

import Link from "next/link";
import { useState } from "react";
import { BagIcon, LogoMark, MenuIcon, SearchIcon } from "@/components/Icons";
import { useCart } from "@/components/CartProvider";
import { site, topTicker } from "@/lib/content";

const links = [
  ["হোম", "/"],
  ["শপ", "/shop"],
  ["কম্বো", "/combos"],
  ["সুন্নাহ", "/sunnah"],
  ["রিভিউ", "/reviews"],
  ["অ্যাকাউন্ট", "/account"],
  ["ট্র্যাক", "/order-lookup"],
  ["যোগাযোগ", "/contact"]
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
            <span className="brand-mark">
              <LogoMark />
            </span>
            <span>
              <span className="brand-name">{site.name}</span>
              <span className="brand-tagline">healthy habit starts here</span>
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

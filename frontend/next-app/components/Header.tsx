import Link from "next/link";
import React, { useState } from "react";
import MobileNav from "./MobileNav";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <header className="header">
      <div className="nav-inner">
        <div className="logo">
          <span className="logo-leaf">🌿</span>
          <span>PureOrigins</span>
          <span className="logo-gold">.</span>
        </div>
        <nav className="nav-links">
          <Link href="/" className="active">হোম</Link>
          <Link href="/shop">দোকান</Link>
          <Link href="/about">আমাদের সম্পর্কে</Link>
          <Link href="/faq">প্রশ্নোত্তর</Link>
        </nav>
        <div className="nav-right">
          <button className="cart-btn" aria-label="Cart">
            <svg className="svg-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h15l-1.5 9h-13z"/></svg>
            <span className="cart-count">0</span>
          </button>
          <button className="hamburger" onClick={toggleMobile} aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

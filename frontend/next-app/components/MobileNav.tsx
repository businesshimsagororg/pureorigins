import Link from "next/link";
import React from "react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;
  return (
    <div className="mobile-nav open" aria-label="Mobile navigation">
      <button className="hamburger" onClick={onClose} aria-label="Close menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav>
        <Link href="/" onClick={onClose}>হোম</Link>
        <Link href="/shop" onClick={onClose}>দোকান</Link>
        <Link href="/about" onClick={onClose}>আমাদের সম্পর্কে</Link>
        <Link href="/faq" onClick={onClose}>প্রশ্নোত্তর</Link>
      </nav>
    </div>
  );
}

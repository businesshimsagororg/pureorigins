import React from "react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero" style={{ background: "linear-gradient(135deg,#0D2B1D, #1B4332)" }}>
      <div className="hero-content">
        <div className="hero-badge">
          <span className="svg-icon" aria-hidden="true">🌿</span>
          <span>প্রিমিয়াম স্বাস্থ্য সিড</span>
        </div>
        <h1>
          PureOrigins <span style={{ color: "var(--gold-light)" }}>সুপারফুড</span>
        </h1>
        <p className="hero-subtitle">
          শুদ্ধ ও অর্গানিক স্বাস্থ্য সিড, সরাসরি আপনার বাড়িতে
        </p>
        <div className="hero-actions">
          <a href="#shop" className="btn-primary">দোকানে যান</a>
          <a href="#about" className="btn-outline">আমাদের সম্পর্কে</a>
        </div>
      </div>
    </section>
  );
}

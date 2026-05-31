"use client";
import React, { useState, useEffect } from "react";

const products = [
  { id: 1, name: "কালোজিরা", sub: "Black Seeds", price: "১৮০", unit: "১০০গ্রাম", badge: "বেস্ট সেলার", color: "#1B4332", accent: "#C4972F", img: "🌿", glow: "rgba(27,67,50,0.35)" },
  { id: 2, name: "চিয়া সিড", sub: "Chia Seeds", price: "২৮০", unit: "১০০গ্রাম", badge: "নতুন", color: "#2D6A4F", accent: "#E8C96B", img: "🌱", glow: "rgba(45,106,79,0.35)" },
  { id: 3, name: "মরিঙ্গা পাউডার", sub: "Moringa Powder", price: "৩৮০", unit: "১০০গ্রাম", badge: "সুপারফুড", color: "#1A3A28", accent: "#A8D5A2", img: "🍃", glow: "rgba(26,58,40,0.35)" },
  { id: 4, name: "খাঁটি মধু", sub: "Pure Honey", price: "৪৫০", unit: "২৫০গ্রাম", badge: "প্রিমিয়াম", color: "#4A3000", accent: "#F5C842", img: "🍯", glow: "rgba(74,48,0,0.35)" },
];

const trustBadges = ["COD সুবিধা", "হোম ডেলিভারি", "খাঁটি উৎস"];

function Particle({ style }: { style?: React.CSSProperties }) {
  return <div style={{ position: "absolute", borderRadius: "50%", pointerEvents: "none", ...style }} />;
}

export default function PureOriginsHero() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [added, setAdded] = useState(null);
  const [hover, setHover] = useState(null);

  const current = products[active];

  useEffect(() => {
    const t = setInterval(() => {
      setActive(p => (p + 1) % products.length);
    }, 3800);
    return () => clearInterval(t);
  }, []);

  function handleSwitch(i: number) {
    if (i === active || animating) return;
    setAnimating(true);
    setTimeout(() => { setActive(i); setAnimating(false); }, 280);
  }

  function handleAdd(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    setCartCount(c => c + 1);
    setAdded(id as any);
    setTimeout(() => setAdded(null), 1400);
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0a0f0c 0%, #0d1810 40%, #111a14 100%)",
      fontFamily: "'Noto Sans Bengali', 'Segoe UI', sans-serif",
      padding: "20px", position: "relative", overflow: "hidden",
    }}>

      {/* Ambient background glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 60% 50% at 70% 50%, ${current.glow} 0%, transparent 70%)`,
        transition: "background 1s ease",
      }} />

      {/* Grain overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.04,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
      }} />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <Particle key={i} style={{
          width: `${4 + i * 2}px`, height: `${4 + i * 2}px`,
          background: current.accent, opacity: 0.12 + i * 0.015,
          top: `${10 + i * 11}%`, left: `${5 + i * 12}%`,
          animation: `float${i % 3} ${4 + i}s ease-in-out infinite`,
          filter: `blur(${i % 2}px)`,
        }} />
      ))}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@300;400;500;600;700;800&display=swap');
        @keyframes float0 { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-18px) rotate(5deg)} }
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-24px) rotate(-4deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px) rotate(8deg)} }
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pop { 0%{transform:scale(1)} 50%{transform:scale(1.18)} 100%{transform:scale(1)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        .hero-card { transition: all 0.32s cubic-bezier(0.34,1.56,0.64,1); }
        .hero-card:hover { transform: translateY(-3px) scale(1.015); }
        .add-btn { transition: all 0.2s ease; }
        .add-btn:hover { transform: scale(1.05); }
        .add-btn:active { transform: scale(0.95); }
        .tab-dot { transition: all 0.3s ease; cursor: pointer; }
        .nav-pill { transition: all 0.25s ease; cursor: pointer; }
        .nav-pill:hover { opacity: 1 !important; }
        .trust-badge { transition: all 0.2s ease; }
        .trust-badge:hover { transform: translateY(-1px); }
      `}</style>

      {/* Main container */}
      <div style={{ width: "100%", maxWidth: "1100px", display: "grid", gridTemplateColumns: "1fr 420px", gap: "48px", alignItems: "center", position: "relative", zIndex: 1 }}>

        {/* LEFT — Text content */}
        <div>
          {/* Brand line */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: `linear-gradient(135deg, ${current.color}, ${current.accent}33)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", border: `1px solid ${current.accent}30`,
              transition: "all 0.5s ease",
            }}>🌿</div>
            <span style={{ color: "#ffffff99", fontSize: "13px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>PureOrigins</span>
            <div style={{ marginLeft: "auto", position: "relative" }}>
              <div style={{
                background: cartCount > 0 ? current.accent : "#ffffff15",
                color: cartCount > 0 ? "#0a0f0c" : "#ffffff60",
                borderRadius: "20px", padding: "6px 14px", fontSize: "12px",
                fontWeight: 700, display: "flex", alignItems: "center", gap: "6px",
                transition: "all 0.3s ease", border: "1px solid #ffffff10",
              }}>
                🛒 {cartCount > 0 ? `${cartCount}টি` : "কার্ট"}
              </div>
            </div>
          </div>

          {/* Headline */}
          <div style={{ marginBottom: "20px", overflow: "hidden" }}>
            <div style={{ animation: animating ? "none" : "fadeSlideIn 0.5s ease", opacity: animating ? 0 : 1 }}>
              <div style={{
                fontSize: "clamp(34px, 5vw, 58px)", fontWeight: 800, lineHeight: 1.15,
                color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "8px",
              }}>
                প্রতিদিনের<br />
                <span style={{
                  background: `linear-gradient(90deg, ${current.accent}, ${current.accent}cc, ${current.accent})`,
                  backgroundSize: "200% auto", WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent", backgroundClip: "text",
                  animation: "shimmer 3s linear infinite",
                }}>হেলদি রুটিনে</span>
              </div>
              <div style={{ fontSize: "clamp(34px, 5vw, 58px)", fontWeight: 800, lineHeight: 1.15, color: "#ffffff" }}>
                প্রিমিয়াম সুপারফুড
              </div>
            </div>
          </div>

          {/* Subtitle */}
          <p style={{ color: "#ffffff70", fontSize: "15px", lineHeight: 1.8, marginBottom: "36px", maxWidth: "480px" }}>
            সরাসরি বিশ্বস্ত উৎস থেকে সংগ্রহ করা কালোজিরা, চিয়া, মরিঙ্গা ও মধু —
            যত্নে প্যাকেজিং, আপনার দোরগোড়ায় ডেলিভারি।
          </p>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "40px", flexWrap: "wrap" }}>
            {trustBadges.map((b, i) => (
              <div key={i} className="trust-badge" style={{
                background: "#ffffff08", border: "1px solid #ffffff15",
                borderRadius: "99px", padding: "8px 16px", fontSize: "12.5px",
                color: "#ffffff80", fontWeight: 500,
              }}>✦ {b}</div>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button className="add-btn" style={{
              background: current.accent, color: "#0a0f0c",
              border: "none", borderRadius: "14px", padding: "15px 32px",
              fontSize: "15px", fontWeight: 700, cursor: "pointer",
              boxShadow: `0 12px 36px ${current.accent}40`,
              transition: "all 0.3s ease", fontFamily: "inherit",
            }}>
              এখনই অর্ডার করুন →
            </button>
            <button className="add-btn" style={{
              background: "transparent", color: "#ffffff80",
              border: "1px solid #ffffff20", borderRadius: "14px",
              padding: "15px 28px", fontSize: "15px", fontWeight: 500,
              cursor: "pointer", fontFamily: "inherit",
            }}>
              সব পণ্য দেখুন
            </button>
          </div>

          {/* Product nav dots */}
          <div style={{ display: "flex", gap: "8px", marginTop: "40px", alignItems: "center" }}>
            <span style={{ color: "#ffffff40", fontSize: "11px", marginRight: "4px" }}>বেছে নিন</span>
            {products.map((p, i) => (
              <div key={p.id} className="tab-dot" onClick={() => handleSwitch(i)} style={{
                height: "6px", borderRadius: "99px",
                background: i === active ? current.accent : "#ffffff20",
                width: i === active ? "28px" : "6px",
                transition: "all 0.35s ease",
              }} />
            ))}
          </div>
        </div>

        {/* RIGHT — Product card stack */}
        <div style={{ position: "relative", height: "520px" }}>

          {/* Background cards (depth effect) */}
          {products.map((p, i) => {
            const offset = (i - active + products.length) % products.length;
            if (offset === 0) return null;
            return (
              <div key={p.id} className="hero-card" onClick={() => handleSwitch(i)} style={{
                position: "absolute", width: "100%",
                top: `${offset === 1 ? 14 : offset === 2 ? 24 : 32}px`,
                left: `${offset === 1 ? 10 : offset === 2 ? 18 : 24}px`,
                height: "400px", borderRadius: "28px",
                background: `linear-gradient(145deg, ${p.color}88, #0a0f0c)`,
                border: `1px solid ${p.accent}18`,
                cursor: "pointer", zIndex: 3 - offset,
                opacity: offset === 1 ? 0.7 : 0.35,
                transform: `scale(${1 - offset * 0.03}) rotate(${offset * 1.5}deg)`,
                transition: "all 0.5s cubic-bezier(0.34,1.2,0.64,1)",
              }} />
            );
          })}

          {/* Active product card */}
          <div style={{
            position: "absolute", width: "100%", zIndex: 10,
            animation: animating ? "none" : "fadeSlideIn 0.45s cubic-bezier(0.34,1.56,0.64,1)",
            opacity: animating ? 0 : 1,
          }}>
            <div style={{
              borderRadius: "28px",
              background: `linear-gradient(155deg, ${current.color}ee 0%, #0d1810 60%, #0a0f0c 100%)`,
              border: `1px solid ${current.accent}25`,
              padding: "36px",
              boxShadow: `0 32px 80px ${current.glow}, 0 0 0 1px ${current.accent}10 inset`,
              position: "relative", overflow: "hidden",
            }}>

              {/* Subtle corner glow */}
              <div style={{
                position: "absolute", top: "-40px", right: "-40px",
                width: "180px", height: "180px", borderRadius: "50%",
                background: `radial-gradient(circle, ${current.accent}25 0%, transparent 70%)`,
                pointerEvents: "none",
              }} />

              {/* Badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: `${current.accent}22`, border: `1px solid ${current.accent}40`,
                borderRadius: "99px", padding: "5px 14px", marginBottom: "24px",
                color: current.accent, fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em",
              }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: current.accent, animation: "pulse 2s infinite" }} />
                {current.badge}
              </div>

              {/* Emoji product visual */}
              <div style={{
                width: "100px", height: "100px", borderRadius: "24px", marginBottom: "24px",
                background: `linear-gradient(135deg, ${current.accent}18, ${current.accent}08)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "52px", border: `1px solid ${current.accent}20`,
                boxShadow: `0 8px 24px ${current.glow}`,
              }}>
                {current.img}
              </div>

              {/* Product name */}
              <div style={{ marginBottom: "6px" }}>
                <div style={{ fontSize: "26px", fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>
                  {current.name}
                </div>
                <div style={{ fontSize: "13px", color: `${current.accent}99`, fontWeight: 500, marginTop: "4px" }}>
                  {current.sub}
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "#ffffff10", margin: "20px 0" }} />

              {/* Price + unit */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "24px" }}>
                <div style={{ fontSize: "32px", fontWeight: 800, color: current.accent, lineHeight: 1 }}>
                  ৳{current.price}
                </div>
                <div style={{ fontSize: "12px", color: "#ffffff40", marginBottom: "4px" }}>
                  / {current.unit}
                </div>
              </div>

              {/* Weight pills */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
                {["১০০গ্রাম", "২৫০গ্রাম", "৫০০গ্রাম"].map((w, i) => (
                  <div key={w} style={{
                    padding: "6px 14px", borderRadius: "99px", fontSize: "12px", fontWeight: 600,
                    background: i === 0 ? `${current.accent}25` : "#ffffff0a",
                    border: `1px solid ${i === 0 ? current.accent + "50" : "#ffffff15"}`,
                    color: i === 0 ? current.accent : "#ffffff50",
                    cursor: "pointer", transition: "all 0.2s",
                  }}>{w}</div>
                ))}
              </div>

              {/* Add to cart button */}
              <button className="add-btn" onClick={(e) => handleAdd(e, current.id)} style={{
                width: "100%", padding: "16px", borderRadius: "14px",
                background: added === current.id
                  ? `${current.accent}30`
                  : `linear-gradient(135deg, ${current.accent}, ${current.accent}cc)`,
                border: added === current.id ? `1px solid ${current.accent}50` : "none",
                color: added === current.id ? current.accent : "#0a0f0c",
                fontSize: "15px", fontWeight: 700, cursor: "pointer",
                animation: added === current.id ? "pop 0.3s ease" : "none",
                boxShadow: added === current.id ? "none" : `0 8px 28px ${current.accent}40`,
                fontFamily: "inherit", transition: "all 0.3s ease",
              }}>
                {added === current.id ? "✓ কার্টে যোগ হয়েছে" : "কার্টে যোগ করুন"}
              </button>

              {/* COD note */}
              <div style={{
                marginTop: "14px", textAlign: "center", fontSize: "11.5px",
                color: "#ffffff35", display: "flex", alignItems: "center",
                justifyContent: "center", gap: "6px",
              }}>
                <span>💵</span> COD সুবিধায় পণ্য হাতে পেয়ে পেমেন্ট
              </div>
            </div>
          </div>

          {/* Mini product switcher pills */}
          <div style={{
            position: "absolute", bottom: "-52px", left: "50%",
            transform: "translateX(-50%)", display: "flex", gap: "8px",
            background: "#ffffff08", borderRadius: "99px", padding: "6px 10px",
            border: "1px solid #ffffff10",
          }}>
            {products.map((p, i) => (
              <div key={p.id} className="nav-pill" onClick={() => handleSwitch(i)} style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "5px 12px", borderRadius: "99px", fontSize: "12px",
                background: i === active ? `${p.accent}22` : "transparent",
                border: `1px solid ${i === active ? p.accent + "40" : "transparent"}`,
                color: i === active ? p.accent : "#ffffff35",
                fontWeight: i === active ? 700 : 400,
                transition: "all 0.25s ease", opacity: i === active ? 1 : 0.6,
              }}>
                <span style={{ fontSize: "14px" }}>{p.img}</span>
                <span style={{ whiteSpace: "nowrap" }}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const defaultProducts = [
  {
    id: 1, name: "কালোজিরা", sub: "Black Seeds", slug: "kalojira",
    price: "৩৮০", oldPrice: "৪৬০", save: "৮০", unit: "১০০গ্রাম",
    badge: "বেস্ট সেলার", color: "#1B4332", accent: "#C4972F",
    img: "🌿", glow: "rgba(27,67,50,0.35)", isSunnah: true,
  },
  {
    id: 2, name: "চিয়া সিড", sub: "Chia Seeds", slug: "chia-seed",
    price: "২৮০", oldPrice: "৩৫০", save: "৭০", unit: "১০০গ্রাম",
    badge: "নতুন", color: "#2D6A4F", accent: "#E8C96B",
    img: "🌱", glow: "rgba(45,106,79,0.35)", isSunnah: false,
  },
  {
    id: 3, name: "মরিঙ্গা পাউডার", sub: "Moringa Powder", slug: "moringa-powder",
    price: "৩৮০", oldPrice: "৪৫০", save: "৭০", unit: "১০০গ্রাম",
    badge: "সুপারফুড", color: "#1A3A28", accent: "#A8D5A2",
    img: "🍃", glow: "rgba(26,58,40,0.35)", isSunnah: false,
  },
  {
    id: 4, name: "খাঁটি মধু", sub: "Pure Honey", slug: "pure-honey",
    price: "৪৫০", oldPrice: "৫৫০", save: "১০০", unit: "২৫০গ্রাম",
    badge: "প্রিমিয়াম", color: "#4A3000", accent: "#F5C842",
    img: "🍯", glow: "rgba(74,48,0,0.35)", isSunnah: true,
  },
];

function Particle({ style }) {
  return <div style={{ position: "absolute", borderRadius: "50%", pointerEvents: "none", ...style }} />;
}

export default function PureOriginsHero() {
  const router = useRouter();
  const [products, setProducts] = useState(defaultProducts);
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [added, setAdded] = useState(null);

  const current = products[active] || defaultProducts[0];

  useEffect(() => {
    const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
    fetch(`${apiBase}/api/hero`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.items?.length > 0) {
          setProducts(data.items.map((item) => ({ ...item, id: item._id })));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % products.length), 3000);
    return () => clearInterval(t);
  }, [products]);

  function handleSwitch(i) {
    if (i === active || animating) return;
    setAnimating(true);
    setTimeout(() => { setActive(i); setAnimating(false); }, 280);
  }

  function handleAdd(e, id) {
    e.stopPropagation();
    setAdded(id);
    setTimeout(() => setAdded(null), 1400);
  }

  return (
    <div className="hero-container" style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0a0f0c 0%, #0d1810 40%, #111a14 100%)",
      fontFamily: "'Noto Sans Bengali', 'Segoe UI', sans-serif",
      padding: "20px", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 60% 50% at 70% 50%, ${current.glow} 0%, transparent 70%)`,
        transition: "background 1s ease",
      }} />

      {[...Array(8)].map((_, i) => (
        <Particle key={i} style={{
          width: `${4 + i * 2}px`, height: `${4 + i * 2}px`,
          background: current.accent, opacity: 0.12 + i * 0.015,
          top: `${10 + i * 11}%`, left: `${5 + i * 12}%`,
          animation: `heroFloat${i % 3} ${4 + i}s ease-in-out infinite`,
        }} />
      ))}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@300;400;500;600;700;800&display=swap');
        @keyframes heroFloat0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px) rotate(5deg)} }
        @keyframes heroFloat1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-24px) rotate(-4deg)} }
        @keyframes heroFloat2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px) rotate(8deg)} }
        @keyframes heroFadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes heroPop { 0%{transform:scale(1)} 50%{transform:scale(1.18)} 100%{transform:scale(1)} }
        @keyframes heroShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes heroPulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes heroCardFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .hero-bg-card { transition: all 0.5s cubic-bezier(0.34,1.2,0.64,1); cursor: pointer; }
        .hero-bg-card:hover { opacity: 0.85 !important; }
        .hero-active-card { cursor: pointer; transition: transform 0.3s ease; }
        .hero-active-card:hover { transform: scale(1.015) !important; }
        .hero-add-btn { transition: all 0.2s ease; }
        .hero-add-btn:hover { transform: scale(1.05); }
        .hero-add-btn:active { transform: scale(0.95); }
        .hero-nav-pill { transition: all 0.25s ease; cursor: pointer; }
        .hero-nav-pill:hover { opacity: 1 !important; }
        .hero-left { display: block; }
        .hero-nav-container {
          position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
          display: flex; gap: 8px; background: #ffffff08; border-radius: 99px;
          padding: 6px 10px; border: 1px solid #ffffff10; z-index: 20;
          width: max-content; max-width: 100%;
        }
        @media (max-width: 768px) {
          .hero-nav-container {
            width: 95%; max-width: 360px; flex-wrap: wrap; justify-content: center;
            border-radius: 20px; bottom: 0px; gap: 6px; padding: 10px;
          }
          .hero-left { display: none !important; }
          .hero-grid { grid-template-columns: 1fr !important; padding-top: 20px !important; padding-bottom: 40px !important; align-items: flex-start !important; }
          .hero-container { min-height: auto !important; padding-top: 20px !important; padding-bottom: 40px !important; align-items: flex-start !important; }
        }
      `}</style>

      <div className="hero-grid" style={{
        width: "100%", maxWidth: "1100px", display: "grid",
        gridTemplateColumns: "1fr 420px", gap: "48px",
        alignItems: "center", position: "relative", zIndex: 1,
      }}>
        <div className="hero-left">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: `linear-gradient(135deg, ${current.color}, ${current.accent}33)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", border: `1px solid ${current.accent}30`, transition: "all 0.5s ease",
            }}>🌿</div>
            <span style={{ color: "#ffffff99", fontSize: "13px", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>PureOrigins</span>
          </div>

          <div style={{ marginBottom: "20px", overflow: "hidden" }}>
            <div style={{ animation: animating ? "none" : "heroFadeIn 0.5s ease", opacity: animating ? 0 : 1 }}>
              <div style={{ fontSize: "clamp(34px,5vw,58px)", fontWeight: 800, lineHeight: 1.15, color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "8px" }}>
                প্রতিদিনের<br />
                <span style={{
                  background: `linear-gradient(90deg, ${current.accent}, ${current.accent}cc, ${current.accent})`,
                  backgroundSize: "200% auto", WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent", backgroundClip: "text",
                  animation: "heroShimmer 3s linear infinite",
                }}>হেলদি রুটিনে</span>
              </div>
              <div style={{ fontSize: "clamp(34px,5vw,58px)", fontWeight: 800, lineHeight: 1.15, color: "#ffffff" }}>
                প্রিমিয়াম সুপারফুড
              </div>
            </div>
          </div>

          <p style={{ color: "#ffffff70", fontSize: "15px", lineHeight: 1.8, marginBottom: "36px", maxWidth: "480px" }}>
            সরাসরি বিশ্বস্ত উৎস থেকে সংগ্রহ করা কালোজিরা, চিয়া, মরিঙ্গা ও মধু —
            যত্নে প্যাকেজিং, আপনার দোরগোড়ায় ডেলিভারি।
          </p>

          <div style={{ display: "flex", gap: "10px", marginBottom: "40px", flexWrap: "wrap" }}>
            {["COD সুবিধা", "হোম ডেলিভারি", "খাঁটি উৎস"].map((b, i) => (
              <div key={i} style={{
                background: "#ffffff08", border: "1px solid #ffffff15",
                borderRadius: "99px", padding: "8px 16px", fontSize: "12.5px", color: "#ffffff80", fontWeight: 500,
              }}>✦ {b}</div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button className="hero-add-btn" onClick={() => router.push(`/product/${current.slug}`)} style={{
              background: current.accent, color: "#0a0f0c", border: "none",
              borderRadius: "14px", padding: "15px 32px", fontSize: "15px", fontWeight: 700,
              cursor: "pointer", boxShadow: `0 12px 36px ${current.accent}40`, fontFamily: "inherit",
            }}>এখনই অর্ডার করুন →</button>
            <button className="hero-add-btn" onClick={() => router.push("/shop")} style={{
              background: "transparent", color: "#ffffff80", border: "1px solid #ffffff20",
              borderRadius: "14px", padding: "15px 28px", fontSize: "15px",
              fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}>সব পণ্য দেখুন</button>
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "40px", alignItems: "center" }}>
            <span style={{ color: "#ffffff40", fontSize: "11px", marginRight: "4px" }}>বেছে নিন</span>
            {products.map((p, i) => (
              <div key={p.id} onClick={() => handleSwitch(i)} style={{
                height: "6px", borderRadius: "99px", cursor: "pointer",
                background: i === active ? current.accent : "#ffffff20",
                width: i === active ? "28px" : "6px",
                transition: "all 0.35s ease",
              }} />
            ))}
          </div>
        </div>

        <div style={{ position: "relative", height: "560px" }}>
          {products.map((p, i) => {
            const offset = (i - active + products.length) % products.length;
            if (offset === 0) return null;
            return (
              <div key={p.id} className="hero-bg-card" onClick={() => handleSwitch(i)} style={{
                position: "absolute", width: "100%",
                top: `${offset === 1 ? 14 : offset === 2 ? 24 : 32}px`,
                left: `${offset === 1 ? 10 : offset === 2 ? 18 : 24}px`,
                height: "460px", borderRadius: "28px",
                background: `linear-gradient(145deg, ${p.color}88, #0a0f0c)`,
                border: `1px solid ${p.accent}18`,
                zIndex: 3 - offset,
                opacity: offset === 1 ? 0.7 : 0.35,
                transform: `scale(${1 - offset * 0.03}) rotate(${offset * 1.5}deg)`,
              }} />
            );
          })}

          <div
            className="hero-active-card"
            onClick={() => router.push(`/product/${current.slug || current.id}`)}
            style={{
              position: "absolute", width: "100%", zIndex: 10,
              animation: animating ? "none" : "heroFadeIn 0.45s cubic-bezier(0.34,1.56,0.64,1), heroCardFloat 5s ease-in-out infinite",
              opacity: animating ? 0 : 1,
            }}
          >
            <div style={{
              borderRadius: "28px",
              background: `linear-gradient(155deg, ${current.color}ee 0%, #0d1810 60%, #0a0f0c 100%)`,
              border: `1px solid ${current.accent}25`,
              padding: "36px",
              boxShadow: `0 32px 80px ${current.glow}, 0 0 0 1px ${current.accent}10 inset`,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: "-40px", right: "-40px",
                width: "180px", height: "180px", borderRadius: "50%",
                background: `radial-gradient(circle, ${current.accent}25 0%, transparent 70%)`,
                pointerEvents: "none",
              }} />

              <div style={{ position: "absolute", top: "24px", right: "24px", display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                <div style={{
                  background: `linear-gradient(135deg, ${current.accent}, ${current.accent}cc)`,
                  color: "#0a0f0c", padding: "4px 10px", borderRadius: "8px",
                  fontSize: "12px", fontWeight: 800, boxShadow: `0 4px 12px ${current.accent}40`,
                }}>সাশ্রয় ৳{current.save}</div>
                {current.isSunnah && (
                  <div style={{
                    background: "#ffffff10", border: "1px solid #ffffff20",
                    color: "#ffffff", padding: "4px 10px", borderRadius: "8px",
                    fontSize: "11px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px",
                  }}>🕌 সুন্নাহ প্রোডাক্ট</div>
                )}
              </div>

              <div style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: `${current.accent}22`, border: `1px solid ${current.accent}40`,
                borderRadius: "99px", padding: "5px 14px", marginBottom: "24px",
                color: current.accent, fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em",
              }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: current.accent, animation: "heroPulse 2s infinite", display: "inline-block" }} />
                {current.badge}
              </div>

              <div style={{
                width: "100px", height: "100px", borderRadius: "24px", marginBottom: "24px",
                background: `linear-gradient(135deg, ${current.accent}18, ${current.accent}08)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "52px", border: `1px solid ${current.accent}20`,
                boxShadow: `0 8px 24px ${current.glow}`,
              }}>{current.img}</div>

              <div style={{ marginBottom: "6px" }}>
                <div style={{ fontSize: "26px", fontWeight: 800, color: "#ffffff", lineHeight: 1.2 }}>{current.name}</div>
                <div style={{ fontSize: "13px", color: `${current.accent}99`, fontWeight: 500, marginTop: "4px" }}>{current.sub}</div>
              </div>

              <div style={{ height: "1px", background: "#ffffff10", margin: "20px 0" }} />

              <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", marginBottom: "24px" }}>
                <div style={{ fontSize: "34px", fontWeight: 800, color: current.accent, lineHeight: 1 }}>৳{current.price}</div>
                <div style={{ fontSize: "18px", color: "#ffffff60", textDecoration: "line-through", marginBottom: "3px", fontWeight: 500 }}>(৳{current.oldPrice})</div>
                <div style={{ fontSize: "12px", color: "#ffffff40", marginBottom: "6px", marginLeft: "4px" }}>/ {current.unit}</div>
              </div>

              <button
                className="hero-add-btn"
                onClick={(e) => handleAdd(e, current.id)}
                style={{
                  width: "100%", padding: "16px", borderRadius: "14px",
                  background: added === current.id ? `${current.accent}30` : `linear-gradient(135deg, ${current.accent}, ${current.accent}cc)`,
                  border: added === current.id ? `1px solid ${current.accent}50` : "none",
                  color: added === current.id ? current.accent : "#0a0f0c",
                  fontSize: "15px", fontWeight: 700, cursor: "pointer",
                  animation: added === current.id ? "heroPop 0.3s ease" : "none",
                  boxShadow: added === current.id ? "none" : `0 8px 28px ${current.accent}40`,
                  fontFamily: "inherit",
                }}
              >{added === current.id ? "✓ কার্টে যোগ হয়েছে" : "কার্টে যোগ করুন"}</button>
            </div>
          </div>

          <div className="hero-nav-container">
            {products.map((p, i) => (
              <div key={p.id} className="hero-nav-pill" onClick={() => handleSwitch(i)} style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "5px 12px", borderRadius: "99px", fontSize: "12px",
                background: i === active ? `${p.accent}22` : "transparent",
                border: `1px solid ${i === active ? p.accent + "40" : "transparent"}`,
                color: i === active ? p.accent : "#ffffff35",
                fontWeight: i === active ? 700 : 400,
                opacity: i === active ? 1 : 0.6,
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

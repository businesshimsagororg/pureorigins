const fs = require('fs');
let html = fs.readFileSync('c:/Users/Zillur/Documents/Codex/projects/pureorigins/frontend/index.html', 'utf8');

const heroHtml = `
  <section id="new-hero-section" style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #0a0f0c 0%, #0d1810 40%, #111a14 100%); font-family: 'Noto Sans Bengali', 'Segoe UI', sans-serif; padding: 20px; position: relative; overflow: hidden;">
    
    <div id="hero-ambient-glow" style="position: absolute; inset: 0; pointer-events: none; transition: background 1s ease;"></div>
    
    <div style="position: absolute; inset: 0; pointer-events: none; opacity: 0.04; background-image: url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 256 256\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noise\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.9\\' numOctaves=\\'4\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noise)\\'/%3E%3C/svg%3E');"></div>

    <div id="hero-particles-container"></div>

    <style>
      @keyframes float0 { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-18px) rotate(5deg)} }
      @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-24px) rotate(-4deg)} }
      @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px) rotate(8deg)} }
      @keyframes fadeSlideIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      @keyframes pop { 0%{transform:scale(1)} 50%{transform:scale(1.18)} 100%{transform:scale(1)} }
      @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
      .hero-new-card { transition: all 0.32s cubic-bezier(0.34,1.56,0.64,1); position: absolute; width: 100%; height: 540px; border-radius: 28px; cursor: pointer; }
      .hero-new-card:hover { transform: translateY(-3px) scale(1.015); }
      .hero-add-btn { transition: all 0.2s ease; cursor: pointer; border: none; font-family: inherit; }
      .hero-add-btn:hover { transform: scale(1.05); }
      .hero-add-btn:active { transform: scale(0.95); }
      .hero-tab-dot { transition: all 0.35s ease; cursor: pointer; height: 6px; border-radius: 99px; }
      .hero-nav-pill { transition: all 0.25s ease; cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 99px; font-size: 12px; }
      .hero-nav-pill:hover { opacity: 1 !important; }
      .hero-trust-badge { transition: all 0.2s ease; background: #ffffff08; border: 1px solid #ffffff15; border-radius: 99px; padding: 8px 16px; font-size: 12.5px; color: #ffffff80; font-weight: 500; }
      .hero-trust-badge:hover { transform: translateY(-1px); }
      @media (max-width: 768px) {
        #new-hero-section { min-height: auto !important; padding-top: 20px !important; padding-bottom: 40px !important; align-items: flex-start !important; }
        .hero-left-col { display: none !important; }
        .hero-main-grid { grid-template-columns: 1fr; gap: 20px; }
      }
    </style>

    <div class="hero-main-grid" style="width: 100%; max-width: 1100px; display: grid; grid-template-columns: 1fr 420px; gap: 48px; align-items: center; position: relative; z-index: 1;">
      
      <div class="hero-left-col">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 28px;">
          <div id="hero-brand-icon" style="width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; transition: all 0.5s ease;">🌿</div>
          <span style="color: #ffffff99; font-size: 13px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;">PureOrigins</span>
          <div style="margin-left: auto; position: relative;">
            <div id="hero-cart-indicator" style="display: none; background: #ffffff15; color: #ffffff60; border-radius: 20px; padding: 6px 14px; font-size: 12px; font-weight: 700; align-items: center; gap: 6px; transition: all 0.3s ease; border: 1px solid #ffffff10;">
              
            </div>
          </div>
        </div>

        <div style="margin-bottom: 20px; overflow: hidden;">
          <div id="hero-headline-anim" style="animation: fadeSlideIn 0.5s ease;">
            <div style="font-size: clamp(34px, 5vw, 58px); font-weight: 800; line-height: 1.15; color: #ffffff; letter-spacing: -0.02em; margin-bottom: 8px;">
              প্রতিদিনের<br />
              <span id="hero-shimmer-text" style="background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: shimmer 3s linear infinite;">হেলদি রুটিনে</span>
            </div>
            <div style="font-size: clamp(34px, 5vw, 58px); font-weight: 800; line-height: 1.15; color: #ffffff;">
              প্রিমিয়াম সুপারফুড
            </div>
          </div>
        </div>

        <p style="color: #ffffff70; font-size: 15px; line-height: 1.8; margin-bottom: 36px; max-width: 480px;">
          সরাসরি বিশ্বস্ত উৎস থেকে সংগ্রহ করা কালোজিরা, চিয়া, মরিঙ্গা ও মধু — 
          যত্নে প্যাকেজিং, আপনার দোরগোড়ায় ডেলিভারি।
        </p>

        <div style="display: flex; gap: 10px; margin-bottom: 40px; flex-wrap: wrap;">
          <div class="hero-trust-badge">✦ COD সুবিধা</div>
          <div class="hero-trust-badge">✦ হোম ডেলিভারি</div>
          <div class="hero-trust-badge">✦ খাঁটি উৎস</div>
        </div>

        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button id="hero-order-now-btn" class="hero-add-btn" onclick="navigate('shop')" style="border-radius: 14px; padding: 15px 32px; font-size: 15px; font-weight: 700; color: #0a0f0c;">
            এখনই অর্ডার করুন →
          </button>
          <button class="hero-add-btn" onclick="navigate('shop')" style="background: transparent; color: #ffffff80; border: 1px solid #ffffff20; border-radius: 14px; padding: 15px 28px; font-size: 15px; font-weight: 500;">
            সব পণ্য দেখুন
          </button>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 40px; align-items: center;" id="hero-dots-container">
        </div>
      </div>

      <div style="position: relative; height: 640px;" id="hero-cards-container">
        <!-- Cards rendered via JS -->
      </div>

    </div>
  </section>

  <script>
  (function() {
    const products = [
      { id: 1, name: "কালোজিরা", sub: "Black Seeds", price: "১৮০", unit: "১০০গ্রাম", badge: "বেস্ট সেলার", color: "#1B4332", accent: "#C4972F", img: "🌿", glow: "rgba(27,67,50,0.35)", code: 'black-seeds-kalonjira' },
      { id: 2, name: "চিয়া সিড", sub: "Chia Seeds", price: "২৮০", unit: "১০০গ্রাম", badge: "নতুন", color: "#2D6A4F", accent: "#E8C96B", img: "🌱", glow: "rgba(45,106,79,0.35)", code: 'chia-seeds' },
      { id: 3, name: "মরিঙ্গা পাউডার", sub: "Moringa Powder", price: "৩৮০", unit: "১০০গ্রাম", badge: "সুপারফুড", color: "#1A3A28", accent: "#A8D5A2", img: "🍃", glow: "rgba(26,58,40,0.35)", code: 'moringa-powder' },
      { id: 4, name: "খাঁটি মধু", sub: "Pure Honey", price: "৪৫০", unit: "২৫০গ্রাম", badge: "প্রিমিয়াম", color: "#4A3000", accent: "#F5C842", img: "🍯", glow: "rgba(74,48,0,0.35)", code: 'pure-honey' }
    ];

    let active = 0;
    let animating = false;
    let cartCount = 0;
    let added = null;

    const ambientGlow = document.getElementById('hero-ambient-glow');
    const particlesContainer = document.getElementById('hero-particles-container');
    const brandIcon = document.getElementById('hero-brand-icon');
    const cartIndicator = document.getElementById('hero-cart-indicator');
    const shimmerText = document.getElementById('hero-shimmer-text');
    const orderNowBtn = document.getElementById('hero-order-now-btn');
    const dotsContainer = document.getElementById('hero-dots-container');
    const cardsContainer = document.getElementById('hero-cards-container');
    const headlineAnim = document.getElementById('hero-headline-anim');

    function renderParticles() {
      particlesContainer.innerHTML = '';
      for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        p.style.position = 'absolute';
        p.style.borderRadius = '50%';
        p.style.pointerEvents = 'none';
        p.style.width = (4 + i * 2) + 'px';
        p.style.height = (4 + i * 2) + 'px';
        p.style.background = products[active].accent;
        p.style.opacity = (0.12 + i * 0.015);
        p.style.top = (10 + i * 11) + '%';
        p.style.left = (5 + i * 12) + '%';
        p.style.animation = \`float\${i % 3} \${4 + i}s ease-in-out infinite\`;
        p.style.filter = \`blur(\${i % 2}px)\`;
        particlesContainer.appendChild(p);
      }
    }

    function renderDots() {
      dotsContainer.innerHTML = '<span style="color: #ffffff40; font-size: 11px; margin-right: 4px;">বেছে নিন</span>';
      products.forEach((p, i) => {
        const dot = document.createElement('div');
        dot.className = 'hero-tab-dot';
        dot.style.background = i === active ? products[active].accent : '#ffffff20';
        dot.style.width = i === active ? '28px' : '6px';
        dot.onclick = () => handleSwitch(i);
        dotsContainer.appendChild(dot);
      });
    }

    function renderCards() {
      cardsContainer.innerHTML = '';
      const current = products[active];

      // Background cards
      products.forEach((p, i) => {
        const offset = (i - active + products.length) % products.length;
        if (offset === 0) return;
        const card = document.createElement('div');
        card.className = 'hero-new-card';
        card.style.top = offset === 1 ? '14px' : offset === 2 ? '24px' : '32px';
        card.style.left = offset === 1 ? '10px' : offset === 2 ? '18px' : '24px';
        card.style.background = \`linear-gradient(145deg, \${p.color}88, #0a0f0c)\`;
        card.style.border = \`1px solid \${p.accent}18\`;
        card.style.zIndex = 3 - offset;
        card.style.opacity = offset === 1 ? 0.7 : 0.35;
        card.style.transform = \`scale(\${1 - offset * 0.03}) rotate(\${offset * 1.5}deg)\`;
        card.onclick = () => handleSwitch(i);
        cardsContainer.appendChild(card);
      });

      // Active card
      const activeCardWrap = document.createElement('div');
      activeCardWrap.style.position = 'absolute';
      activeCardWrap.style.width = '100%';
      activeCardWrap.style.zIndex = 10;
      activeCardWrap.style.animation = animating ? 'none' : 'fadeSlideIn 0.45s cubic-bezier(0.34,1.56,0.64,1)';
      activeCardWrap.style.opacity = animating ? 0 : 1;
      activeCardWrap.style.cursor = 'pointer';
      
      activeCardWrap.onclick = (e) => {
        if (!e.target.closest('#hero-add-btn') && !e.target.closest('.hero-nav-pill')) {
           if (typeof navigateHeroProduct === 'function') {
             navigateHeroProduct(current.code, current.id);
           } else {
             if (typeof navigate === 'function') navigate('detail', current.id);
           }
        }
      };
      
      activeCardWrap.innerHTML = \`
        <div style="border-radius: 28px; background: linear-gradient(155deg, \${current.color}ee 0%, #0d1810 60%, #0a0f0c 100%); border: 1px solid \${current.accent}25; padding: 36px; box-shadow: 0 32px 80px \${current.glow}, 0 0 0 1px \${current.accent}10 inset; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -40px; right: -40px; width: 180px; height: 180px; border-radius: 50%; background: radial-gradient(circle, \${current.accent}25 0%, transparent 70%); pointer-events: none;"></div>
          <div style="display: inline-flex; align-items: center; gap: 6px; background: \${current.accent}22; border: 1px solid \${current.accent}40; border-radius: 99px; padding: 5px 14px; margin-bottom: 24px; color: \${current.accent}; font-size: 11px; font-weight: 700; letter-spacing: 0.06em;">
            <span style="width: 5px; height: 5px; border-radius: 50%; background: \${current.accent}; animation: pulse 2s infinite;"></span>
            \${current.badge}
          </div>
          <div style="width: 100px; height: 100px; border-radius: 24px; margin-bottom: 24px; background: linear-gradient(135deg, \${current.accent}18, \${current.accent}08); display: flex; align-items: center; justify-content: center; font-size: 52px; border: 1px solid \${current.accent}20; box-shadow: 0 8px 24px \${current.glow};">\${current.img}</div>
          <div style="margin-bottom: 6px;">
            <div style="font-size: 26px; font-weight: 800; color: #ffffff; line-height: 1.2;">\${current.name}</div>
            <div style="font-size: 13px; color: \${current.accent}99; font-weight: 500; margin-top: 4px;">\${current.sub}</div>
          </div>
          <div style="height: 1px; background: #ffffff10; margin: 20px 0;"></div>
          <div style="display: flex; align-items: flex-end; gap: 8px; margin-bottom: 24px;">
            <div style="font-size: 32px; font-weight: 800; color: \${current.accent}; line-height: 1;">৳\${current.price}</div>
            <div style="font-size: 12px; color: #ffffff40; margin-bottom: 4px;">/ \${current.unit}</div>
          </div>
          <div style="display: flex; gap: 8px; margin-bottom: 28px; flex-wrap: wrap;">
            \${["১০০গ্রাম", "২৫০গ্রাম", "৫০০গ্রাম"].map((w, i) => \`
              <div style="padding: 6px 14px; border-radius: 99px; font-size: 12px; font-weight: 600; background: \${i === 0 ? current.accent + '25' : '#ffffff0a'}; border: 1px solid \${i === 0 ? current.accent + '50' : '#ffffff15'}; color: \${i === 0 ? current.accent : '#ffffff50'}; transition: all 0.2s;">\${w}</div>
            \`).join('')}
          </div>
          <button id="hero-add-btn" class="hero-add-btn" style="width: 100%; padding: 16px; border-radius: 14px; font-size: 15px; font-weight: 700; background: linear-gradient(135deg, \${current.accent}, \${current.accent}cc); color: #0a0f0c; box-shadow: 0 8px 28px \${current.accent}40;">
            কার্টে যোগ করুন
          </button>
          <div style="margin-top: 14px; text-align: center; font-size: 11.5px; color: #ffffff35; display: flex; align-items: center; justify-content: center; gap: 6px;">
            <span>💵</span> COD সুবিধায় পণ্য হাতে পেয়ে পেমেন্ট
          </div>
        </div>
      \`;

      cardsContainer.appendChild(activeCardWrap);
      
      setTimeout(() => {
          const btn = document.getElementById('hero-add-btn');
          if (btn) btn.onclick = (e) => handleAdd(e, current);
      }, 0);

      // Mini product switcher pills
      const pillsWrap = document.createElement('div');
      pillsWrap.style.position = 'absolute';
      pillsWrap.style.bottom = '-52px';
      pillsWrap.style.left = '50%';
      pillsWrap.style.transform = 'translateX(-50%)';
      pillsWrap.style.display = 'flex';
      pillsWrap.style.gap = '8px';
      pillsWrap.style.background = '#ffffff08';
      pillsWrap.style.borderRadius = '99px';
      pillsWrap.style.padding = '6px 10px';
      pillsWrap.style.border = '1px solid #ffffff10';

      products.forEach((p, i) => {
        const pill = document.createElement('div');
        pill.className = 'hero-nav-pill';
        pill.style.background = i === active ? \`\${p.accent}22\` : 'transparent';
        pill.style.border = \`1px solid \${i === active ? p.accent + '40' : 'transparent'}\`;
        pill.style.color = i === active ? p.accent : '#ffffff35';
        pill.style.fontWeight = i === active ? '700' : '400';
        pill.style.opacity = i === active ? '1' : '0.6';
        pill.innerHTML = \`<span style="font-size: 14px;">\${p.img}</span><span style="white-space: nowrap;">\${p.name}</span>\`;
        pill.onclick = () => handleSwitch(i);
        pillsWrap.appendChild(pill);
      });
      cardsContainer.appendChild(pillsWrap);
    }

    function updateStaticUI() {
      const current = products[active];
      ambientGlow.style.background = \`radial-gradient(ellipse 60% 50% at 70% 50%, \${current.glow} 0%, transparent 70%)\`;
      brandIcon.style.background = \`linear-gradient(135deg, \${current.color}, \${current.accent}33)\`;
      brandIcon.style.border = \`1px solid \${current.accent}30\`;
      shimmerText.style.background = \`linear-gradient(90deg, \${current.accent}, \${current.accent}cc, \${current.accent})\`;
      shimmerText.style.backgroundSize = "200% auto";
      shimmerText.style.webkitBackgroundClip = "text";
      shimmerText.style.webkitTextFillColor = "transparent";
      orderNowBtn.style.background = current.accent;
      orderNowBtn.style.boxShadow = \`0 12px 36px \${current.accent}40\`;
    }

    function renderAll() {
      renderParticles();
      renderDots();
      renderCards();
      updateStaticUI();
    }

    function handleSwitch(i) {
      if (i === active || animating) return;
      animating = true;
      renderAll();
      
      // trigger animation restart
      headlineAnim.style.animation = 'none';
      void headlineAnim.offsetWidth;
      headlineAnim.style.animation = 'fadeSlideIn 0.5s ease';

      setTimeout(() => { 
        active = i; 
        animating = false; 
        renderAll(); 
      }, 280);
    }

    function handleAdd(e, product) {
      e.stopPropagation();
      cartCount++;
      added = product.id;
      
      const btn = document.getElementById('hero-add-btn');
      if (btn) {
        btn.style.background = \`\${product.accent}30\`;
        btn.style.border = \`1px solid \${product.accent}50\`;
        btn.style.color = product.accent;
        btn.style.boxShadow = 'none';
        btn.style.animation = 'pop 0.3s ease';
        btn.innerText = '✓ কার্টে যোগ হয়েছে';
      }

      cartIndicator.style.background = products[active].accent;
      cartIndicator.style.color = '#0a0f0c';
      cartIndicator.innerHTML = \`🛒 \${cartCount}টি\`;
      
      if (typeof window.addHeroProductToCart === 'function') {
          window.addHeroProductToCart(product.code, product.id);
      }

      setTimeout(() => {
        added = null;
        renderAll();
      }, 1400);
    }

    setInterval(() => {
      handleSwitch((active + 1) % products.length);
    }, 3800);

    renderAll();
  })();
  </script>
`;

const startIdx = html.indexOf('<section class="hero">');
const endIdx = html.indexOf('</section>', startIdx) + 10;

html = html.substring(0, startIdx) + heroHtml + html.substring(endIdx);
fs.writeFileSync('c:/Users/Zillur/Documents/Codex/projects/pureorigins/frontend/index.html', html);
console.log('Successfully updated index.html');

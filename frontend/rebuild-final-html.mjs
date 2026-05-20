import fs from "node:fs";
import path from "node:path";

const sourcePath = "C:/Users/Zillur/Downloads/bijghor-ecommerce.html";
const outputPath = path.resolve("index.html");

const brand = "PureOrigins";
const badTextPattern = /à¦|à§|Ã|ðŸ|â˜|ï»¿/;

function countBangla(text) {
  return (text.match(/[\u0980-\u09FF]/g) || []).length;
}

function countBadText(text) {
  return (text.match(/à¦|à§|Ã|ðŸ|â˜|ï»¿/g) || []).length;
}

function requireReplace(text, search, replacement, label) {
  if (!text.includes(search)) {
    throw new Error(`Could not find required block: ${label}`);
  }
  return text.replace(search, replacement);
}

function replaceRegex(text, pattern, replacement, label) {
  if (!pattern.test(text)) {
    throw new Error(`Could not find required pattern: ${label}`);
  }
  return text.replace(pattern, replacement);
}

function loadCleanHtml() {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Original clean HTML was not found: ${sourcePath}`);
  }

  const html = fs.readFileSync(sourcePath, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const banglaCount = countBangla(html);
  const badCount = countBadText(html);

  if (banglaCount < 500 || badCount > 0) {
    throw new Error(
      `Source file is not clean UTF-8. Bengali chars: ${banglaCount}, mojibake markers: ${badCount}`
    );
  }

  return html;
}

function applyFinalFixes(html) {
  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${brand} - প্রিমিয়াম হেলথ সিড ও সুপারফুড | বাংলাদেশ</title>`
  );

  html = html.replace(
    /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Hind\+Siliguri:[^"]+" rel="stylesheet"\/>/,
    `<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@300;400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet"/>`
  );

  html = html.replace(
    /--font-bn:\s*'Hind Siliguri',sans-serif;/,
    `--font-bn:'Noto Sans Bengali','Hind Siliguri','SolaimanLipi','Kalpurush',sans-serif;`
  );

  html = html.replaceAll("বীজঘর", brand);
  html = html.replaceAll("বীজ ঘর", brand);
  html = html.replaceAll("BijghorBD", "PureOriginsBD");
  html = html.replaceAll("support@bijghor.com", "support@pureorigins.com");
  html = html.replaceAll("bijghor_cart", "pureorigins_cart");

  html = replaceRegex(
    html,
    /<div class="logo" onclick="navigate\('home'\)">[\s\S]*?<\/div>/,
    `<div class="logo" onclick="navigate('home')">\n      <span class="logo-leaf">🌿</span>${brand}\n    </div>`,
    "brand logo"
  );

  html = html.replace(
    /<div class="trust-item"><span class="icon">🇧🇩<\/span>[^<]*<\/div>\n?/u,
    ""
  );

  html = html.replace(
    /<div class="why-card"><div class="why-icon">📞<\/div><h3>[^<]*<\/h3><p>[^<]*<\/p><\/div>\n?/u,
    ""
  );

  html = requireReplace(
    html,
    `.hero{
  background:linear-gradient(135deg,#0D2B1D 0%,#1B4332 45%,#2D6A4F 100%);
  min-height:88vh;
  display:flex;align-items:center;
  position:relative;overflow:hidden;
  padding:60px 20px;
}`,
    `.hero{
  background:linear-gradient(135deg,#0D2B1D 0%,#1B4332 45%,#2D6A4F 100%);
  min-height:60vh;
  display:flex;align-items:flex-start;
  position:relative;overflow:hidden;
  padding:28px 20px 20px;
}`,
    "compact hero"
  );

  html = html.replace(
    `display:grid;grid-template-columns:1fr 1fr;gap:60px;
  align-items:center;position:relative;z-index:1;`,
    `display:grid;grid-template-columns:1fr 1fr;gap:40px;
  align-items:center;position:relative;z-index:1;`
  );

  html = requireReplace(
    html,
    `.hero-visual{
  display:grid;grid-template-columns:1fr 1fr;gap:16px;
  position:relative;
}`,
    `.hero-visual{
  display:grid;grid-template-columns:1fr 1fr;gap:16px;
  position:relative;
  align-items:stretch;
  grid-auto-rows:1fr;
}`,
    "aligned hero card grid"
  );

  html = requireReplace(
    html,
    `.hero-card{
  background:rgba(255,255,255,.08);
  backdrop-filter:blur(10px);
  border:1px solid rgba(255,255,255,.15);
  border-radius:16px;padding:20px;
  text-align:center;
  transition:transform .3s;
}`,
    `.hero-card{
  background:rgba(255,255,255,.08);
  backdrop-filter:blur(10px);
  border:1px solid rgba(255,255,255,.15);
  border-radius:16px;padding:20px;
  text-align:center;
  transition:transform .3s;
  height:100%;
  cursor:pointer;
}`,
    "equal hero cards"
  );

  html = html.replace(`.hero-card:first-child{transform:translateY(20px)}\n`, "");
  html = html.replace(`.hero-card:nth-child(3){transform:translateY(-10px)}\n`, "");

  html = html.replace(
    `<div class="hero-card"><div class="hero-card-emoji">🌿</div><h3>কালোজিরা</h3><p>Nigella Seeds</p><div class="price">৳১৮০</div></div>
        <div class="hero-card"><div class="hero-card-emoji">🌱</div><h3>চিয়া সিড</h3><p>Chia Seeds</p><div class="price">৳২৮০</div></div>
        <div class="hero-card"><div class="hero-card-emoji">🌻</div><h3>ফ্ল্যাক্স সিড</h3><p>Flax Seeds</p><div class="price">৳২২০</div></div>
        <div class="hero-card"><div class="hero-card-emoji">🍃</div><h3>মরিঙ্গা পাউডার</h3><p>Moringa Powder</p><div class="price">৳৩৫০</div></div>`,
    `<div class="hero-card" onclick="navigate('detail',1)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();navigate('detail',1)}" role="button" tabindex="0" aria-label="কালোজিরা বিস্তারিত দেখুন"><div class="hero-card-emoji">🌿</div><h3>কালোজিরা</h3><p>Nigella Seeds</p><div class="price">৳১৮০</div></div>
        <div class="hero-card" onclick="navigate('detail',2)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();navigate('detail',2)}" role="button" tabindex="0" aria-label="চিয়া সিড বিস্তারিত দেখুন"><div class="hero-card-emoji">🌱</div><h3>চিয়া সিড</h3><p>Chia Seeds</p><div class="price">৳২৮০</div></div>
        <div class="hero-card" onclick="navigate('detail',3)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();navigate('detail',3)}" role="button" tabindex="0" aria-label="ফ্ল্যাক্স সিড বিস্তারিত দেখুন"><div class="hero-card-emoji">🌻</div><h3>ফ্ল্যাক্স সিড</h3><p>Flax Seeds</p><div class="price">৳২২০</div></div>
        <div class="hero-card" onclick="navigate('detail',7)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();navigate('detail',7)}" role="button" tabindex="0" aria-label="মরিঙ্গা পাউডার বিস্তারিত দেখুন"><div class="hero-card-emoji">🍃</div><h3>মরিঙ্গা পাউডার</h3><p>Moringa Powder</p><div class="price">৳৩৮০</div></div>`
  );

  html = html.replace(`.section{padding:64px 20px}`, `.section{padding:36px 20px}`);
  html = html.replace(`.section-sm{padding:40px 20px}`, `.section-sm{padding:26px 20px}`);
  html = html.replace(`.section-head{text-align:center;margin-bottom:48px}`, `.section-head{text-align:center;margin-bottom:24px}`);
  html = html.replace(`.section-head{text-align:center;margin-bottom:36px}`, `.section-head{text-align:center;margin-bottom:24px}`);

  html = replaceRegex(
    html,
    /\.product-card\{\n  background:var\(--white\);border-radius:16px;[\s\S]*?position:relative;\n\}/,
    `.product-card{
  background:var(--white);border-radius:16px;
  overflow:hidden;border:1px solid var(--border);
  transition:all .25s;
  position:relative;
  cursor:pointer;
}`,
    "clickable product card style"
  );

  html = requireReplace(
    html,
    `return \`<div class="product-card">`,
    `return \`<div class="product-card" onclick="navigate('detail',\${p.id})" role="button" tabindex="0" aria-label="\${p.name} বিস্তারিত দেখুন">`,
    "product card click target"
  );

  html = html.replace(
    /onclick="event\.stopPropagation\(\);navigate\('detail',\$\{p\.id\}\)" role="button"/,
    `onclick="navigate('detail',\${p.id})" role="button"`
  );

  html = replaceRegex(
    html,
    /<button class="btn-cart" onclick="addToCart\(getProduct\(\$\{p\.id\}\),'\$\{p\.weight\[0\]\}'\)">/,
    `<button class="btn-cart" onclick="event.stopPropagation();addToCart(getProduct(\${p.id}),'\${p.weight[0]}')">`,
    "cart button click isolation"
  );

  html = replaceRegex(
    html,
    /<button class="btn-view" onclick="navigate\('detail',\$\{p\.id\}\)">/,
    `<button class="btn-view" onclick="event.stopPropagation();navigate('detail',\${p.id})">`,
    "details button click isolation"
  );

  html = requireReplace(
    html,
    `.reviews-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}`,
    `.reviews-toolbar{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px}
.reviews-controls{display:flex;gap:8px;align-items:center}
.slider-btn{
  border:1px solid var(--border);
  background:var(--white);
  color:var(--forest);
  border-radius:10px;
  padding:8px 12px;
  font-size:13px;
  font-weight:700;
  cursor:pointer;
}
.slider-btn:hover{border-color:var(--forest);box-shadow:0 6px 16px rgba(27,67,50,.08)}
.reviews-slider{
  display:grid;
  grid-auto-flow:column;
  grid-auto-columns:minmax(280px,1fr);
  gap:20px;
  overflow-x:auto;
  scroll-behavior:smooth;
  padding:2px 2px 8px;
  scrollbar-width:none;
  overscroll-behavior-inline:contain;
}
.reviews-slider::-webkit-scrollbar{display:none}
.reviews-slider.rtl{direction:rtl}`,
    "review slider css"
  );

  html = requireReplace(
    html,
    `<div class="reviews-grid" id="reviews-container"></div>`,
    `<div class="reviews-toolbar">
        <div class="tag-line">স্লাইড করে রিভিউ পড়ুন</div>
        <div class="reviews-controls">
          <button class="slider-btn" type="button" onclick="slideReviews(-1)">←</button>
          <button class="slider-btn" type="button" onclick="slideReviews(1)">→</button>
        </div>
      </div>
      <div class="reviews-slider" id="reviews-container"></div>`,
    "review slider markup"
  );

  html = replaceRegex(
    html,
    /function renderReviews\(\)\{[\s\S]*?\n\}\n\nfunction renderFaqBlock/,
    `function renderReviews(){
  const container = document.getElementById('reviews-container');
  if(!container)return;
  container.innerHTML = reviews.map(r=>\`
    <div class="review-card">
      <div class="stars">\${'★'.repeat(r.stars)}\${'☆'.repeat(5-r.stars)}</div>
      <p class="review-text">\${r.text}</p>
      <div class="reviewer">
        <div class="reviewer-avatar">\${r.name[0]}</div>
        <div><div class="reviewer-name">\${r.name}</div><div class="reviewer-loc">📍 \${r.loc}</div></div>
      </div>
    </div>\`).join('');
  setupReviewSlider();
}

let reviewsRtl = false;
function setupReviewSlider(){
  const slider = document.getElementById('reviews-container');
  if(!slider)return;
  if(!slider.dataset.reviewSliderReady){
    slider.addEventListener('touchstart',stopReviewsAutoScroll,{passive:true});
    slider.addEventListener('touchend',startReviewsAutoScroll,{passive:true});
    slider.dataset.reviewSliderReady='1';
  }
  startReviewsAutoScroll();
}
let reviewsAutoTimer = null;
function stopReviewsAutoScroll(){
  if(reviewsAutoTimer)clearInterval(reviewsAutoTimer);
  reviewsAutoTimer = null;
}
function startReviewsAutoScroll(){
  const slider = document.getElementById('reviews-container');
  if(!slider)return;
  stopReviewsAutoScroll();
  reviewsAutoTimer = setInterval(()=>{
    if(!document.body.contains(slider)){stopReviewsAutoScroll();return;}
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    if(maxScroll<=0)return;
    if(slider.scrollLeft >= maxScroll-2){
      slider.scrollTo({left:0,behavior:'smooth'});
      return;
    }
    slider.scrollBy({left:1,behavior:'auto'});
  },24);
}
function slideReviews(direction){
  const slider = document.getElementById('reviews-container');
  if(!slider)return;
  stopReviewsAutoScroll();
  const step = Math.max(280,Math.round(slider.clientWidth*.85));
  slider.scrollBy({left:direction*step,behavior:'smooth'});
  setTimeout(startReviewsAutoScroll,2200);
}

function renderFaqBlock`,
    "review slider script"
  );

  html = html.replace(
    /@media\(max-width:768px\)\{[\s\S]*?\.hero\{min-height:auto;padding:40px 16px\}/,
    (match) => match.replace(`.hero{min-height:auto;padding:40px 16px}`, `.hero{min-height:56vh;padding:24px 16px 18px}`)
  );

  html = html.replace(
    "</style>",
    `
/* Mobile-first final tuning */
html,body{max-width:100%;overflow-x:hidden}
button,a,.product-card,.cat-card,.combo-card{touch-action:manipulation}
input,select,textarea{font-size:16px}

@media(max-width:768px){
  body{font-size:15px}
  .topbar{
    display:flex;overflow-x:auto;white-space:nowrap;text-align:left;
    gap:12px;padding:8px 12px;scrollbar-width:none;
  }
  .topbar::-webkit-scrollbar{display:none}
  .topbar span{margin:0;flex:0 0 auto}
  .nav-inner{padding:10px 12px;gap:8px}
  .logo{font-size:22px;gap:6px;min-width:0;white-space:nowrap}
  .logo-leaf{font-size:20px}
  .nav-right{gap:8px}
  .cart-btn{
    position:relative;min-width:42px;height:40px;padding:0 10px;
    justify-content:center;font-size:0;border-radius:10px;
  }
  .cart-btn::before{content:'🛒';font-size:17px}
  .cart-count{top:-6px;right:-6px}
  .hamburger{
    display:flex;align-items:center;justify-content:center;
    width:40px;height:40px;border:1px solid var(--border);
    border-radius:10px;background:var(--white);
  }
  .mobile-nav{padding:10px 12px}
  .mobile-nav.open{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .mobile-nav a{
    border:1px solid var(--border);border-radius:10px;
    background:var(--cream);padding:10px;font-size:14px;
  }
  .hero{min-height:auto;padding:22px 16px 26px}
  .hero-content{display:block}
  .hero-badge{font-size:11.5px;padding:5px 10px;margin-bottom:14px}
  .hero h1{font-size:32px;line-height:1.16;margin-bottom:12px}
  .hero-subtitle{font-size:14.5px;line-height:1.75;margin-bottom:18px}
  .hero-actions{display:grid;grid-template-columns:1fr;gap:10px}
  .btn-primary,.btn-outline,.btn-white{
    width:100%;justify-content:center;text-align:center;
    padding:13px 16px;font-size:14.5px;border-radius:11px;
  }
  .hero-visual{
    display:grid;
    grid-template-columns:none;
    grid-auto-flow:column;
    grid-auto-columns:132px;
    gap:10px;
    overflow-x:auto;
    margin-top:20px;
    padding:2px 2px 6px;
    scrollbar-width:none;
  }
  .hero-visual::-webkit-scrollbar{display:none}
  .hero-card{
    min-height:142px;
    padding:14px 10px;
    border-radius:14px;
  }
  .hero-card:hover{transform:none}
  .hero-card-emoji{font-size:30px;margin-bottom:8px}
  .hero-card h3{font-size:13px}
  .hero-card p{font-size:11px}
  .hero-card .price{font-size:14px}
  .hero-stats{gap:10px;margin-top:20px;justify-content:space-between}
  .stat{
    flex:1;background:rgba(255,255,255,.08);
    border:1px solid rgba(255,255,255,.12);border-radius:12px;
    padding:10px 6px;
  }
  .stat-num{font-size:22px}
  .stat-lbl{font-size:11px}
  .trust-strip{padding:12px}
  .trust-strip-inner{
    display:grid;grid-template-columns:1fr 1fr;gap:8px;
    justify-content:stretch;overflow:visible;flex-wrap:initial;
  }
  .trust-item{
    background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);
    border-radius:10px;padding:9px 10px;font-size:12px;justify-content:flex-start;
  }
  .section,.section-sm{padding:28px 14px}
  .section-head{margin-bottom:18px}
  .section-head h2{font-size:26px;line-height:1.22}
  .section-head p{font-size:14px;line-height:1.7}
  .cat-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
  .cat-card{padding:16px 10px;border-radius:12px}
  .cat-emoji{font-size:30px;margin-bottom:8px}
  .products-grid{grid-template-columns:1fr;gap:14px}
  .product-card{border-radius:14px}
  .product-card:hover{transform:none}
  .product-img{height:160px;font-size:58px}
  .product-body{padding:18px}
  .bn-name{font-size:16px}
  .price-now{font-size:21px}
  .product-actions{display:grid;grid-template-columns:1fr 104px;gap:10px}
  .btn-cart,.btn-view{min-height:48px;font-size:14px;border-radius:10px}
  .why-grid{grid-template-columns:1fr 1fr;gap:10px}
  .why-card{padding:16px 10px;border-radius:12px}
  .why-icon{font-size:28px}
  .combo-grid{grid-template-columns:1fr;gap:14px}
  .combo-card{padding:18px;border-radius:14px}
  .reviews-toolbar{align-items:flex-start;flex-direction:column;margin-bottom:12px}
  .reviews-controls{width:100%;justify-content:flex-end}
  .slider-btn{width:44px;height:40px;padding:0;border-radius:10px}
  .reviews-slider{grid-auto-columns:86%;gap:12px;padding-bottom:4px}
  .review-card{padding:20px 16px;min-height:250px}
  .review-text{font-size:14px;line-height:1.75}
  .benefits-grid{grid-template-columns:1fr;gap:12px}
  .benefit-item{padding:16px;border-radius:12px}
  .detail-grid{grid-template-columns:1fr;gap:20px;padding:20px 14px}
  .detail-img-main{height:260px;font-size:86px;border-radius:16px}
  .detail-thumbs{overflow-x:auto;padding-bottom:6px}
  .thumb{width:60px;height:60px;font-size:24px}
  .detail-info h1{font-size:24px;line-height:1.25}
  .detail-actions{display:grid;grid-template-columns:1fr;gap:10px}
  .btn-buy,.btn-add{min-height:48px}
  .detail-meta{padding:14px}
  .tabs{overflow-x:auto;white-space:nowrap;scrollbar-width:none}
  .tabs::-webkit-scrollbar{display:none}
  .tab{padding:10px 14px;flex:0 0 auto}
  #page-cart .container,#page-checkout .container{padding:0!important}
  .cart-layout,.checkout-layout{grid-template-columns:1fr;gap:18px;padding:20px 14px}
  .cart-summary,.checkout-summary{position:static;padding:18px;border-radius:14px}
  .cart-table{border-radius:14px}
  .cart-row{grid-template-columns:54px 1fr;gap:12px;padding:14px}
  .cart-row-head{display:none}
  .cart-img{width:54px;height:54px;font-size:24px}
  .cart-row>div:nth-child(3),.cart-row>div:nth-child(4){grid-column:2}
  .cart-row>div:nth-child(4){justify-content:space-between!important}
  .coupon-input{display:grid;grid-template-columns:1fr auto;gap:8px}
  .checkout-form{padding:18px;border-radius:14px}
  .form-row{grid-template-columns:1fr;gap:12px}
  .payment-option{padding:12px}
  .summary-row{font-size:14px}
  .about-hero{padding:34px 16px}
  .about-story,.contact-grid{grid-template-columns:1fr;gap:18px;padding:28px 14px}
  .about-visual,.contact-info,.contact-form{padding:22px;border-radius:16px}
  .values-grid{grid-template-columns:1fr;gap:12px}
  .value-card{padding:18px;border-radius:12px}
  .cta-banner{padding:42px 16px}
  footer{padding:34px 16px 20px}
  .footer-grid{grid-template-columns:1fr;gap:24px;margin-bottom:28px}
  .toast{
    left:14px;right:14px;bottom:78px;width:auto;text-align:center;
    transform:translateY(20px);
  }
  .toast.show{transform:translateY(0)}
  #chatBtn{
    right:14px!important;bottom:14px!important;
    width:54px!important;height:54px!important;font-size:24px!important;
  }
}

@media(max-width:420px){
  .logo{font-size:20px}
  .hero h1{font-size:30px}
  .hero-visual{grid-auto-columns:124px}
  .section-head h2{font-size:24px}
  .product-actions{grid-template-columns:1fr}
  .btn-view{min-height:44px}
  .why-grid,.trust-strip-inner{grid-template-columns:1fr}
  .reviews-slider{grid-auto-columns:88%}
  .cart-row{grid-template-columns:48px 1fr}
  .cart-img{width:48px;height:48px}
}
</style>`
  );

  return html;
}

function verifyFinal(html) {
  const banglaCount = countBangla(html);
  const badCount = countBadText(html);

  const checks = [
    [banglaCount > 500, `Bengali text count is too low: ${banglaCount}`],
    [badCount === 0, `Found mojibake markers: ${badCount}`],
    [html.includes("PureOrigins"), "Brand name PureOrigins is missing"],
    [!html.includes("বাংলা সাপোর্ট"), "Removed বাংলা সাপোর্ট text came back"],
    [html.includes(`role="button" tabindex="0"`), "Full product card click behavior is missing"],
    [html.includes(`startReviewsAutoScroll`), "Auto review slider is missing"],
    [!badTextPattern.test(html), "Mojibake marker detected in final HTML"],
  ];

  for (const [ok, message] of checks) {
    if (!ok) throw new Error(message);
  }
}

const finalHtml = applyFinalFixes(loadCleanHtml());
verifyFinal(finalHtml);
fs.writeFileSync(outputPath, finalHtml, "utf8");

console.log(
  JSON.stringify(
    {
      outputPath,
      bytes: fs.statSync(outputPath).size,
      bangla: countBangla(finalHtml),
      mojibakeMarkers: countBadText(finalHtml),
      brand,
    },
    null,
    2
  )
);

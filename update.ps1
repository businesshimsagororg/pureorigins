$content = Get-Content -Path "frontend/index.html" -Raw -Encoding UTF8

# 1. Logo
$content = $content -replace '(?s)<div class="logo" onclick="navigate\(''home''\)">\s*<span class="logo-leaf">🌿</span>PureOrigins\s*</div>', '<div class="logo" onclick="navigate(''home'')">
        <img src="og-image.png" alt="PureOrigins Logo" style="max-height: 40px; cursor: pointer;">
      </div>'

# 2. Mobile products-grid
$content = $content -replace '\.products-grid\{grid-template-columns:1fr;gap:14px\}', '.products-grid{grid-template-columns:repeat(2,1fr);gap:10px}'

# 3. Sticky cart transparency
$content = $content -replace 'box-shadow:0 18px 44px rgba\(0,0,0,\.45\);', 'box-shadow:0 18px 44px rgba(0,0,0,.45);
    background: rgba(26,26,26,0.5);
    backdrop-filter: blur(10px);'
$content = $content -replace 'background:rgba\(255,252,246,\.96\);', 'background:rgba(255,252,246,.50);'

# 4. Top nav: Move hamburger left, add search before cart
$oldNavRight = '(?s)<div class="nav-right">\s*<button class="cart-btn" onclick="navigate\(''cart''\)">\s*<span class="cart-label">কার্ট</span> <span class="cart-count" id="cartCount">0</span>\s*</button>\s*<button class="hamburger" id="hamburger" onclick="toggleMobile\(\)">\s*<span></span><span></span><span></span>\s*</button>\s*</div>'

$newNavRight = '<div class="nav-right">
        <button class="search-btn" onclick="openShopSearch()" style="background:none;border:none;font-size:20px;margin-right:10px;cursor:pointer;" aria-label="Search">🔍</button>
        <button class="cart-btn" onclick="navigate(''cart'')">
          <span class="cart-label">কার্ট</span> <span class="cart-count" id="cartCount">0</span>
        </button>
      </div>'

$content = $content -replace $oldNavRight, $newNavRight

# Replace logo with hamburger + logo
$content = $content -replace '(?s)<div class="logo" onclick="navigate\(''home''\)">', '<button class="hamburger" id="hamburger" onclick="toggleMobile()" style="margin-right:15px; border:none; background:none;">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
      <div class="logo" onclick="navigate(''home'')">'

# 5. Bottom nav: remove home and search, add message
$content = $content -replace '<button class="bottom-nav-btn active" id="bnav-home" onclick="navigate\(''home''\)">', '<!-- Removed Home --><button class="bottom-nav-btn" style="display:none;" id="bnav-home" onclick="navigate(''home'')">'

$content = $content -replace '(?s)<button class="bottom-nav-btn" id="bnav-search" onclick="openShopSearch\(\)">', '<button class="bottom-nav-btn" id="bnav-msg" onclick="window.open(''https://m.me/pureorigins'', ''_blank'')">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2.5" 
stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      <span>মেসেজ</span>
    </button>
    <!-- Removed Search --><button class="bottom-nav-btn" style="display:none;" id="bnav-search" onclick="openShopSearch()">'

$content = $content -replace 'grid-template-columns:repeat\(4,1fr\);', 'grid-template-columns:repeat(3,1fr);'

# 6. Overlay Premium and discount
$content = $content -replace 'style="top:12px;right:12px;left:auto;background:var\(--red\)"', 'style="top:32px;right:16px;left:auto;background:var(--red)"'

# 7. Colors
$content = $content -replace '--forest: #1B4332;', '--forest: #2D6A4F;'
$content = $content -replace '--forest-light: #2D6A4F;', '--forest-light: #40916C;'

Set-Content -Path "frontend/index.html" -Value $content -Encoding UTF8
Write-Output "Done!"

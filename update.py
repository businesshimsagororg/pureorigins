import sys

with open('frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Logo
html = html.replace(
    '<div class="logo" onclick="navigate(\'home\')">\n        <span class="logo-leaf">🌿</span>PureOrigins\n      </div>',
    '<div class="logo" onclick="navigate(\'home\')">\n        <img src="og-image.png" alt="PureOrigins Logo" style="max-height: 40px; cursor: pointer;">\n      </div>'
)

# 2. Mobile products-grid
html = html.replace(
    '.products-grid{grid-template-columns:1fr;gap:14px}',
    '.products-grid{grid-template-columns:repeat(2,1fr);gap:10px}'
)

# 3. Sticky cart transparency
html = html.replace(
    'box-shadow:0 18px 44px rgba(0,0,0,.45);',
    'box-shadow:0 18px 44px rgba(0,0,0,.45);\n    background: rgba(26,26,26,0.5);\n    backdrop-filter: blur(10px);'
)
html = html.replace('background:rgba(255,252,246,.96);', 'background:rgba(255,252,246,.50);')

# 4. Top nav: Move hamburger left, add search before cart
nav_search = """      <div class="nav-right">
        <button class="cart-btn" onclick="navigate('cart')">
          <span class="cart-label">কার্ট</span> <span class="cart-count" id="cartCount">0</span>
        </button>
        <button class="hamburger" id="hamburger" onclick="toggleMobile()">
          <span></span><span></span><span></span>
        </button>
      </div>"""

nav_replace = """      <button class="hamburger" id="hamburger" onclick="toggleMobile()" style="margin-right:15px; border:none; background:none;">
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
      <div class="logo" onclick="navigate('home')">"""

# Replace the logo with the hamburger + logo
html = html.replace(
    '''<div class="logo" onclick="navigate('home')">
        <img src="og-image.png" alt="PureOrigins Logo" style="max-height: 40px; cursor: pointer;">
      </div>''',
    nav_replace + '''\n        <img src="og-image.png" alt="PureOrigins Logo" style="max-height: 40px; cursor: pointer;">\n      </div>'''
)

# Replace the nav-right block to remove hamburger and add search
html = html.replace(nav_search, """      <div class="nav-right">
        <button class="search-btn" onclick="openShopSearch()" style="background:none;border:none;font-size:20px;margin-right:10px;cursor:pointer;" aria-label="Search">🔍</button>
        <button class="cart-btn" onclick="navigate('cart')">
          <span class="cart-label">কার্ট</span> <span class="cart-count" id="cartCount">0</span>
        </button>
      </div>""")

# 5. Bottom nav: remove home and search, add message
html = html.replace(
    '<button class="bottom-nav-btn active" id="bnav-home" onclick="navigate(\'home\')">',
    '<!-- Removed Home --><button class="bottom-nav-btn" style="display:none;" id="bnav-home" onclick="navigate(\'home\')">'
)
html = html.replace(
    '<button class="bottom-nav-btn" id="bnav-search" onclick="openShopSearch()">',
    '<button class="bottom-nav-btn" id="bnav-msg" onclick="window.open(\'https://m.me/pureorigins\', \'_blank\')">\n      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2.5" \nstroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>\n      <span>মেসেজ</span>\n    </button>\n    <!-- Removed Search --><button class="bottom-nav-btn" style="display:none;" id="bnav-search" onclick="openShopSearch()">'
)
html = html.replace('grid-template-columns:repeat(4,1fr);', 'grid-template-columns:repeat(3,1fr);') # bottom-nav grid

# 6. Overlay Premium and discount
html = html.replace('style="top:12px;right:12px;left:auto;background:var(--red)"', 'style="top:32px;right:16px;left:auto;background:var(--red)"')

# 7. Colors
html = html.replace('--forest: #1B4332;', '--forest: #2D6A4F;')
html = html.replace('--forest-light: #2D6A4F;', '--forest-light: #40916C;')

with open('frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Done!')

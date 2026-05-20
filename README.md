# PureOrigins Fullstack (Separate Project)

This is a separate project from your previous work.

## Folder Structure

- `backend/` Node.js + Express + MongoDB API
- `frontend/` Bengali-first premium storefront UI
- `frontend/admin/` Admin dashboard page
- `legacy-bijghor-ecommerce.html` original file preserved
- `frontend/legacy-template.html` copied legacy template for reference

## Implemented Core

- JWT auth with httpOnly cookie
- Customer register/login/logout/me
- Admin-seeded login
- Product catalog in DB with Bengali + English fields and variants
- Cart persistence in DB
- Real order creation in DB
- Order status updates (admin)
- Coupon validation + admin coupon CRUD
- Review system + admin approve/reject
- Banner CRUD + homepage banner feed
- Stock decrement + inventory movement records
- Reports (sales, stock, customer)
- Upload endpoint for product images (local upload, Cloudinary-ready)
- SEO base metadata + `robots.txt` + `sitemap.xml`
- Analytics/Pixel config endpoint (`/api/config/client`)
- Abandoned cart recovery job skeleton
- SMS/Email/Payment service abstraction (with safe fallback)

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Products
- `GET /api/products`
- `GET /api/products/:slug`
- `POST /api/products/admin/products`
- `PUT /api/products/admin/products/:id`
- `DELETE /api/products/admin/products/:id`

### Orders
- `POST /api/orders`
- `GET /api/orders/me`
- `GET /api/orders/admin/orders`
- `PUT /api/orders/admin/orders/:id/status`

### Cart
- `GET /api/cart`
- `POST /api/cart/items`
- `PUT /api/cart/items/:id`
- `DELETE /api/cart/items/:id`

### Coupons
- `POST /api/coupons/validate`
- `GET /api/coupons/admin/coupons`
- `POST /api/coupons/admin/coupons`
- `PUT /api/coupons/admin/coupons/:id`
- `DELETE /api/coupons/admin/coupons/:id`

### Reviews
- `POST /api/reviews`
- `GET /api/reviews/products/:id/reviews`
- `PUT /api/reviews/admin/reviews/:id`

### Banners
- `GET /api/banners`
- `GET /api/banners/admin/banners`
- `POST /api/banners/admin/banners`
- `PUT /api/banners/admin/banners/:id`
- `DELETE /api/banners/admin/banners/:id`

### Uploads
- `POST /api/uploads/product-images`

### Reports
- `GET /api/admin/reports/sales`
- `GET /api/admin/reports/stock`
- `GET /api/admin/reports/customers`

## Environment Variables
Copy `backend/.env.example` to `backend/.env` and fill secrets.

## Local Run

1. Start MongoDB (local or Atlas URI in `.env`).
2. Backend:
   - `cd backend`
   - `npm install`
   - `npm run seed`
   - `npm run dev`
3. Frontend:
   - Serve `frontend/` using any static server (example: VSCode Live Server)
   - Open `frontend/index.html`

## Admin Login

Uses seeded admin credentials from `.env`:
- email: `ADMIN_EMAIL`
- password: `ADMIN_PASSWORD`

## Deployment Notes

- Frontend: Vercel static hosting.
- Backend: Render/Railway with environment variables.
- DB: MongoDB Atlas.
- Cloudinary: plug credentials and switch upload strategy.
- SSLCommerz/bKash/Nagad: use service layer in `backend/src/services/paymentService.js`.
- SMS: plug SSL Wireless credentials in `smsService.js`.

## Next Upgrade Targets (Phase 2/3 hardening)

- Replace upload fallback with Cloudinary signed uploads.
- Complete SSLCommerz session + callback verification.
- Add bKash/Nagad provider adapters.
- Add full admin CRUD screens for products/customers/reviews/coupons/banners.
- Add product schema JSON-LD + breadcrumb schema per product page.
- Add Facebook Pixel + GA4 events in frontend action points.
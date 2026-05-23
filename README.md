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
- Optional Google Sheets order export webhook
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
- `POST /api/orders/lookup`
- `GET /api/orders/me`
- `GET /api/orders/admin/orders`
- `POST /api/orders/admin/orders/:id/export-sheet`
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
- Google Sheets export: create a Google Apps Script web app and set its URL as `GOOGLE_SHEET_WEBHOOK_URL` in Render.
- Cloudinary: plug credentials and switch upload strategy.
- SSLCommerz/bKash/Nagad: use service layer in `backend/src/services/paymentService.js`.
- SMS: plug SSL Wireless credentials in `smsService.js`.

## Google Sheets Order Export

Use this when you want every new order to automatically appear in a Google Sheet.

1. Create or open a Google Sheet for PureOrigins orders.
2. Go to `Extensions` -> `Apps Script`.
3. Paste the code from `docs/google-sheets-webhook.gs`.
4. Click `Deploy` -> `New deployment`.
5. Choose type `Web app`.
6. Set `Execute as` to `Me`.
7. Set `Who has access` to `Anyone`.
8. Deploy and copy the Web App URL. It must end with `/exec`.
9. In Render -> PureOrigins backend -> Environment, add:
   - `GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec`
10. Save the Render environment and redeploy the backend.

If an order still does not export, open the admin dashboard Orders screen. Each order now shows a `Sheet` status and an `Export Sheet` retry button:

- `Exported` means the row was sent to Google Sheets.
- `No webhook` means `GOOGLE_SHEET_WEBHOOK_URL` is missing in Render or Render was not redeployed after saving it.
- `Failed` means Google Apps Script returned an error or timed out. Check that the deployment access is `Anyone` and the URL is the `/exec` web app URL, not the editor URL.

## Next Upgrade Targets (Phase 2/3 hardening)

- Replace upload fallback with Cloudinary signed uploads.
- Complete SSLCommerz session + callback verification.
- Add bKash/Nagad provider adapters.
- Add full admin CRUD screens for products/customers/reviews/coupons/banners.
- Add product schema JSON-LD + breadcrumb schema per product page.
- Add Facebook Pixel + GA4 events in frontend action points.

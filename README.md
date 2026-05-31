# PureOrigins Fullstack (Separate Project)

This is a separate project from your previous work.

## Folder Structure

- `backend/` Node.js + Express + MongoDB API
- `frontend/next-app/` Bengali-first premium storefront UI using the Next.js App Router
- `frontend/admin/` Admin dashboard page
- `frontend/index.html` legacy SPA storefront preserved only for reference during migration

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

### Contact
- `POST /api/contact`
- `GET /api/contact/admin/messages`
- `PUT /api/contact/admin/messages/:id`

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
   - `cd frontend/next-app`
   - `npm install`
   - `npm run dev`
   - Open `http://localhost:3000`

## Admin dashboard

Open `http://127.0.0.1:8080/admin/index.html` when using `start-all.bat` (static frontend on port 8080, API on port 5000).

The admin UI is a modular vanilla ES app under `frontend/admin/` (`main.js`, `screens/`, `ui/`). Features: dashboard, products (drawer editor), orders (filters + detail drawer + Google Sheets retry), coupons, reviews, banners, reports, customers, contact messages.

**Login:** seeded admin from `.env` — `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

**API URL (deploy):** set the backend base in `frontend/admin/index.html`:

```html
<meta name="pureorigins-api" content="https://your-api.example.com/api"/>
```

Leave empty for local dev (defaults to `http://localhost:5000/api`). Override once with `?api=https://...` (stored in `localStorage`), or set `pureorigins-api` meta for production.

**Manual QA checklist:** login/logout; non-admin rejected; each screen loads; product save + image upload; order status + sheet export; mobile nav drawer; hash routes (`#orders`) survive refresh.

## Deployment Notes

- Frontend: Vercel Next.js hosting from `frontend/next-app`.
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
9. Optional but recommended: in Apps Script, go to `Project Settings` -> `Script properties` and add:
   - `WEBHOOK_SECRET=any-long-random-secret`
   - `SPREADSHEET_ID=your-sheet-id` only if the script is not bound directly to the order Sheet.
10. In Render -> PureOrigins backend -> Environment, add:
   - `GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec`
   - `GOOGLE_SHEET_WEBHOOK_SECRET=the-same-secret` if you added `WEBHOOK_SECRET`.
11. Save the Render environment and redeploy the backend.

If an order still does not export, open the admin dashboard Orders screen. Each order now shows a `Sheet` status and an `Export Sheet` retry button:

- `Exported` means the row was sent to Google Sheets.
- `No webhook` means `GOOGLE_SHEET_WEBHOOK_URL` is missing in Render or Render was not redeployed after saving it.
- `Failed` means Google Apps Script returned an error, non-JSON HTML, or timed out. Check that the deployment access is `Anyone`, the URL is the `/exec` web app URL, and the optional secret matches exactly. The backend sends the secret in the JSON body and query string; do not add an `Authorization` header to Apps Script web app calls, because Google may reject it before your script runs.

The webhook updates an existing order row when you retry the same order, so retries are safe and will not duplicate the order.

## Next Upgrade Targets (Phase 2/3 hardening)

- Replace upload fallback with Cloudinary signed uploads.
- Complete SSLCommerz session + callback verification.
- Add bKash/Nagad provider adapters.
- Admin Phase 2: category CRUD, payment status UI, Google Sheets integration hub, Cloudinary uploads.
- Add product schema JSON-LD + breadcrumb schema per product page.
- Add Facebook Pixel + GA4 events in frontend action points.

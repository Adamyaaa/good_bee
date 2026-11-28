# Good Bee Cloud Deployment & Shared Database Guide (Free Testing Tier)

This setup ensures the **Website** (`client/`) and your **Mobile App APK** (separate repo) stay **100% data-synced** against the same cloud PostgreSQL database with zero local server required.

---

## 1. Free Cloud Stack
1. **Database (Shared Single Source of Truth):** [Neon](https://neon.tech) Free Tier PostgreSQL
   - Holds `users`, `products`, `reviews`, `orders`, `dealer_orders`, `supplier_submissions`, `site_content`, `delivery_assignments`, `delivery_status_history`, and `delivery_notifications`.
   - Schema auto-initializes and seeds non-destructively (`ON CONFLICT DO NOTHING`) when `server/src/index.js` starts (or manually via `cd server && npm run seed`).
2. **Backend API (`server/`):** [Render](https://render.com) Free Web Service (configured via [render.yaml](render.yaml))
   - Runs Express from repo root (`cd server && npm start`) so `/images_ref/*` and `/assets/*` also serve over HTTPS for mobile clients.
   - Note: Render Free spins down after ~15 min idle (~30–50s wake-up). The web client automatically retries `502`/`503`/`504` responses while waking up instead of faking local data.
3. **Web Frontend (`client/`):** [Vercel](https://vercel.com) Free Tier (configured via [client/vercel.json](client/vercel.json))

---

## 2. Deploy Backend to Render
1. Push this repo to GitHub.
2. In Render, choose **New + -> Blueprint** (or **New Web Service**) and select this repository.
3. Render reads `render.yaml` automatically. Set the required environment variable:
   - `DATABASE_URL`: your Neon PostgreSQL connection string (from `server/.env` or Neon dashboard).
4. After deploy finishes, verify:
   - `https://<your-render-service>.onrender.com/api/health` -> should show `"persistent": true` and `"database": "PostgreSQL (Connected & Synchronized)"`.

---

## 3. Deploy Website to Vercel
1. Create a Vercel project pointing to Root Directory `client`.
2. Add Environment Variable:
   - `VITE_API_URL=https://<your-render-service>.onrender.com`
3. Deploy. All storefront catalog, login, checkout, order tracking, and admin/partner portals now read/write the shared Neon PostgreSQL database.

---

## 4. Sync Your Separate APK Repo
You have two options for the mobile APK repo, both sharing the exact same database:
- **Option A (Recommended):** Point your APK's API base URL to `https://<your-render-service>.onrender.com` (and load images from `https://<your-render-service>.onrender.com/images_ref/...`). Both website and APK share the exact same API + database.
- **Option B (Separate Mobile Backend):** Give your mobile backend repo the **same `DATABASE_URL`** (Neon connection string) and read/write the same tables defined in `server/src/db/schema.sql`.

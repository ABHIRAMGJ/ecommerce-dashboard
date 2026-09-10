# StoreOps — Storefront + Admin Dashboard

A small e-commerce app with two sides:

- **Storefront** (`/`) — public, browse products, add to cart, checkout. No login.
- **Admin dashboard** (`/admin`) — password-gated. Products, orders, inventory,
  and the reporting a store team checks each morning (revenue trend, order-status
  breakdown, low stock, top movers).

Stack: **React (Vite)** · **Node.js / Express** · **MongoDB (Mongoose)**

```
ecommerce-dashboard/
├── backend/     Express API + MongoDB models
└── frontend/    React app — storefront + admin, one Vite project
```

## 1. Prerequisites

- Node.js 18+
- A MongoDB instance — either:
  - local: install MongoDB Community Server, then run `mongod`
  - or free hosted: a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (copy its connection string)

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGODB_URI` — your local or Atlas connection string
- `ADMIN_PASSWORD` — whatever password you want to gate `/admin` with (default in the example is `changeme123` — change it)

```bash
npm run seed   # populates 12 products and 60 sample orders
npm run dev    # starts the API on http://localhost:4000
```

## 3. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
npm run dev    # starts the app on http://localhost:5173
```

- Storefront: **http://localhost:5173/**
- Admin: **http://localhost:5173/admin/login** — enter the `ADMIN_PASSWORD` from your `.env`

The Vite dev server proxies `/api` to the backend on port 4000, so no extra config is needed.

## How the admin password works

There's no user accounts or sessions here — just one shared password, checked
two ways:

1. The login page posts it to `POST /api/auth/login`, which compares it to
   `ADMIN_PASSWORD` in the backend's `.env`.
2. Once you're in, the frontend stores that password in `localStorage` and
   sends it as an `x-admin-key` header on every admin request. The backend's
   `requireAdmin` middleware checks that header on every route that reads or
   writes store data (products write, all order routes except placing one,
   dashboard summary). Product browsing and checkout stay public — that's how
   the storefront works without logging in.

This is intentionally simple and fine for a personal project or an internal
tool behind its own network. It is **not** how you'd gate a real admin panel
on the public internet — for that, add real user accounts, hashed passwords,
and short-lived sessions (e.g. JWT) before deploying anywhere public.

## What's included

**Storefront**
- Home — hero, category filter chips, product grid
- Product page — quantity picker, add to cart
- Cart — adjust quantities, remove items, subtotal
- Checkout — name/email, places a real order against the API (no payment collected)
- Order confirmation

**Admin** (behind the password)
- Overview — today's revenue/orders stamp, 14-day revenue trend, order-status
  breakdown, low-stock list, top movers
- Products — searchable/filterable catalog, add/edit/remove, price & cost tracking
- Orders — filter by status, expand an order to see line items, change status inline
- Inventory — stock levels with quick +1 / +10 / −1 adjustments, inventory value at cost

## API summary

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | — | Check the admin password |
| GET | `/api/products` | public | List products (storefront + admin both use this) |
| GET | `/api/products/:id` | public | Single product |
| GET | `/api/products/categories` | public | Distinct category list |
| POST/PUT/DELETE | `/api/products` / `/api/products/:id` | **admin** | Create/edit/remove |
| PATCH | `/api/products/:id/stock` | **admin** | Adjust stock by `{ delta }` |
| POST | `/api/orders` | public | Place an order (checkout) — decrements stock |
| GET | `/api/orders`, `/api/orders/:id` | **admin** | List / view orders |
| PATCH | `/api/orders/:id/status` \| `/payment` | **admin** | Update order/payment status |
| GET | `/api/dashboard/summary` | **admin** | Reporting data |

Admin routes require an `x-admin-key` header equal to `ADMIN_PASSWORD`.

## Notes

- Placing an order resolves live product price/name/SKU and decrements stock in
  the same request — it won't let you oversell.
- `npm run seed` wipes and repopulates both collections — handy for demos, don't
  run it against real data.
- The order-confirmation page shows details from the just-placed order in memory;
  refreshing that page loses them (order lookup by id is admin-only in this build).

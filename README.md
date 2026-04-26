# QRSolutions (QRS) — Setup Guide

## Stack
- React 18 + Vite
- React Router v6 (routing)
- Supabase (database + realtime + auth)
- Deployed on Vercel

---

## 1. Supabase Setup (15 min)

1. Go to https://supabase.com → New Project
2. SQL Editor → New Query → paste `schema.sql` → Run
3. Database → Replication → enable realtime on:
   - `orders`
   - `order_items`
   - `bookings`
   - `assistance_requests`
4. Authentication → Users → Invite → add your staff email(s)
5. Settings → API → copy `Project URL` and `anon public` key

---

## 2. Local Development

```bash
# Clone / create project
npm create vite@latest qrs -- --template react
cd qrs

# Install dependencies
npm install @supabase/supabase-js react-router-dom

# Copy all src/ files from the QRS project into src/
# Copy vercel.json to root

# Set up environment
cp .env.example .env
# Edit .env — paste your Supabase URL and anon key

# Run
npm run dev
```

App runs at http://localhost:5173

---

## 3. Test Locally

| URL | What it does |
|-----|-------------|
| `/scan/komo/table-4` | Customer view — restaurant, Table 4 |
| `/scan/blade-co/chair-1` | Customer view — barbershop, Chair 1 |
| `/scan/drift/counter` | Customer view — coffee shop, Counter |
| `/staff/login` | Staff sign in |
| `/staff/dashboard` | Live order dashboard |
| `/staff/qr` | QR code generator |

---

## 4. Deploy to Vercel (5 min)

1. Push project to GitHub
2. Go to https://vercel.com → Import repository
3. Framework: Vite (auto-detected)
4. Environment Variables → add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy

`vercel.json` is already configured to handle client-side routing.

---

## 5. Add a New Business

**In `src/lib/data.js`:**

```js
// Add to BUSINESSES
"my-cafe": {
  id: "my-cafe",
  name: "MY CAFE",
  tagline: "Your tagline.",
  type: "Coffee Shop",
  mode: "order",           // "order" | "book"
  accent: "#FF6B6B",
  bg: "#0A0A0A",
  surface: "#141414",
  text_color: "#F0EDE8",
},

// Add to SERVICES
"my-cafe": [
  { id: "x1", name: "Item Name", description: "...", price: 10, category: "Category" },
],

// Add to LOCATIONS
"my-cafe": [
  { id: "l1", slug: "table-1", label: "Table 1" },
  { id: "l2", slug: "table-2", label: "Table 2" },
],
```

**In Supabase:** insert the same data into `businesses`, `services`, `locations` tables.

QR URL for the new business: `/scan/my-cafe/table-1`

---

## File Structure

```
qrs/
├── index.html
├── vite.config.js
├── vercel.json
├── .env.example
├── schema.sql
└── src/
    ├── main.jsx          # Entry + router
    ├── App.jsx           # Route definitions + auth guard
    ├── lib/
    │   ├── supabase.js   # Supabase client
    │   ├── useAuth.js    # Staff session hook
    │   ├── useOrders.js  # Orders CRUD + realtime
    │   └── data.js       # Business config + mock data
    ├── components/
    │   └── Icon.jsx      # SVG icon set
    └── pages/
        ├── ScanPage.jsx       # Customer flow (post-scan)
        ├── LoginPage.jsx      # Staff login
        ├── DashboardPage.jsx  # Staff order management
        └── QRGeneratorPage.jsx # QR code printer
```

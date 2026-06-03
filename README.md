# Marathon Run Tracker

A run tracking app for Marathon by Bungie. Log your extractions, deaths, credits, shells, and field notes.

Built with React + Vite + Supabase, hosted on Vercel.

---

## Setup

### 1. Supabase — Create the database table

1. Go to your Supabase project → **SQL Editor** → **New Query**
2. Paste the contents of `supabase-schema.sql` and click **Run**
3. You should see the `runs` table created under **Table Editor**

### 2. Add your environment variables

Copy `.env.example` to `.env`:
```
cp .env.example .env
```

Fill in your values in `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> ⚠️ `.env` is in `.gitignore` — it will NOT be committed to GitHub. You'll add these as environment variables in Vercel separately.

### 3. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## Deploy to Vercel

### Step 1 — Push to GitHub
Push this project to your GitHub repo.

### Step 2 — Import to Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Vercel will auto-detect Vite — no framework config needed

### Step 3 — Add environment variables in Vercel
In your Vercel project → **Settings** → **Environment Variables**, add:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `your-anon-key` |

### Step 4 — Deploy
Click **Deploy**. Done. Your app is live at `your-project.vercel.app`.

---

## Using the official Marathon icon

The `MarathonIcon.jsx` component uses an SVG approximation.
To replace it with the official PNG:

1. Place `Marathon_Logo_WordMark_Green_ALT.png` in the `/public` folder
2. In `src/components/Header.jsx`, replace `<MarathonIcon ... />` with:
   ```jsx
   <img src="/Marathon_Logo_WordMark_Green_ALT.png" width={40} height={40} alt="Marathon" />
   ```

---

## Future: Bungie API integration

When Bungie releases their API, the following can be automated:
- **Runner name** — pulled from Bungie account (replace the header input)
- **Credits / loot** — pulled from post-game report
- **Map and outcome** — pulled from match history

The Supabase schema is ready to add a `bungie_id` column for linking records to accounts.

---

## Project structure

```
src/
  components/
    Badge.jsx          — Outcome badge (Extracted / Died / Abandoned)
    ChartView.jsx      — Cumulative P&L chart + breakdown table
    EmptyState.jsx     — Placeholder when no run selected
    Header.jsx         — App header with logo and runner name
    MarathonIcon.jsx   — SVG icon (replace with PNG from /public)
    RunDetail.jsx      — Single run detail view
    RunForm.jsx        — New run entry form
    Sidebar.jsx        — Run list sidebar
    StatsBar.jsx       — Stats row (Net P&L, Extractions, Deaths, Rate)
  App.jsx              — Root component, Supabase data fetching
  constants.js         — Maps, outcomes, shells, team sizes
  index.css            — Global styles and CSS variables
  main.jsx             — React entry point
  supabase.js          — Supabase client
supabase-schema.sql    — Run once in Supabase SQL Editor
vercel.json            — Vercel deploy config
.env.example           — Environment variable template
```

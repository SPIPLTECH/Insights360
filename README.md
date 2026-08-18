# Insights360 — Race to Recognition Dashboard

Next.js 14 (App Router) + TypeScript + Tailwind dashboard for a **single
Google Sheet** that contains all 5 tabs of the Race-to-Recognition template:

- `Home Dashboard`, `Index-1`, `Index-2`, `Index-3`, `Index-4`

The dashboard is a **pure mirror** of that sheet — every value shown
(Points, Bonus Points, Eligible/Not Eligible, Total Points, Level, etc.) is
read directly from its cell, exactly as it appears in the sheet (including
percentage/number formatting). Nothing is recalculated in code.

---

## 1. Project structure

```
app/
  layout.tsx              root layout + bottom nav
  page.tsx                redirects to /dashboard
  dashboard/page.tsx       Home Dashboard (mirrors the "Home Dashboard" tab)
  index-1/page.tsx         Business Growth
  index-2/page.tsx         Ecosystem Participation
  index-3/page.tsx         Learning Excellence
  index-4/page.tsx         Professional Excellence
  api/sheets-data/route.ts server route that fetches everything

components/
  dashboard/               IndexPageView, ErrorState, LoadingSkeleton
  cards/                   StatCard, ProgressBar
  tables/                  SheetTable (renders any tab's exact columns)
  charts/                  DistrictChart, LevelPieChart
  filters/                 FilterBar (search + district)
  layout/                  Header, BottomNav

lib/
  googleSheets.ts          server-only Sheets API client (credentials stay server-side)
  sheetConfigs.ts          exact fixed column layout for each tab
  dataParser.ts            reads data rows using that fixed layout
  sheetView.ts             builds the exact-format table view for each tab
  calculations.ts          small per-tab stats (ALC count, % eligible) for header chips only
  dataService.ts           fetches + parses all 5 tabs, no aggregation across tabs
  useDashboardData.ts      client hook that polls /api/sheets-data every 8s
```

## 2. How the sheet is read

`lib/googleSheets.ts` exposes 5 functions, all reading the **same**
`GOOGLE_SHEET_1_ID` spreadsheet:

```ts
getHomeRaw()   // tab "Home Dashboard"
getIndex1Raw() // tab "Index-1"
getIndex2Raw() // tab "Index-2"
getIndex3Raw() // tab "Index-3"
getIndex4Raw() // tab "Index-4"
```

Every request uses `valueRenderOption=FORMATTED_VALUE`, so numbers/percents
come back exactly as displayed in the sheet (e.g. `80%`, not `0.8`).

`lib/dataService.ts` calls all five in parallel, parses each with
`parseTemplateSheet()` using the fixed column map in `sheetConfigs.ts`, and
builds a `SheetView` per tab via `sheetView.ts`. Credentials and the
spreadsheet ID are only ever read inside server code (`lib/`, `app/api/`) —
never sent to the browser.

## 3. Why the column layout is fixed, not auto-detected

The template's header rows are merged/stacked in ways that don't detect
reliably (e.g. Index-3's group cells span oddly due to a merge quirk in the
source file). `lib/sheetConfigs.ts` hard-codes each tab's exact column
index → field name → group path, taken directly from the template. If the
tab's column layout ever changes, update the matching `*_CONFIG` there.

## 4. Google Cloud / API key setup

This app reads the sheet with a **Google Sheets API key** (not a service
account), because service-account key creation may be blocked by org policy
on some GCP projects. An API key can only read a sheet that is link-shared
as `Anyone with the link → Viewer`; it cannot write.

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → create
   or select a project.
2. Enable the **Google Sheets API** (APIs & Services → Library → search
   "Google Sheets API" → Enable).
3. Create an **API key** (APIs & Services → Credentials → Create
   Credentials → API key). Optionally restrict it to the Sheets API.
4. Copy the key → `GOOGLE_SHEETS_API_KEY`.

## 5. Share the Google Sheet

Open the spreadsheet → Share → set link sharing to
**Anyone with the link → Viewer**.

Make sure tab names match exactly: `Home Dashboard`, `Index-1`, `Index-2`,
`Index-3`, `Index-4` (case-sensitive, as in your template).

## 6. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```
GOOGLE_SHEETS_API_KEY=your_api_key_here
GOOGLE_SHEET_1_ID=the_id_from_the_sheet_url
REVALIDATE_SECONDS=8
```

The Sheet ID is the long string in the URL:
`https://docs.google.com/spreadsheets/d/<THIS_PART>/edit`

## 7. Local development

```bash
npm install
npm run dev
```

Visit http://localhost:3000 — it redirects to `/dashboard`.

## 8. Deploy to Vercel

1. Push this project to a GitHub repo.
2. Import the repo in [Vercel](https://vercel.com/new).
3. In **Project Settings → Environment Variables**, add
   `GOOGLE_SHEETS_API_KEY`, `GOOGLE_SHEET_1_ID`, and optionally
   `REVALIDATE_SECONDS`.
4. Deploy. No further build configuration is needed (`next build` is used
   automatically).

No redeploy is ever required when the sheet data changes — the dashboard
polls `/api/sheets-data` every ~8 seconds (configurable via
`REVALIDATE_SECONDS`) and also exposes a manual **Refresh** button. The
`Last Updated` time shown in the header comes from the timestamp of the most
recent successful fetch. Adding new rows to any tab (including new District
rows that feed into Index-4 via the sheet's own formulas) shows up
automatically — no manual copy-paste and no code change needed.

## 9. Error handling

If the sheet is unreachable, mis-shared, has a missing tab, or the API key
is wrong, the API route returns a structured error and the UI shows an
actionable message (not a crash) with a **Try again** button. Empty sheets
render an empty-state table instead of throwing.

## 10. Extending

- Add more filters in `components/filters/FilterBar.tsx` if your data grows
  columns like Category/Organization.
- If you add a new tab or change a tab's columns, update the matching
  `*_CONFIG` in `lib/sheetConfigs.ts` — that's the only place column layout
  is defined. The app never invents or calculates values that aren't
  already a cell in the sheet.

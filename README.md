<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000?style=flat-square&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TanStack-Query_·_Table_·_Virtual-FF4154?style=flat-square" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://github.com/rramirezgit/pulse-analytics/actions/workflows/ci.yml/badge.svg" />
</p>

<h1 align="center">Pulse</h1>

<p align="center">
  <strong>Engineering analytics for open-source teams</strong><br/>
  <em>Live repository health, commit activity and issue throughput for any GitHub organization</em>
</p>

<p align="center">
  <strong><a href="https://pulse-analytics-six.vercel.app">Live Demo</a></strong>
</p>

![Pulse demo](docs/demo.gif)

---

## What it demonstrates

Pulse is a portfolio project built to showcase senior frontend patterns with real, live data:

| Feature | Pattern showcased |
|---|---|
| **Overview** | React Server Components + Suspense streaming — each widget streams independently |
| **Repositories** | TanStack Table v8: sorting, global filtering, column visibility, pinning, row selection |
| **Watchlist** | TanStack Query optimistic updates with snapshot rollback on failure (demonstrable via a failure switch) |
| **Issues & PRs** | `useInfiniteQuery` pagination + TanStack Virtual windowing + hover-prefetched detail panel |
| **Stress Test** | 100,000 rows sorted and scrolled at 60+ fps with ~40 rows in the DOM |

## Architecture decisions

- **The GitHub token never reaches the client.** Every call goes through Server Components or Route Handlers using `fetch` with `next: { revalidate: 900 }`. A public deploy serves any number of visitors with a handful of real API requests per 15-minute window — this is how the 5,000 req/h rate limit becomes a non-issue.
- **Zod at the boundary.** Every GitHub response is parsed against a schema before it enters the app; the UI works with typed domain objects, never raw JSON.
- **Server state vs client state.** TanStack Query owns everything fetched (queries, infinite queries, mutations); React state only holds UI concerns (sorting, filters, selection).
- **Honest stress testing.** No free API serves 100k paginable rows without burning rate limits, so the stress test generates a seed-deterministic dataset in the browser and labels itself as such. The interesting part — sorting and rendering 100k rows without dropping frames — is real.
- **Feature-based structure.** `src/features/{overview,repos-table,issues-explorer,watchlist,stress-test}` are self-contained; `src/shared` holds the API layer, query keys and UI primitives.

## Measured performance

- Stress test: **119 fps** while scrolling on a 120 Hz display, **39 rows in the DOM** out of 100,000
- Full client-side sort of 100k rows: **~370 ms** including re-render
- Issues list: pages of 30 load on scroll; hovering a row prefetches its detail so the panel opens instantly

## Getting started

```bash
git clone https://github.com/rramirezgit/pulse-analytics.git
cd pulse-analytics
pnpm install

cp .env.example .env.local
```

Create a [fine-grained personal access token](https://github.com/settings/personal-access-tokens/new) with **Public repositories (read-only)** access and set it in `.env.local`:

```env
GITHUB_TOKEN=github_pat_...
NEXT_PUBLIC_DEFAULT_ORG=tanstack
```

```bash
pnpm dev
```

### Commands

```bash
pnpm dev       # Development server
pnpm build     # Production build
pnpm lint      # ESLint
pnpm test      # Vitest suite (aggregates, optimistic rollback)
```

## Testing

The Vitest suite focuses on the logic that earns its tests:

- **Aggregation functions** — KPI summation, language breakdown with tail grouping
- **Optimistic mutation lifecycle** — the cache updates before the request resolves, rolls back to the `onMutate` snapshot on failure, and invalidates on settle

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · TanStack Query v5 · TanStack Table v8 · TanStack Virtual v3 · Tailwind CSS 4 · Zod · Recharts · Vitest + Testing Library

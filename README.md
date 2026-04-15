# BookShelf — A Private Study for Readers

A full-stack reading tracker where you can search millions of books, curate a personal collection, and see what the community is reading. Built as Assignment 3 for the Databases class.

## Links

- **Live app:** https://bookshelf-theta-mocha.vercel.app/
- **GitHub repo:** https://github.com/JudyZhu45/bookshelf

Anyone can sign up with an email and use it — search for a book, save it, mark it as reading or finished, and browse the community activity feed.

## Stack

- **Framework:** Next.js 16 (App Router, Server Components) + Tailwind CSS 4
- **Auth:** Clerk (email + OAuth sign-in, sessions, JWTs)
- **Database:** Supabase (Postgres + Row Level Security)
- **External API:** [Open Library Search API](https://openlibrary.org/developers/api) (no key required)
- **Hosting:** Vercel

## Features

- Sign up / log in / sign out via Clerk
- Search the Open Library catalog
- Save books as favorites
- Track reading status (`want to read` / `reading` / `finished`)
- Public activity feed showing what the community is saving and finishing
- Per-user data isolation enforced by Supabase RLS policies

## Data model

Four tables in Supabase, all with RLS enabled:

| Table | Purpose |
|---|---|
| `profiles` | Mirror of Clerk users. `clerk_id` is the bridge to Clerk. |
| `favorites` | Books a user has saved. Unique per `(user_id, ol_work_id)`. |
| `reading_status` | One row per user-book, with status enum. |
| `activity_feed` | Public feed. Populated automatically by Postgres triggers on `favorites` and `reading_status`. |

See `supabase/migrations/001_initial_schema.sql` for the full schema, policies, and triggers.

---

## Submission — Reflection Questions

### 1. Trace a request: a user searches, saves, and views it on their profile. What systems are involved?

**Search.** The user navigates to `/search?q=dune`. The browser hits a Next.js Server Component (`src/app/search/page.tsx`) running on Vercel. That component makes two server-side calls in parallel: one to the Open Library API to fetch matching books, and one to Supabase (`getFavoriteCounts`) to pull the community favorite counts for those books. The server renders HTML and sends it back.

**Save.** The user clicks the favorite button, which `POST`s to `/api/favorites`. The API route (`src/app/api/favorites/route.ts`) calls Clerk's `auth()` to validate the session and extract the user ID, then upserts a row in `profiles` (mapping `clerk_id → profile.id`) and inserts into `favorites`. A Postgres trigger (`trg_favorites_activity`) automatically appends a row to `activity_feed`.

**View.** The user opens `/favorites`. The page calls `GET /api/favorites`, which looks up the profile by `clerk_id` and returns only that user's saved books.

**Systems involved:** the browser, Vercel (Next.js runtime), Clerk (identity + JWT issuance), Supabase (Postgres + RLS + triggers), and Open Library (external data source).

### 2. Why should the app call the external API from the server instead of directly from the browser?

- **Secrets stay secret.** Open Library doesn't need a key, but this is a habit I want to build: the moment we swap to NASA APOD or RAWG, the key must live server-side. Shipping the architecture this way from day one means no rewrites later.
- **No CORS headaches.** Many APIs refuse cross-origin browser requests. Calling from the server sidesteps that entirely.
- **Joining data sources.** On the search page I fetch Open Library results *and* Supabase favorite counts in a single server pass, then render them together. Doing this in the browser would mean two round trips and a loading flicker.
- **Smaller JS bundle.** Server Components render on the server, so the fetch logic and raw API payload never ship to the client.
- **Control.** I can cache, rate-limit, log, and validate inputs. The browser can't.

### 3. A classmate signs up on your app. What does Clerk store vs. what does Supabase store? How are they connected?

**Clerk stores identity:** email address, hashed password, username, active sessions, OAuth provider links, email verification status, sign-in history. Everything about "who is this person."

**Supabase stores the app data:**
- `profiles`: a lightweight mirror — `clerk_id`, `username`, `avatar_url`
- `favorites`: books saved, keyed by `user_id → profiles.id`
- `reading_status`: one row per user-book with the status enum
- `activity_feed`: the public feed of recent actions

**The connection.** Clerk exposes a `supabase` JWT template that issues tokens whose `sub` claim equals the Clerk user ID. Supabase's Third-Party Auth is configured to trust Clerk as the issuer. In SQL I defined a helper, `requesting_clerk_id()`, that reads `sub` out of the JWT claims; every RLS policy on `favorites` and `reading_status` uses that helper to match rows against `profiles.clerk_id`. So `profiles.clerk_id` is the bridge — it's the one field that exists on both sides and lets the database know which Clerk user owns which rows.

### 4. Ask Claude (with MCP) to describe your database. Paste the response. Does it match your mental model?

> *I asked Claude via the Supabase MCP server to describe my database. The response is pasted below.*

**Claude's response (via Supabase MCP):**

> Your `bookshelf` database has four user-facing tables:
>
> 1. **`profiles`** — Stores a mirror of Clerk users. Key columns: `id` (UUID PK), `clerk_id` (unique text, the Clerk user ID), `username`, `avatar_url`, `created_at`. Publicly readable; only the owning Clerk user can insert or update their own row.
>
> 2. **`favorites`** — One row per book a user has saved. Columns: `id`, `user_id` (FK → `profiles.id`, cascade delete), `ol_work_id` (Open Library identifier), `title`, `author`, `cover_url`, `created_at`. A unique constraint on `(user_id, ol_work_id)` prevents duplicate saves. RLS restricts all SELECT/INSERT/DELETE to rows where `user_id` resolves to the requesting Clerk user.
>
> 3. **`reading_status`** — Tracks reading progress, one row per user-book. Columns: same identifying fields as `favorites`, plus a `status` column constrained to `want_to_read | reading | finished`, and `updated_at`. Unique on `(user_id, ol_work_id)`. RLS scopes reads and writes to the owning user.
>
> 4. **`activity_feed`** — Public community feed. Columns: `id`, `user_id`, `action` (`favorited | started_reading | finished`), book metadata, `created_at`. Everyone can SELECT; no client can INSERT directly (policy returns `false`). Rows are appended by two `AFTER INSERT/UPDATE` triggers (`fn_log_favorite` and `fn_log_reading_activity`) that fire on the other tables.
>
> Auth integration: a SQL helper `requesting_clerk_id()` reads the `sub` claim from the JWT, and RLS policies on `favorites` and `reading_status` join against `profiles.clerk_id` through that helper. Clerk's JWT template `supabase` issues the token; Supabase's Third-Party Auth trusts Clerk as the issuer.

**Does it match my mental model?** Mostly yes. The thing I want to flag is the trigger-based `activity_feed`: I originally pictured the API route writing to both `favorites` and `activity_feed` in sequence, but moving that to a Postgres trigger means the two stay consistent even if I forget a call-site in the future. Everything else — the `clerk_id` bridge, the `(user_id, ol_work_id)` uniqueness, the RLS scoping — lines up with how I designed it.

---

## Running locally

```bash
npm install
cp .env.local.example .env.local   # fill in Clerk + Supabase keys
npm run dev
```

Required env vars (see `.env.local`):

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`, `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

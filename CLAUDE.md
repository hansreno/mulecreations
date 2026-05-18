# Mule Creations — Claude Project Context

## What This Is
Static marketing + e-commerce site for Hans Reno's woodworking/CNC business (Reno Creations LLC) operating as Mule Creations. Built with Astro v6, hosted on Cloudflare Pages (free tier), auto-deployed from GitHub (`hansreno/mulecreations`).

## Tech Stack
- **Framework:** Astro v6.3.3 (requires Node >=22.12.0 — set `NODE_VERSION=22` in Cloudflare)
- **Hosting:** Cloudflare Pages — `wrangler.toml` uses `pages_build_output_dir = "./dist"`
- **Email:** Resend API via Cloudflare Pages Function at `functions/api/contact.js`
- **Payments:** Square payment links (no backend, direct URL links)
- **Testing:** Vitest

## Key Conventions
- Content collections use Astro v6 style: `src/content.config.ts` with `glob()` loaders (NOT `src/content/config.ts`)
- Products sorted by `sortOrder` field (Tree of Life = 1, default = 99)
- Product images: one folder per product under `public/images/products/<product-name>/`
- Main product image named `primary.jpg` (lowercase — Cloudflare is case-sensitive Linux)
- Gallery images passed as `gallery` prop array to `ProductCard.astro`

## Environment Variables (Cloudflare Pages → Settings → Variables and Secrets)
- `RESEND_API_KEY` — Resend API key (domain mulecreations.com verified in Resend)
- `CONTACT_EMAIL` — `renocreationsutah@gmail.com`

## Business Rules
- Tree of Life: $230 total, $115 deposit. Local pickup only (Herriman, UT). No shipping.
- Deposit workflow: customer submits form → Hans sends preview mockup + Square deposit link → customer pays $115 → Hans builds → balance collected at pickup
- Fixed-price items link directly to Square payment URLs
- Custom orders go through `/custom` form which POSTs to `/api/contact`

## Brand
- Tagline: "Stubborn about quality. Every single time."
- Color scheme: dark background (`#1a1a1a`), amber accent (`--color-accent`)
- Logo: `public/images/logo/hero-logo.svg` (full scene), `public/images/logo/nav-logo.png` (mule silhouette)

## Common Gotchas
- Image filenames must be lowercase to match git-tracked names (Windows git is case-insensitive, Cloudflare Linux is not)
- `wrangler.toml` must use `pages_build_output_dir` not `[assets] directory`
- Astro v6 content collections require `src/content.config.ts` at root of `src/`, not inside `src/content/`

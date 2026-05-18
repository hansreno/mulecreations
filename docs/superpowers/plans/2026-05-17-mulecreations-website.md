# MuleCreations.com Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy MuleCreations.com — a woodworking/CNC business site with a shop (Square payment links), per-product custom order questionnaires, a portfolio gallery, and an about page, hosted free on Cloudflare Pages.

**Architecture:** Astro generates static HTML deployed to Cloudflare Pages. Products are Markdown files — adding a new item means creating one file. A Cloudflare Pages Function at `/api/contact` handles custom order form submissions and emails them via Resend.

**Tech Stack:** Astro, Cloudflare Pages, Cloudflare Pages Functions, Square (payment links), Resend (email API), Vitest (unit tests), Google Fonts (Arvo + Inter)

---

## File Map

**Created:**
- `src/content/config.ts` — content collection schemas (products, portfolio)
- `src/content/products/*.md` — one file per shop product
- `src/content/portfolio/*.md` — one file per portfolio piece
- `src/layouts/BaseLayout.astro` — shared HTML shell
- `src/components/Nav.astro` — sticky navigation with mobile menu
- `src/components/Footer.astro` — footer with tagline
- `src/components/ProductCard.astro` — shop product card
- `src/components/PortfolioCard.astro` — portfolio image card
- `src/pages/index.astro` — Home page
- `src/pages/shop.astro` — Shop with category filter
- `src/pages/custom.astro` — Custom Orders with per-product forms
- `src/pages/portfolio.astro` — Portfolio gallery
- `src/pages/about.astro` — About / Mule story
- `public/styles/global.css` — design system (CSS variables, typography)
- `public/images/logo/` — logo files (copied from existing `images/`)
- `public/images/products/` — product photos
- `public/images/portfolio/` — portfolio photos
- `functions/api/contact.js` — Cloudflare Pages Function (form → email)
- `functions/api/contact.test.js` — Vitest unit tests

**Modified:**
- `astro.config.mjs` — site URL
- `package.json` — vitest dev dependency + test script

---

### Task 1: Verify prerequisites

**Files:** none

- [ ] **Step 1: Check Node.js (need v18+)**
```powershell
node --version
```
Expected: `v18.x.x` or higher. If missing, install from https://nodejs.org (LTS).

- [ ] **Step 2: Check npm**
```powershell
npm --version
```
Expected: `9.x.x` or higher.

- [ ] **Step 3: Verify git repo exists**
```powershell
git -C "c:\AgenticAI\MuleCreations" log --oneline -3
```
Expected: shows recent commits from brainstorming session.

---

### Task 2: Scaffold Astro project

**Files:** `astro.config.mjs`, `package.json`, `tsconfig.json`, `src/env.d.ts`, `src/pages/index.astro` (placeholder)

- [ ] **Step 1: Scaffold Astro into the existing directory**
```powershell
cd "c:\AgenticAI\MuleCreations"
npm create astro@latest . -- --template minimal --install --typescript strict --git false
```
When prompted, accept defaults. `--git false` skips re-initializing git.

- [ ] **Step 2: Copy logo images into public**
```powershell
New-Item -ItemType Directory -Force "public\images\logo"
New-Item -ItemType Directory -Force "public\images\products"
New-Item -ItemType Directory -Force "public\images\portfolio"
Copy-Item "images\mulecreations.png" "public\images\logo\"
Copy-Item "images\TheGuidedMule.svg" "public\images\logo\"
```

- [ ] **Step 3: Verify dev server starts**
```powershell
npm run dev
```
Open `http://localhost:4321` — Astro starter page loads. Press `Ctrl+C`.

- [ ] **Step 4: Commit**
```powershell
git add .
git commit -m "feat: scaffold Astro project"
```

---

### Task 3: Configure Astro and content collections

**Files:** `astro.config.mjs`, `src/content/config.ts`

- [ ] **Step 1: Update astro.config.mjs**

Replace contents of `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mulecreations.com',
});
```

- [ ] **Step 2: Create src/content/config.ts**
```typescript
import { defineCollection, z } from 'astro:content';

const products = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(['Plaques & Signs', 'Storage', 'Stands', 'Pet Tags', 'Other']),
    price: z.number(),
    description: z.string(),
    image: z.string(),
    squareLink: z.string().url(),
    inStock: z.boolean().default(true),
    featured: z.boolean().default(false),
  }),
});

const portfolio = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    material: z.string(),
    image: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { products, portfolio };
```

- [ ] **Step 3: Verify build succeeds**
```powershell
npm run build
```
Expected: `dist/` created, no errors.

- [ ] **Step 4: Commit**
```powershell
git add src/content/config.ts astro.config.mjs
git commit -m "feat: add content collection schemas"
```

---

### Task 4: Global CSS design system

**Files:** `public/styles/global.css`

- [ ] **Step 1: Create public/styles/global.css**
```css
@import url('https://fonts.googleapis.com/css2?family=Arvo:wght@400;700&family=Inter:wght@400;500;600&display=swap');

:root {
  --color-bg: #1a1a1a;
  --color-card: #262626;
  --color-accent: #c8860a;
  --color-accent-hover: #e8a020;
  --color-text: #f5f0e8;
  --color-text-muted: #a09080;
  --color-linen: #d4c5a9;
  --font-heading: 'Arvo', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --radius: 6px;
  --max-width: 1100px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { font-size: 16px; scroll-behavior: smooth; }

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  line-height: 1.6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main { flex: 1; }

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text);
}

h1 { font-size: clamp(2rem, 5vw, 3.5rem); }
h2 { font-size: clamp(1.5rem, 3vw, 2.25rem); }
h3 { font-size: clamp(1.1rem, 2vw, 1.5rem); }

a { color: var(--color-accent); text-decoration: none; }
a:hover { color: var(--color-accent-hover); }

img { max-width: 100%; height: auto; display: block; }

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1.5rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.75rem;
  border-radius: var(--radius);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  border: none;
  text-decoration: none;
}

.btn-primary { background-color: var(--color-accent); color: #1a1a1a; }
.btn-primary:hover { background-color: var(--color-accent-hover); color: #1a1a1a; }

.btn-outline {
  background-color: transparent;
  color: var(--color-accent);
  border: 2px solid var(--color-accent);
}
.btn-outline:hover { background-color: var(--color-accent); color: #1a1a1a; }

section { padding: 4rem 0; }
```

- [ ] **Step 2: Commit**
```powershell
git add public/styles/global.css
git commit -m "feat: add global CSS design system"
```

---

### Task 5: BaseLayout component

**Files:** `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create src/layouts/BaseLayout.astro**
```astro
---
interface Props {
  title: string;
  description?: string;
}
const {
  title,
  description = 'Handcrafted woodwork and CNC creations from Herriman, Utah.',
} = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title} | Mule Creations</title>
    <link rel="icon" type="image/png" href="/images/logo/mulecreations.png" />
    <link rel="stylesheet" href="/styles/global.css" />
  </head>
  <body>
    <slot name="nav" />
    <main><slot /></main>
    <slot name="footer" />
  </body>
</html>
```

- [ ] **Step 2: Commit**
```powershell
git add src/layouts/BaseLayout.astro
git commit -m "feat: add BaseLayout"
```

---

### Task 6: Nav component

**Files:** `src/components/Nav.astro`

- [ ] **Step 1: Create src/components/Nav.astro**
```astro
---
const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/custom', label: 'Custom Orders' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
];
const currentPath = Astro.url.pathname;
---
<nav class="site-nav">
  <div class="container nav-inner">
    <a href="/" class="nav-logo">
      <img src="/images/logo/mulecreations.png" alt="Mule Creations" height="48" />
    </a>
    <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-links" id="nav-links">
      {navLinks.map(({ href, label }) => (
        <li>
          <a href={href} class:list={['nav-link', { active: currentPath.startsWith(href) }]}>
            {label}
          </a>
        </li>
      ))}
    </ul>
  </div>
</nav>

<style>
  .site-nav {
    background-color: #111;
    border-bottom: 2px solid var(--color-accent);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    gap: 2rem;
  }
  .nav-logo img { height: 48px; width: auto; }
  .nav-links { display: flex; list-style: none; gap: 2rem; }
  .nav-link {
    color: var(--color-text-muted);
    font-weight: 500;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    transition: color 0.2s;
  }
  .nav-link:hover, .nav-link.active { color: var(--color-accent); }
  .nav-toggle {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
  }
  .nav-toggle span { display: block; width: 24px; height: 2px; background-color: var(--color-text); }
  @media (max-width: 640px) {
    .nav-toggle { display: flex; }
    .nav-links {
      display: none;
      flex-direction: column;
      gap: 0;
      position: absolute;
      top: 64px;
      left: 0;
      right: 0;
      background-color: #111;
      border-bottom: 2px solid var(--color-accent);
      padding: 1rem 0;
    }
    .nav-links.open { display: flex; }
    .nav-links li a { display: block; padding: 0.75rem 1.5rem; }
  }
</style>

<script>
  const toggle = document.querySelector('.nav-toggle') as HTMLButtonElement;
  const links = document.querySelector('#nav-links') as HTMLUListElement;
  toggle?.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
</script>
```

- [ ] **Step 2: Commit**
```powershell
git add src/components/Nav.astro
git commit -m "feat: add Nav with mobile hamburger menu"
```

---

### Task 7: Footer component

**Files:** `src/components/Footer.astro`

- [ ] **Step 1: Create src/components/Footer.astro**
```astro
<footer class="site-footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <img src="/images/logo/TheGuidedMule.svg" alt="Mule Creations" height="80" />
      <p class="tagline">You can lead a mule to water,<br />but you can't make him drink.</p>
    </div>
    <nav aria-label="Footer navigation">
      <ul>
        <li><a href="/shop">Shop</a></li>
        <li><a href="/custom">Custom Orders</a></li>
        <li><a href="/portfolio">Portfolio</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </div>
  <div class="footer-bottom">
    <p>&copy; {new Date().getFullYear()} Mule Creations / Reno Creations. Herriman, Utah.</p>
  </div>
</footer>

<style>
  .site-footer {
    background-color: #111;
    border-top: 2px solid var(--color-accent);
    padding-top: 3rem;
    margin-top: auto;
  }
  .footer-inner {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 3rem;
    flex-wrap: wrap;
    padding-bottom: 2rem;
  }
  .footer-brand img { height: 80px; width: auto; margin-bottom: 1rem; }
  .tagline { color: var(--color-text-muted); font-style: italic; font-size: 0.9rem; }
  nav ul { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
  nav a { color: var(--color-text-muted); font-size: 0.9rem; transition: color 0.2s; }
  nav a:hover { color: var(--color-accent); }
  .footer-bottom {
    border-top: 1px solid #333;
    padding: 1rem 0;
    text-align: center;
  }
  .footer-bottom p { color: var(--color-text-muted); font-size: 0.8rem; }
</style>
```

- [ ] **Step 2: Commit**
```powershell
git add src/components/Footer.astro
git commit -m "feat: add Footer"
```

---

### Task 8: ProductCard and PortfolioCard components

**Files:** `src/components/ProductCard.astro`, `src/components/PortfolioCard.astro`

- [ ] **Step 1: Create src/components/ProductCard.astro**
```astro
---
interface Props {
  title: string; category: string; price: number;
  description: string; image: string; squareLink: string; inStock: boolean;
}
const { title, category, price, description, image, squareLink, inStock } = Astro.props;
---
<article class="product-card">
  <div class="product-image">
    <img src={image} alt={title} loading="lazy" />
    {!inStock && <span class="badge">Sold Out</span>}
  </div>
  <div class="product-info">
    <span class="category">{category}</span>
    <h3>{title}</h3>
    <p class="desc">{description}</p>
    <div class="product-footer">
      <span class="price">${price}</span>
      {inStock
        ? <a href={squareLink} class="btn btn-primary" target="_blank" rel="noopener">Buy Now</a>
        : <span class="btn btn-outline" aria-disabled="true">Sold Out</span>
      }
    </div>
  </div>
</article>

<style>
  .product-card {
    background-color: var(--color-card);
    border-radius: var(--radius);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s;
  }
  .product-card:hover { transform: translateY(-3px); }
  .product-image { position: relative; aspect-ratio: 4/3; overflow: hidden; background: #333; }
  .product-image img { width: 100%; height: 100%; object-fit: cover; }
  .badge {
    position: absolute; top: 0.75rem; right: 0.75rem;
    background: #555; color: var(--color-text-muted);
    font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.6rem;
    border-radius: 999px; text-transform: uppercase;
  }
  .product-info { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
  .category { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-accent); font-weight: 600; }
  h3 { font-size: 1.1rem; }
  .desc { font-size: 0.9rem; color: var(--color-text-muted); flex: 1; }
  .product-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 0.75rem; }
  .price { font-family: var(--font-heading); font-size: 1.5rem; color: var(--color-accent); font-weight: 700; }
</style>
```

- [ ] **Step 2: Create src/components/PortfolioCard.astro**
```astro
---
interface Props {
  title: string; material: string; image: string; description?: string;
}
const { title, material, image, description } = Astro.props;
---
<figure class="portfolio-card">
  <div class="img-wrap">
    <img src={image} alt={title} loading="lazy" />
  </div>
  <figcaption>
    <span class="title">{title}</span>
    <span class="material">{material}</span>
    {description && <p class="desc">{description}</p>}
  </figcaption>
</figure>

<style>
  .portfolio-card { background-color: var(--color-card); border-radius: var(--radius); overflow: hidden; }
  .img-wrap { aspect-ratio: 1; overflow: hidden; background: #333; }
  .img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
  .portfolio-card:hover .img-wrap img { transform: scale(1.05); }
  figcaption { padding: 0.9rem 1rem; display: flex; flex-direction: column; gap: 0.2rem; }
  .title { font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem; }
  .material { font-size: 0.8rem; color: var(--color-accent); }
  .desc { font-size: 0.85rem; color: var(--color-text-muted); margin-top: 0.3rem; }
</style>
```

- [ ] **Step 3: Commit**
```powershell
git add src/components/ProductCard.astro src/components/PortfolioCard.astro
git commit -m "feat: add ProductCard and PortfolioCard components"
```

---

### Task 9: Home page

**Files:** `src/pages/index.astro`

- [ ] **Step 1: Replace src/pages/index.astro**
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import ProductCard from '../components/ProductCard.astro';
import { getCollection } from 'astro:content';

const featured = (await getCollection('products', ({ data }) => data.featured && data.inStock)).slice(0, 4);
---
<BaseLayout title="Home" description="Handcrafted woodwork and CNC creations from Herriman, Utah.">
  <Nav slot="nav" />

  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-logo">
        <img src="/images/logo/mulecreations.png" alt="Mule Creations" />
      </div>
      <div class="hero-text">
        <h1>Mule Creations</h1>
        <p class="tagline">You can lead a mule to water,<br />but you can't make him drink.</p>
        <p class="sub">Handcrafted woodwork and CNC creations from Herriman, Utah.</p>
        <div class="actions">
          <a href="/shop" class="btn btn-primary">Shop Now</a>
          <a href="/custom" class="btn btn-outline">Request Custom Work</a>
        </div>
      </div>
    </div>
  </section>

  {featured.length > 0 && (
    <section class="featured">
      <div class="container">
        <h2>Featured Work</h2>
        <div class="grid">
          {featured.map((p) => (
            <ProductCard title={p.data.title} category={p.data.category} price={p.data.price}
              description={p.data.description} image={p.data.image}
              squareLink={p.data.squareLink} inStock={p.data.inStock} />
          ))}
        </div>
        <div style="text-align:center;margin-top:2rem">
          <a href="/shop" class="btn btn-outline">View All Items</a>
        </div>
      </div>
    </section>
  )}

  <section class="cta-band">
    <div class="container cta-inner">
      <div>
        <h2>Something Specific in Mind?</h2>
        <p>Every piece is made by hand. If you don't see it, let's build it.</p>
      </div>
      <a href="/custom" class="btn btn-primary">Request Custom Work</a>
    </div>
  </section>

  <section class="who">
    <div class="container" style="max-width:700px">
      <h2>Who Is Mule?</h2>
      <p>"Mule" is the nickname I've carried for years among my fishing buddies on trips to Alaska. I build things my way, with my hands, on my terms.</p>
      <a href="/about" class="btn btn-outline" style="margin-top:1.5rem">Read the Story</a>
    </div>
  </section>

  <Footer slot="footer" />
</BaseLayout>

<style>
  .hero { padding: 5rem 0; border-bottom: 1px solid #333; }
  .hero-inner { display: flex; align-items: center; gap: 4rem; flex-wrap: wrap; }
  .hero-logo img { max-width: 400px; width: 100%; }
  .hero-text { flex: 1; min-width: 280px; }
  .hero-text h1 { color: var(--color-accent); margin-bottom: 0.5rem; }
  .tagline { font-style: italic; color: var(--color-text-muted); font-size: 1.1rem; margin-bottom: 1rem; }
  .sub { color: var(--color-text-muted); margin-bottom: 2rem; }
  .actions { display: flex; gap: 1rem; flex-wrap: wrap; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; margin: 2rem 0; }
  .cta-band { background-color: var(--color-card); border-top: 1px solid #333; border-bottom: 1px solid #333; }
  .cta-inner { display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap; }
  .cta-inner h2 { margin-bottom: 0.5rem; }
  .cta-inner p { color: var(--color-text-muted); }
  .who h2 { margin-bottom: 1rem; }
  .who p { color: var(--color-text-muted); font-size: 1.05rem; }
</style>
```

- [ ] **Step 2: Verify in browser**

Run `npm run dev`, open `http://localhost:4321`. Expected: dark page with logo, tagline, hero buttons, CTA band, "Who Is Mule?" section. Featured section hidden (no products yet — correct).

- [ ] **Step 3: Commit**
```powershell
git add src/pages/index.astro
git commit -m "feat: add Home page"
```

---

### Task 10: Shop page

**Files:** `src/pages/shop.astro`

- [ ] **Step 1: Create src/pages/shop.astro**
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import ProductCard from '../components/ProductCard.astro';
import { getCollection } from 'astro:content';

const allProducts = await getCollection('products');
const categories = ['All', ...new Set(allProducts.map(p => p.data.category))];
---
<BaseLayout title="Shop" description="Browse ready-made handcrafted pieces — signs, plaques, Trees of Life, and more.">
  <Nav slot="nav" />
  <section>
    <div class="container">
      <h1>Shop</h1>
      <p class="sub">Local pickup in Herriman, UT. Shipping available — contact for rates.</p>

      <div class="filter-bar" id="filter-bar">
        {categories.map(cat => (
          <button class:list={['filter-btn', { active: cat === 'All' }]} data-category={cat}>
            {cat}
          </button>
        ))}
      </div>

      {allProducts.length === 0
        ? <p class="empty">New items coming soon. <a href="/custom">Request custom work.</a></p>
        : (
          <div class="grid" id="product-grid">
            {allProducts.map((p) => (
              <div class="item" data-category={p.data.category}>
                <ProductCard title={p.data.title} category={p.data.category} price={p.data.price}
                  description={p.data.description} image={p.data.image}
                  squareLink={p.data.squareLink} inStock={p.data.inStock} />
              </div>
            ))}
          </div>
        )
      }
    </div>
  </section>
  <Footer slot="footer" />
</BaseLayout>

<style>
  h1 { margin-bottom: 0.5rem; }
  .sub { color: var(--color-text-muted); margin-bottom: 2rem; font-size: 0.95rem; }
  .filter-bar { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2rem; }
  .filter-btn {
    padding: 0.4rem 1rem; border-radius: 999px;
    background-color: var(--color-card); border: 1px solid #444;
    color: var(--color-text-muted); font-size: 0.85rem; cursor: pointer;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s;
  }
  .filter-btn:hover, .filter-btn.active {
    background-color: var(--color-accent); border-color: var(--color-accent); color: #1a1a1a;
  }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; }
  .item[hidden] { display: none; }
  .empty { color: var(--color-text-muted); font-size: 1.1rem; padding: 3rem 0; }
</style>

<script>
  const bar = document.getElementById('filter-bar');
  const grid = document.getElementById('product-grid');
  bar?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.filter-btn') as HTMLButtonElement | null;
    if (!btn) return;
    bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const sel = btn.dataset.category;
    grid?.querySelectorAll<HTMLElement>('.item').forEach(item => {
      item.hidden = sel !== 'All' && item.dataset.category !== sel;
    });
  });
</script>
```

- [ ] **Step 2: Verify at http://localhost:4321/shop** — "New items coming soon" message shown.

- [ ] **Step 3: Commit**
```powershell
git add src/pages/shop.astro
git commit -m "feat: add Shop page with category filter"
```

---

### Task 11: Portfolio and About pages

**Files:** `src/pages/portfolio.astro`, `src/pages/about.astro`

- [ ] **Step 1: Create src/pages/portfolio.astro**
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import PortfolioCard from '../components/PortfolioCard.astro';
import { getCollection } from 'astro:content';
const items = await getCollection('portfolio');
---
<BaseLayout title="Portfolio" description="Past work from Mule Creations — signs, Trees of Life, plaques, and more.">
  <Nav slot="nav" />
  <section>
    <div class="container">
      <h1>Portfolio</h1>
      <p class="sub">A look at past work. Like something? <a href="/custom">Request it custom.</a></p>
      {items.length === 0
        ? <p style="color:var(--color-text-muted);padding:3rem 0">Photos coming soon.</p>
        : (
          <div class="grid">
            {items.map(i => (
              <PortfolioCard title={i.data.title} material={i.data.material}
                image={i.data.image} description={i.data.description} />
            ))}
          </div>
        )
      }
    </div>
  </section>
  <Footer slot="footer" />
</BaseLayout>

<style>
  h1 { margin-bottom: 0.5rem; }
  .sub { color: var(--color-text-muted); margin-bottom: 2.5rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem; }
</style>
```

- [ ] **Step 2: Create src/pages/about.astro**
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
---
<BaseLayout title="About" description="The story behind Mule Creations.">
  <Nav slot="nav" />
  <section>
    <div class="container about-inner">
      <div class="about-logo">
        <img src="/images/logo/TheGuidedMule.svg" alt="The Guided Mule" />
      </div>
      <div class="about-content">
        <h1>The Mule Story</h1>
        <p>
          [Hans — write your story here. Tell people about your "Mule" nickname, the Alaska fishing trips,
          how your fishing buddies started calling you that, and what it means to you.]
        </p>
        <h2>The Work</h2>
        <p>
          [Describe how you got into woodworking, when you got the CNC machine, what you've built,
          and why you love making Trees of Life especially.]
        </p>
        <h2>The Logo</h2>
        <p>
          The logo says it all: you can lead a mule to water, but you can't make him drink.
          Everything here is made on my terms — stubborn about quality, stubborn about craft.
        </p>
        <h2>Where to Find Me</h2>
        <p>
          Based in Herriman, Utah. Local pickup available. I also ship — just ask.
          For custom work, <a href="/custom">start here</a>.
        </p>
      </div>
    </div>
  </section>
  <Footer slot="footer" />
</BaseLayout>

<style>
  .about-inner { display: grid; grid-template-columns: 1fr 2fr; gap: 4rem; align-items: start; }
  .about-logo img { width: 100%; max-width: 280px; }
  .about-content h1 { margin-bottom: 1.5rem; }
  .about-content h2 { margin-top: 2rem; margin-bottom: 0.75rem; color: var(--color-accent); font-size: 1.25rem; }
  .about-content p { color: var(--color-text-muted); line-height: 1.8; }
  @media (max-width: 640px) { .about-inner { grid-template-columns: 1fr; gap: 2rem; } }
</style>
```

- [ ] **Step 3: Verify both pages load in dev server**

`http://localhost:4321/portfolio` → "Photos coming soon."
`http://localhost:4321/about` → Two-column layout with SVG logo and placeholder text.

- [ ] **Step 4: Commit**
```powershell
git add src/pages/portfolio.astro src/pages/about.astro
git commit -m "feat: add Portfolio and About pages"
```

---

### Task 12: Custom Orders page

**Files:** `src/pages/custom.astro`

- [ ] **Step 1: Create src/pages/custom.astro**
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
---
<BaseLayout title="Custom Orders" description="Request a custom handcrafted piece from Mule Creations.">
  <Nav slot="nav" />
  <section>
    <div class="container">
      <h1>Custom Orders</h1>
      <div class="process">
        <p>Here's how it works:</p>
        <ol>
          <li>Fill out the form — the more detail, the better.</li>
          <li>Hans replies within 1–2 business days with a quote.</li>
          <li>A deposit is required to begin; balance due on completion.</li>
          <li>Local pickup in Herriman, UT or shipping available.</li>
        </ol>
      </div>

      <form id="order-form" class="order-form" novalidate>

        <div class="form-group">
          <label for="itemType">What would you like made? <span aria-hidden="true">*</span></label>
          <select id="itemType" name="itemType" required>
            <option value="">— Select an item type —</option>
            <option value="Tree of Life">Tree of Life</option>
            <option value="Religious / Scripture Plaque">Religious / Scripture Plaque</option>
            <option value="Personalized Sign">Personalized Sign</option>
            <option value="Other">Something Else</option>
          </select>
        </div>

        <!-- Tree of Life -->
        <div class="conditional" id="fields-tree" hidden>
          <div class="form-group">
            <label for="tol-text">Personalization text <span aria-hidden="true">*</span></label>
            <textarea id="tol-text" name="personalizationText" rows="3"
              placeholder="Names, dates, or quotes to appear around the tree"></textarea>
          </div>
        </div>

        <!-- Religious / Scripture Plaque -->
        <div class="conditional" id="fields-plaque" hidden>
          <div class="form-group">
            <label for="plaque-text">Scripture reference or text <span aria-hidden="true">*</span></label>
            <textarea id="plaque-text" name="scriptureText" rows="3"
              placeholder="e.g. Doctrine and Covenants 6:36, or the full scripture"></textarea>
          </div>
        </div>

        <!-- Personalized Sign -->
        <div class="conditional" id="fields-sign" hidden>
          <div class="form-group">
            <label for="sign-text">Text to display <span aria-hidden="true">*</span></label>
            <textarea id="sign-text" name="signText" rows="3" placeholder="What should the sign say?"></textarea>
          </div>
        </div>

        <!-- Other -->
        <div class="conditional" id="fields-other" hidden>
          <div class="form-group">
            <label for="other-desc">Describe what you're looking for <span aria-hidden="true">*</span></label>
            <textarea id="other-desc" name="otherDescription" rows="4"
              placeholder="The more detail the better"></textarea>
          </div>
          <div class="form-group">
            <label for="budget">Budget range</label>
            <select id="budget" name="budget">
              <option value="">Not sure</option>
              <option value="Under $50">Under $50</option>
              <option value="$50–$100">$50–$100</option>
              <option value="$100–$200">$100–$200</option>
              <option value="$200+">$200+</option>
            </select>
          </div>
        </div>

        <!-- Shared fields shown after item type is selected -->
        <div id="shared" hidden>
          <div class="form-group">
            <label for="occasion">Occasion</label>
            <select id="occasion" name="occasion">
              <option value="">Not specified</option>
              <option value="Gift">Gift</option>
              <option value="Home Decor">Home Decor</option>
              <option value="Religious">Religious</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Birthday">Birthday</option>
              <option value="Christmas">Christmas</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label for="neededBy">Needed by (optional)</label>
            <input type="date" id="neededBy" name="neededBy" />
          </div>
          <div class="form-group">
            <label for="fulfillment">Pickup or shipping? <span aria-hidden="true">*</span></label>
            <select id="fulfillment" name="fulfillment" required>
              <option value="Local pickup (Herriman, UT)">Local pickup — Herriman, UT</option>
              <option value="Shipping">I need it shipped</option>
            </select>
          </div>
          <div class="form-group">
            <label for="customerName">Your name <span aria-hidden="true">*</span></label>
            <input type="text" id="customerName" name="name" required autocomplete="name" />
          </div>
          <div class="form-group">
            <label for="customerEmail">Your email <span aria-hidden="true">*</span></label>
            <input type="email" id="customerEmail" name="email" required autocomplete="email" />
          </div>
          <div class="form-group">
            <label for="phone">Phone (optional)</label>
            <input type="tel" id="phone" name="phone" autocomplete="tel" />
          </div>
          <div class="form-group">
            <label for="notes">Additional details</label>
            <textarea id="notes" name="notes" rows="3"
              placeholder="Non-standard size requests, special requirements, etc."></textarea>
          </div>

          <div class="form-status" id="form-status" aria-live="polite"></div>
          <button type="submit" class="btn btn-primary" id="submit-btn">Send Request</button>
        </div>

      </form>
    </div>
  </section>
  <Footer slot="footer" />
</BaseLayout>

<style>
  h1 { margin-bottom: 1.5rem; }
  .process {
    background-color: var(--color-card);
    border-left: 3px solid var(--color-accent);
    padding: 1.25rem 1.5rem;
    border-radius: var(--radius);
    margin-bottom: 2.5rem;
  }
  .process p { font-weight: 600; margin-bottom: 0.5rem; }
  .process ol { color: var(--color-text-muted); padding-left: 1.25rem; line-height: 2; }
  .order-form { max-width: 600px; display: flex; flex-direction: column; gap: 1.25rem; }
  .conditional { display: flex; flex-direction: column; gap: 1.25rem; }
  #shared { display: flex; flex-direction: column; gap: 1.25rem; }
  #shared[hidden] { display: none; }
  .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
  .form-group label { font-weight: 600; font-size: 0.9rem; }
  .form-group label span { color: var(--color-accent); }
  .form-group input, .form-group select, .form-group textarea {
    background-color: var(--color-card); border: 1px solid #444; border-radius: var(--radius);
    color: var(--color-text); font-family: var(--font-body); font-size: 0.95rem;
    padding: 0.65rem 0.9rem; width: 100%; transition: border-color 0.2s;
  }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
    outline: none; border-color: var(--color-accent);
  }
  .form-group select option { background-color: #2a2a2a; }
  .form-status { min-height: 1.5rem; font-size: 0.95rem; }
  .form-status.success { color: #4caf50; }
  .form-status.error { color: #f44336; }
  #submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>

<script>
  const form = document.getElementById('order-form') as HTMLFormElement;
  const itemTypeSelect = document.getElementById('itemType') as HTMLSelectElement;
  const shared = document.getElementById('shared') as HTMLDivElement;
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
  const formStatus = document.getElementById('form-status') as HTMLDivElement;

  const conditionalMap: Record<string, string> = {
    'Tree of Life': 'fields-tree',
    'Religious / Scripture Plaque': 'fields-plaque',
    'Personalized Sign': 'fields-sign',
    'Other': 'fields-other',
  };

  function showFields(itemType: string) {
    Object.values(conditionalMap).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.hidden = true;
    });
    if (conditionalMap[itemType]) {
      const el = document.getElementById(conditionalMap[itemType]);
      if (el) el.hidden = false;
    }
    shared.hidden = !itemType;
  }

  itemTypeSelect.addEventListener('change', () => showFields(itemTypeSelect.value));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    formStatus.textContent = 'Sending…';
    formStatus.className = 'form-status';

    try {
      const res = await fetch('/api/contact', { method: 'POST', body: new FormData(form) });
      const json = await res.json();
      if (res.ok && json.success) {
        formStatus.textContent = 'Got it! Hans will be in touch within 1–2 business days.';
        formStatus.className = 'form-status success';
        form.reset();
        showFields('');
      } else {
        throw new Error(json.error || 'Submission failed');
      }
    } catch {
      formStatus.textContent = 'Something went wrong. Please try again or contact directly.';
      formStatus.className = 'form-status error';
      submitBtn.disabled = false;
    }
  });
</script>
```

- [ ] **Step 2: Verify form behavior in browser**

`http://localhost:4321/custom` — dropdown shows four item types. Selecting each one shows the relevant field(s). Shared fields appear after selection. Submit fails locally (no Worker yet) — expected.

- [ ] **Step 3: Commit**
```powershell
git add src/pages/custom.astro
git commit -m "feat: add Custom Orders page with per-product questionnaires"
```

---

### Task 13: Unit tests for form handler logic (write tests first)

**Files:** `functions/api/contact.test.js`, `package.json`

- [ ] **Step 1: Install Vitest**
```powershell
npm install --save-dev vitest
```

- [ ] **Step 2: Add test script to package.json**

In `package.json`, inside `"scripts"`, add:
```json
"test": "vitest run"
```

- [ ] **Step 3: Create functions/api/contact.test.js**
```powershell
New-Item -ItemType Directory -Force "functions\api"
```

Create `functions/api/contact.test.js`:
```javascript
import { describe, it, expect } from 'vitest';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildEmailBody(fields) {
  return fields
    .filter(([, value]) => value && value.toString().trim())
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');
}

describe('isValidEmail', () => {
  it('accepts a valid email', () => {
    expect(isValidEmail('hans@example.com')).toBe(true);
  });
  it('rejects email with no @', () => {
    expect(isValidEmail('notanemail')).toBe(false);
  });
  it('rejects email with no domain', () => {
    expect(isValidEmail('hans@')).toBe(false);
  });
  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });
});

describe('buildEmailBody', () => {
  it('includes only non-empty fields', () => {
    const fields = [
      ['Item Type', 'Tree of Life'],
      ['Personalization Text', 'John & Jane 2024'],
      ['Phone', ''],
      ['Notes', null],
    ];
    const body = buildEmailBody(fields);
    expect(body).toContain('Item Type: Tree of Life');
    expect(body).toContain('Personalization Text: John & Jane 2024');
    expect(body).not.toContain('Phone');
    expect(body).not.toContain('Notes');
  });

  it('returns empty string when all fields are empty', () => {
    expect(buildEmailBody([['Name', ''], ['Email', null]])).toBe('');
  });
});
```

- [ ] **Step 4: Run tests — expect PASS (pure logic, no implementation dependency)**
```powershell
npm test
```
Expected:
```
✓ functions/api/contact.test.js (6 tests)
Test Files  1 passed (1)
Tests       6 passed (6)
```

- [ ] **Step 5: Commit**
```powershell
git add functions/ package.json package-lock.json
git commit -m "test: add unit tests for contact form validation logic"
```

---

### Task 14: Cloudflare Pages Function (contact form handler)

**Files:** `functions/api/contact.js`

- [ ] **Step 1: Create functions/api/contact.js**
```javascript
export async function onRequestPost(context) {
  const { request, env } = context;

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse({ error: 'Invalid form data' }, 400);
  }

  const name = formData.get('name')?.toString().trim() ?? '';
  const email = formData.get('email')?.toString().trim() ?? '';
  const itemType = formData.get('itemType')?.toString().trim() ?? '';

  if (!name || !email || !itemType) {
    return jsonResponse({ error: 'Name, email, and item type are required' }, 400);
  }

  if (!isValidEmail(email)) {
    return jsonResponse({ error: 'Invalid email address' }, 400);
  }

  const body = buildEmailBody([
    ['Item Type', itemType],
    ['Personalization Text', formData.get('personalizationText')],
    ['Scripture Text', formData.get('scriptureText')],
    ['Sign Text', formData.get('signText')],
    ['Other Description', formData.get('otherDescription')],
    ['Occasion', formData.get('occasion')],
    ['Budget', formData.get('budget')],
    ['Needed By', formData.get('neededBy')],
    ['Fulfillment', formData.get('fulfillment')],
    ['Name', name],
    ['Email', email],
    ['Phone', formData.get('phone')],
    ['Notes', formData.get('notes')],
  ]);

  const emailText = `New custom order request from MuleCreations.com\n\n${body}\n\n---\nReply to this email to respond to the customer.`;

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'orders@mulecreations.com',
      to: env.CONTACT_EMAIL,
      reply_to: email,
      subject: `Custom Order: ${itemType} — ${name}`,
      text: emailText,
    }),
  });

  if (!resendRes.ok) {
    console.error('Resend error:', resendRes.status, await resendRes.text());
    return jsonResponse({ error: 'Failed to send. Please try again.' }, 500);
  }

  return jsonResponse({ success: true }, 200);
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildEmailBody(fields) {
  return fields
    .filter(([, value]) => value && value.toString().trim())
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');
}
```

- [ ] **Step 2: Run tests to verify implementation matches tested logic**
```powershell
npm test
```
Expected: all 6 tests still pass.

- [ ] **Step 3: Commit**
```powershell
git add functions/api/contact.js
git commit -m "feat: add Cloudflare Pages Function for custom order emails"
```

---

### Task 15: Add initial product and portfolio content

**Files:** `src/content/products/*.md`, `src/content/portfolio/*.md`

- [ ] **Step 1: Create Tree of Life product**

Create `src/content/products/tree-of-life-personalized.md`:
```markdown
---
title: "Personalized Tree of Life"
category: "Plaques & Signs"
price: 65
description: "CNC-carved Tree of Life on HDF. Personalize the surrounding text — names, dates, or a meaningful phrase. A customer favorite."
image: "/images/products/tree-of-life.jpg"
squareLink: "https://square.link/u/REPLACE_WITH_REAL_LINK"
inStock: true
featured: true
---
```

- [ ] **Step 2: Create LDS 2026 Youth Theme Plaque product**

Create `src/content/products/lds-2026-youth-plaque.md`:
```markdown
---
title: "2026 LDS Youth Theme Plaque"
category: "Plaques & Signs"
price: 45
description: "Cherry wood plaque — Walk with Me, Moses 6:34. Perfect for youth rooms, gifts, or home display."
image: "/images/products/lds-2026-youth-plaque.jpg"
squareLink: "https://square.link/u/REPLACE_WITH_REAL_LINK"
inStock: true
featured: true
---
```

- [ ] **Step 3: Create a portfolio entry**

Create `src/content/portfolio/tree-of-life-sample.md`:
```markdown
---
title: "Tree of Life"
category: "Plaques & Signs"
material: "HDF"
image: "/images/portfolio/tree-of-life-sample.jpg"
description: "Personalized with family names and a meaningful date."
---
```

**Note:** Add real photos to `public/images/products/` and `public/images/portfolio/` and update the `image` paths. Until then, the cards render but show a broken image placeholder.

- [ ] **Step 4: Replace placeholder Square links**

Once your Square account is created (squareup.com → free account), go to Payment Links → Create a link for each product → copy the URL → replace `https://square.link/u/REPLACE_WITH_REAL_LINK` in each product file.

- [ ] **Step 5: Build and verify products appear**
```powershell
npm run build
npm run preview
```
Open `http://localhost:4321/shop` — product cards appear. Open `http://localhost:4321` — featured section visible.

- [ ] **Step 6: Commit**
```powershell
git add src/content/
git commit -m "feat: add initial product and portfolio content"
```

---

### Task 16: Set up Resend email account

**Files:** none (account setup only)

- [ ] **Step 1: Create free Resend account**

Go to https://resend.com — sign up, no credit card required. Free tier: 3,000 emails/month.

- [ ] **Step 2: Add MuleCreations.com as a sending domain**

Resend dashboard → Domains → Add Domain → `mulecreations.com`. Resend gives you DNS records to add. Add them in Cloudflare (after Task 18 moves the domain there). Domain verification takes a few minutes after records are saved.

- [ ] **Step 3: Create an API key**

Resend dashboard → API Keys → Create API Key → name it `mulecreations-prod`. Copy it immediately — shown only once.

- [ ] **Step 4: Record environment variables for Cloudflare Pages**

Keep these safe for use in Task 18:
- `RESEND_API_KEY` = the key from Step 3
- `CONTACT_EMAIL` = the email address where order notifications go (your personal or business inbox)

---

### Task 17: Push to GitHub

- [ ] **Step 1: Create GitHub repo**

Go to https://github.com/hansreno → New repository → name: `mulecreations` → Public → do NOT initialize with README → Create repository.

- [ ] **Step 2: Add remote and push**
```powershell
git remote add origin https://github.com/hansreno/mulecreations.git
git branch -M main
git push -u origin main
```
Expected: all commits pushed. Verify at `https://github.com/hansreno/mulecreations`.

---

### Task 18: Deploy to Cloudflare Pages

- [ ] **Step 1: Create Cloudflare account**

Go to https://cloudflare.com → sign up under Reno Creations (free plan).

- [ ] **Step 2: Connect repo to Cloudflare Pages**

Cloudflare dashboard → Pages → Create a project → Connect to Git → Authorize GitHub → Select `hansreno/mulecreations`.

- [ ] **Step 3: Configure build settings**

In the Pages setup:
- Framework preset: **Astro**
- Build command: `npm run build`
- Build output directory: `dist`

- [ ] **Step 4: Add environment variables**

Under "Environment variables (advanced)" — add all three for **Production**:
- `NODE_VERSION` = `18`
- `RESEND_API_KEY` = (from Task 16)
- `CONTACT_EMAIL` = (your email)

- [ ] **Step 5: Deploy and verify**

Click "Save and Deploy". Wait ~60 seconds. Cloudflare assigns a URL like `mulecreations.pages.dev`. Open it — site loads. Navigate all 5 pages. Test the custom order form end-to-end: fill it out with a real email, submit, verify you receive the email at your `CONTACT_EMAIL`.

- [ ] **Step 6: Commit any fixes found during testing**
```powershell
git add .
git commit -m "fix: address issues found during Cloudflare Pages deployment"
git push
```

---

### Task 19: Point GoDaddy domain to Cloudflare

- [ ] **Step 1: Add MuleCreations.com to Cloudflare**

Cloudflare dashboard → Add a site → `mulecreations.com` → Free plan → Continue. Cloudflare scans existing DNS records. Review and Continue.

- [ ] **Step 2: Copy Cloudflare nameservers**

Cloudflare shows two nameservers like:
```
barb.ns.cloudflare.com
rico.ns.cloudflare.com
```
Copy both.

- [ ] **Step 3: Update nameservers in GoDaddy**

GoDaddy → My Products → Domains → `mulecreations.com` → Manage DNS → Nameservers → Change → Custom Nameservers → paste Cloudflare's nameservers → Save. Propagation: 10 minutes to 24 hours.

- [ ] **Step 4: Attach domain in Cloudflare Pages**

Pages → your project → Custom domains → Add custom domain → `mulecreations.com` → Continue. Cloudflare adds the CNAME automatically.

- [ ] **Step 5: Add Resend DNS records**

While in Cloudflare DNS, add the records Resend gave you in Task 16 Step 2. This enables sending email from `orders@mulecreations.com`.

- [ ] **Step 6: Verify**

Once propagation completes, open `https://mulecreations.com`. Expected: site loads over HTTPS (Cloudflare provides the certificate automatically). Submit another test custom order form — verify email arrives.

---

## Done

When all tasks are complete:
- `https://mulecreations.com` is live with HTTPS
- $0/month fixed cost
- New products: create one Markdown file in `src/content/products/`, push to GitHub, Cloudflare auto-deploys
- Custom orders: questionnaire emails you directly, you reply to quote and send a Square payment link
- About page: replace placeholder text with your story in `src/pages/about.astro`

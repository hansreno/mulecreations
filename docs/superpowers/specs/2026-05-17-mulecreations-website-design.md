# MuleCreations.com — Website Design Spec
**Date:** 2026-05-17
**Domain:** MuleCreations.com (owned via GoDaddy)
**Owner:** Hans Reno / Reno Creations (sole proprietor)

---

## Overview

MuleCreations.com is a woodworking and CNC creation business website for Hans Reno, based in Herriman, Utah. "Mule" is Hans's fishing nickname. The site serves two purposes: (1) selling ready-made items at fixed prices, and (2) accepting custom order inquiries with a guided questionnaire. The brand is bold, character-driven, and personal — centered on the mule logo and the owner's story.

**Business context:**
- Sub-brand of Reno Creations (sole proprietor)
- Currently selling via Facebook Marketplace; this site is the next level
- Primary product categories: LDS/religious plaques & carvings (especially Trees of Life), signs, storage items, display stands, pet tags
- Tree of Life carvings are the signature product — personalized, high-demand

**Goals:**
- Zero fixed monthly cost (only pay transaction fees when sales occur)
- Replace Facebook Marketplace as the primary sales channel
- Enable custom order inquiries with structured intake
- Showcase past work as a portfolio/credibility gallery
- Tell the Mule story authentically

---

## Site Structure — 5 Pages

### 1. Home
- **Hero:** Full-width section with mule logo large, tagline, and two CTA buttons ("Shop Now" → /shop, "Request Custom Work" → /custom)
- **Tagline:** *"You can lead a mule to water, but you can't make him drink."* — the traditional saying, as it appears on the logo artwork
- **Featured Products:** 3–4 highlighted items from the shop (manually curated)
- **"Who Is Mule?" snippet:** 2–3 sentences teasing the About story with a link to read more
- **CTA banner:** "Something specific in mind? Let's build it." → /custom

### 2. Shop (`/shop`)
- Grid layout of all ready-made, in-stock items
- Each product card: photo, name, price, short description, "Buy Now" button
- "Buy Now" links directly to a Square-hosted payment link (no on-site checkout)
- Filterable by category: Plaques & Signs, Storage, Stands, Pet Tags, Other
- Each product defined as a Markdown file in `src/content/products/` — adding a new item requires only creating one file
- **Fulfillment note displayed on each item:** "Local pickup (Herriman, UT) — shipping available, contact for rates"

### 3. Custom Orders (`/custom`)
- Intro: explain the custom process — submit the form, Hans replies with a quote, down payment required to begin, balance due on completion
- **Step 1 — Item type selector:** Customer picks what they want made. Based on their selection, a tailored form appears (no irrelevant questions)
- Each product type has its own minimal questionnaire — only ask what Hans actually needs to know for that item

**Tree of Life** (HDF, fixed size — only personalization varies):
  1. Personalization text (textarea — names, dates, quotes to appear around the tree)
  2. Occasion (select: Gift, Home Decor, Religious, Anniversary, Birthday, Christmas, Other)
  3. Needed by date (date field — optional)
  4. Pickup or shipping? (radio: Local pickup in Herriman UT / Need it shipped)
  5. Your name (text)
  6. Your email (email)
  7. Additional details (textarea — optional)

**Religious / Scripture Plaque:**
  1. Scripture reference or text (textarea)
  2. Occasion (select)
  3. Needed by date (optional)
  4. Pickup or shipping?
  5. Your name + email
  6. Additional details (textarea — including here if a non-standard size is wanted; Hans will follow up with a quote if so)

**Personalized Sign:**
  1. Text to display (textarea)
  2. Occasion (select)
  3. Needed by date (optional)
  4. Pickup or shipping?
  5. Your name + email
  6. Additional details (textarea — including here if a non-standard size is wanted; Hans will follow up with a quote if so)

**Everything Else (Storage, Stands, Pet Tags, Other):**
  1. Describe what you're looking for (textarea)
  2. Occasion (select)
  3. Budget range (select: Under $50, $50–$100, $100–$200, $200+, Not sure)
  4. Needed by date (optional)
  5. Pickup or shipping?
  6. Your name + email
  7. Phone number (optional)
  8. Additional details (textarea — including here if a non-standard size or material is wanted; Hans will follow up with a quote)

- **Adding new product questionnaires:** Each questionnaire is defined in a config file — as new product types are developed, a new form config can be added without rebuilding the page
- On submit: Cloudflare Worker formats answers into a structured email and delivers to Hans's inbox
- Confirmation page shown to customer: "Got it! Hans will be in touch within 1–2 business days."
- Hans replies from his regular email; sends a Square payment link for the deposit to begin work

### 4. Portfolio / Gallery (`/portfolio`)
- Masonry or uniform grid of photos of past work
- Items do NOT need prices or "Buy Now" — this is a credibility/inspiration page
- Short captions: item name + material (e.g., "Tree of Life — HDF", "Toy Box — redwood & cedar")
- Organized by category tabs or simple visual grouping
- Photos stored in `public/images/portfolio/`

### 5. About (`/about`)
- The Mule story: nickname origin, Alaska fishing trips, how woodworking started, the CNC machine, what Reno Creations / Mule Creations means
- The logo: explain the "you can lead a mule to water" play on words
- A human, first-person tone — this is what separates the site from a generic Etsy shop
- Photo of Hans (optional but recommended) and/or the workshop

---

## Visual Design

### Theme: Bold & Character-Driven
Dark background with warm wood tones. The logo is the star. Feels like a real craftsman's shop — not a generic template.

### Color Palette
| Role | Color | Hex |
|---|---|---|
| Page background | Deep charcoal | `#1a1a1a` |
| Card/section background | Dark gray | `#262626` |
| Primary accent | Warm amber/gold | `#c8860a` |
| Accent hover | Lighter amber | `#e8a020` |
| Primary text | Off-white/cream | `#f5f0e8` |
| Secondary text | Light gray | `#a09080` |
| Secondary accent | Natural linen | `#d4c5a9` |

### Typography
| Role | Font | Source |
|---|---|---|
| Headings | Arvo (bold slab-serif) | Google Fonts (free) |
| Body | Inter | Google Fonts (free) |

### Logo
- Displayed in nav (top-left, small) on every page
- Full-size hero treatment on the Home page
- Source file: `images/mulecreations.png` (existing)
- SVG version (`images/TheGuidedMule.svg`) used where scalability matters

### Product Photography
- Displayed on dark card backgrounds to make wood grain pop
- No lifestyle/staged requirements — clean shots on a neutral surface work fine
- The better the photos, the better the site looks

---

## Technical Architecture

### Stack
| Layer | Technology | Cost |
|---|---|---|
| Site framework | Astro | Free / open source |
| Hosting | Cloudflare Pages | Free |
| Form handling | Cloudflare Workers | Free (100k req/day) |
| Payments | Square (payment links) | Free + ~2.6% per transaction |
| Domain | GoDaddy → Cloudflare DNS | ~$1.50/mo (already owned) |
| Fonts | Google Fonts | Free |

**Total fixed monthly cost: $0**

### Domain Setup
1. Log into GoDaddy → change nameservers to Cloudflare's (provided during Cloudflare zone setup)
2. Add MuleCreations.com as a zone in Cloudflare (free plan)
3. Cloudflare account created under Reno Creations (sole proprietor); Cloudflare Pages deployment linked to GitHub repo at github.com/hansreno; Cloudflare assigns a `*.pages.dev` URL until the custom domain is attached

### Content Management (Products)
Each product in the shop is a Markdown file at `src/content/products/<slug>.md`:

```markdown
---
title: "2026 LDS Youth Theme Plaque"
category: "Plaques & Signs"
price: 45
description: "Cherry wood plaque featuring Walk with Me — Moses 6:34."
image: "/images/products/lds-2026-youth-plaque.jpg"
squareLink: "https://square.link/u/..."
inStock: true
featured: false
---
```

Adding a new product = create one file. No database, no CMS login, no code changes required.

### Payment Flow (Ready-Made Items)
1. Customer browses `/shop`, clicks "Buy Now"
2. Redirected to Square-hosted checkout page (Square's URL)
3. Customer enters card details on Square's secure page
4. Square charges card, deposits to Hans's bank account (next business day)
5. Hans receives email notification from Square with order details
6. Hans fulfills order (local pickup coordination or ships)

### Custom Order Flow
1. Customer fills out questionnaire on `/custom`
2. Form POSTs to Cloudflare Worker endpoint
3. Worker sends formatted email to Hans's inbox
4. Hans replies from email with quote details
5. If customer agrees, Hans sends a Square payment link for the deposit amount (Hans sets this per order — typically 30–50% of the agreed price)
6. Customer pays deposit via Square link
7. Hans builds the piece, communicates progress via email
8. Hans sends final Square payment link for remaining balance
9. Customer pays, Hans arranges pickup or ships

### Cloudflare Worker (Form Handler)
- Receives POST from custom order form
- Validates required fields (name, email, item type)
- Formats a structured summary email
- Sends via email API (e.g., Resend.com — free tier: 3,000 emails/month)
- Returns JSON response; Astro page shows confirmation or error

---

## Out of Scope (Not Building Now)
- Customer accounts / login
- Order tracking system
- Inventory management / quantity tracking
- Blog or news section
- SMS notifications
- Live chat
- Reviews / testimonials system (can add photos manually to About page)

---

## Open Items
- **Tagline:** Confirmed as *"You can lead a mule to water, but you can't make him drink."*
- **Email address:** Hans to provide business email for order notifications (or use an existing personal email)
- **Square account:** Hans to create a free Square account at square.com before payment links can be generated
- **GitHub account:** hansreno — Cloudflare Pages will deploy automatically from a GitHub repo under this account
- **Product photos:** Hans to provide photos for all shop items and portfolio pieces
- **About page content:** Hans to write or dictate the Mule origin story in his own words
- **Deposit percentage:** Hans to decide his standard deposit amount per order type (30–50% is typical for custom craftwork)

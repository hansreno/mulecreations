# Adding Portfolio Items

## Step 1 — Add your image(s)

Copy your image file(s) into:
```
public/images/portfolio/
```

**Naming rules:**
- All lowercase
- Use hyphens instead of spaces
- Example: `reno-family-tree.jpg` not `Reno Family Tree.jpg`

---

## Step 2 — Edit the portfolio file

Open `src/data/portfolio.json` and add a new entry to the array.

### Single image (no gallery)
```json
{
  "title": "Reno Family Tree of Life",
  "image": "/images/portfolio/reno-family-tree.jpg"
}
```

### Multiple images (with gallery)
```json
{
  "title": "Reno Family Tree of Life",
  "image": "/images/portfolio/reno-family-tree.jpg",
  "gallery": [
    "/images/portfolio/reno-family-tree-detail.jpg",
    "/images/portfolio/reno-family-tree-wall.jpg"
  ]
}
```

### Optional extras you can add to any entry
```json
{
  "title": "Reno Family Tree of Life",
  "image": "/images/portfolio/reno-family-tree.jpg",
  "material": "HDF",
  "description": "Personalized with family names."
}
```

---

## Step 3 — Make sure commas are right

Each entry in the JSON array needs a comma after it **except the last one**.

```json
[
  {
    "title": "First Item",
    "image": "/images/portfolio/first.jpg"
  },
  {
    "title": "Second Item",
    "image": "/images/portfolio/second.jpg"
  },
  {
    "title": "Last Item — no comma after this one",
    "image": "/images/portfolio/last.jpg"
  }
]
```

---

## Step 4 — Commit and push

In VS Code, open the terminal and run:
```
git add -A
git commit -m "portfolio: add [item name]"
git push origin main
```

Cloudflare will deploy automatically within 1-2 minutes.

---

## Quick checklist
- [ ] Image file is in `public/images/portfolio/`
- [ ] Filename is lowercase with hyphens
- [ ] Entry added to `src/data/portfolio.json`
- [ ] Commas are correct in the JSON
- [ ] Committed and pushed

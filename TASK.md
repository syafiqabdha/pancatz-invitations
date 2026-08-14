# TASK: Rebuild 3 Distinct Master Layout Templates

## What You Need To Do

You are rebuilding the Pancatz Invitation templates from scratch. There are currently 3 partially-built template directories under `src/components/templates/` (songket, noir, garden) that need to be completely rebuilt.

### The Problem With Current Build

1. **SVG assets don't load** — components reference `/src/assets/botanicals/` which doesn't exist in the build. The correct path is `/botanicals/` (files are in `public/botanicals/`) and `/ornaments/` (files are in `public/ornaments/`).
2. **Layouts aren't genuinely different** — the 3 templates are just color/font swaps of the same section structure. The user needs 3 genuinely different layouts to evaluate as a master template.

### What The User Actually Wants

3 **genuinely different invitation page layouts** — distinct section arrangements, visual hierarchy, and interaction patterns. Not just different colors and fonts. The user will review all 3 and pick ONE as the master layout. All future invitation templates will follow that chosen master layout structure with different style treatments (colors, fonts, ornaments).

### Layout Requirements — Make Each Genuinely Different

**Layout A (Songket Manuscript) — Classic Scroll**
- Vertical single-column scroll, full-width sections
- Hero: names + date centered, countdown rings below
- Story: left-aligned prose with decorative divider
- Venue: card with map + Waze buttons side by side
- Schedule: vertical timeline with gold dot markers
- Gallery: 3-column masonry grid (2-col mobile)
- RSVP: modal triggered from dedicated CTA section
- Vibe: Heritage, ceremonial, structured
- Color: midnight green + antique gold
- Font: Cormorant Garamond + Inter + Amiri

**Layout B (Quiet Luxury) — Split Hero + Floating Cards**
- Hero is split: left side = massive names, right side = date/venue/countdown
- Content floats in overlapping offset cards with subtle shadows
- Story: floating card offset right with minimal text
- Venue: full-width card with action buttons below
- Schedule: horizontal card timeline (scrollable on mobile)
- Gallery: horizontal scroll photo essay (desktop), stacked 2-col on mobile
- RSVP: inline form at page bottom (NOT a modal)
- Vibe: Editorial, minimalist, modern
- Color: cream + charcoal + gold accents (used sparingly)
- Font: Playfair Display (100-700 weight) + DM Sans

**Layout C (Ethereal Garden) — Full-Screen Snap Sections**
- Each section is a full-viewport panel with CSS scroll-snap
- Hero: full-screen with botanical background, wreath countdown
- Story: full-screen panel with side botanical vine illustration
- Venue: full-screen with venue image placeholder + details overlay
- Schedule: full-screen vertical timeline with flower markers
- Gallery: full-screen organic masonry, tap to enlarge
- RSVP: full-screen modal with bloom animation
- Vibe: Immersive, romantic, cinematic
- Color: garden cream + sage + blush + lavender
- Font: Cormorant Garamond + Lora + Great Vibes

## Existing Infrastructure (DO NOT TOUCH)

- `astro.config.mjs` — keep as-is
- `package.json`, `tsconfig.json` — keep as-is
- `src/lib/directus.ts` — types and data layer, keep as-is
- `src/data/mock-invitation.ts` — mock data, keep as-is
- `src/data/templates.ts` — template metadata, update if needed
- `src/pages/api/rsvp.ts`, `src/pages/api/qr.ts`, `src/pages/api/contact.ts` — keep as-is
- `src/pages/dashboard/` — keep as-is
- `src/pages/admin.astro` — keep as-is
- `public/ornaments/` — 4 SVG files (corner.svg, corner-flip.svg, mandala-top.svg, mandala-divider.svg)
- `public/botanicals/` — 6 SVG files (garland-top.svg, side-vine.svg, corner-rose.svg, divider-sprig.svg, wreath.svg, petals.svg)

## What To Build

### Pages
- `src/pages/index.astro` — simple catalog landing page with 3 cards linking to each template
- `src/pages/songket/[...slug].astro` — Layout A page (under 80 lines, imports + assembly)
- `src/pages/noir/[...slug].astro` — Layout B page (under 80 lines)
- `src/pages/garden/[...slug].astro` — Layout C page (under 80 lines)

### Components
- `src/components/templates/songket/` — all components for Layout A
- `src/components/templates/noir/` — all components for Layout B
- `src/components/templates/garden/` — all components for Layout C

Each layout needs components for: Cover, Hero, Story, Venue, Schedule, Verse, Gallery, DressCode, Gift, RSVP (modal or inline), Footer

### Libraries
- `src/lib/invitation-animations-songket.ts` — GSAP animations for Layout A
- `src/lib/invitation-animations-noir.ts` — GSAP animations for Layout B
- `src/lib/invitation-animations-garden.ts` — GSAP animations for Layout C

### Asset Paths
- SVG ornaments: use `/ornaments/corner.svg`, `/ornaments/mandal-top.svg`, etc. (NOT `/src/assets/...`)
- SVG botanicals: use `/botanicals/wreath.svg`, `/botanicals/garland-top.svg`, etc. (NOT `/src/assets/...`)

## Critical Rules

1. **Each layout MUST have a genuinely different section arrangement** — not just different CSS on the same HTML structure
2. **SVG paths must be `/ornaments/...` and `/botanicals/...`** (public dir paths, not src/assets)
3. **Mobile-responsive at 375px** — test each layout on mobile viewport
4. **`npm run build` must pass with 0 errors**
5. **`npx astro check` must pass with 0 errors**
6. **Page files under 80 lines** — just imports and component assembly
7. **Each layout has its own GSAP animation style** matching its interaction pattern

## Run At The End

```
npm run build
npx astro check
```

Both must pass with 0 errors.

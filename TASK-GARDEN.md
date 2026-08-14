# TASK: Build Layout C — Ethereal Garden (Full-Screen Snap Sections)

## Context
You are building ONE of 3 master layout candidates for Pancatz Wedding Invitations. This is Layout C: "Full-Screen Snap Sections" — an immersive, full-viewport panel layout with CSS scroll-snap.

## Existing Infrastructure
- `astro.config.mjs`, `package.json`, `tsconfig.json`
- `src/lib/directus.ts` — Invitation interface
- `src/data/mock-invitation.ts` — mock data
- `src/pages/api/`, `src/pages/dashboard/`, `src/pages/admin.astro`
- `public/ornaments/` — (not used in this layout)
- `public/botanicals/` — corner-rose.svg, divider-sprig.svg, garland-top.svg, petals.svg, side-vine.svg, wreath.svg

## Layout C — Full-Screen Snap Sections Structure

Distinct from Layout A (classic scroll) and Layout B (split hero):
- **Each section is a full-viewport panel** (100dvh height)
- **CSS scroll-snap** between sections (scroll snaps to next section)
- **Botanical SVG decorations** frame each section
- **Gallery is full-screen organic masonry** with tap-to-enlarge
- **RSVP is full-screen modal** with bloom animation
- **Countdown is a floral wreath** with rotating petals

### Components to create under src/components/templates/garden/

1. **Cover.astro** — Full-screen botanical cover:
   - Botanical background from `/botanicals/petals.svg` (subtle)
   - Bismillah (fades in first)
   - Couple names in Great Vibes script font (massive, centered)
   - Date below
   - "Buka Undangan" button
   - On click: petals part like flower opening (transform: scale + opacity)

2. **Hero.astro** — Full-screen hero panel:
   - Couple names in script + serif
   - Floral wreath countdown from `/botanicals/wreath.svg` (rotating slowly)
   - "Save to Calendar" button with floral hover state

3. **StorySection.astro** — Full-screen with side vines:
   - Side vine botanical illustrations from `/botanicals/side-vine.svg`
   - Story text centered
   - Botanical divider sprig from `/botanicals/divider-sprig.svg`

4. **VerseSection.astro** — Full-screen quote panel:
   - Centered verse with botanical dividers
   - Large quotation marks in sage color

5. **Venue.astro** — Full-screen with botanical border:
   - Venue details centered
   - Botanical border frame
   - Google Maps + Waze buttons with floral styling

6. **Schedule.astro** — Full-screen vertical timeline:
   - Timeline with flower markers (not dots)
   - Each item has a small SVG flower
   - Time + description

7. **Gallery.astro** — Full-screen organic masonry:
   - Masonry grid with rounded corners on images
   - Slight rotation on each image (organic feel)
   - Tap to enlarge (lightbox)
   - Placeholder colored rectangles with rounded corners

8. **DressCode.astro** — Full-screen color swatches:
   - Large circular swatches framed in botanical circles
   - Names below each swatch

9. **GiftSection.astro** — Full-screen with floral corner ornaments:
   - QR code area with floral frame
   - Bank details
   - Copy-to-clipboard

10. **RsvpModal.astro** — Full-screen modal:
    - Form with floral styling
    - Bloom success animation (petals expand outward)
    - Validation

11. **Footer.astro** — Full-screen footer:
    - "Made by Pancatz" with small botanical mark

### Page file
- `src/pages/garden/[...slug].astro` — imports all components, under 80 lines

### Animation library
- `src/lib/invitation-animations-garden.ts` — GSAP animations:
  - Cover entrance (floral bloom sequence)
  - Cover open (petals part)
  - Scroll snap reveals (gentle bounce on section enter)
  - Wreath countdown (rotating petals)
  - RSVP bloom success

### Design System
- **Colors:** garden-cream `#FDF8F0`, sage `#8FA98A`, sage-deep `#5C7A54`, blush `#E8C4B8`, rose `#C4988A`, lavender `#C5B8D4`, gold `#D4A843`, charcoal `#3D3D3D`, muted `#9A9A9A`, peach `#F5D5C8`
- **Fonts:** Cormorant Garamond (headings, italic), Lora (body), Great Vibes (couple names)
- **Layout:** full-viewport panels with CSS scroll-snap, soft rounded corners (16-24px)
- **Botanical SVGs:** all from `/botanicals/` path
- **Mobile-first** responsive
- **prefers-reduced-motion** support

### Acceptance Criteria
1. `npm run build` passes with 0 errors
2. `npx astro check` passes with 0 errors
3. Page file under 80 lines
4. Layout is genuinely different from A and B (full-screen snap sections, botanical SVGs, wreath countdown)
5. All SVGs load from `/botanicals/` path
6. Mobile-responsive at 375px
7. noscript fallback works
8. prefers-reduced-motion disables all animations

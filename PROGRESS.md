# Progress: Pancatz Invitations — 3 Master Layout Templates

## Current Status (2026-08-15)

**3 layout styles built, server running on port 4321, live on Tailscale VPN.**
All 3 pass build with 0 errors, 0 warnings.

### What's Working
- ✅ Catalog landing page at `/` linking to all 3 templates
- ✅ Layout A (Songket) — Classic vertical scroll, 10 sections, modal RSVP
- ✅ Layout B (Noir) — Split hero + floating cards, horizontal gallery, inline RSVP form
- ✅ Layout C (Garden) — Normal scroll with nav dots, full-viewport sections, modal RSVP
- ✅ SVG assets load from `/ornaments/` and `/botanicals/`
- ✅ agy 1.1.13 installed, using `gemini-3.7-flash-high` (95% quota)
- ✅ Tailscale VPN access at `http://100.67.166.37:4321/`

### Known Issues Pending
- **Layout A**: RSVP modal was overlapping page content — fixed with `[hidden] { display: none !important }` + main-content starts with `visibility:hidden;opacity:0`. Still needs user verification that cover button properly reveals main content.
- **Layout C**: Removed scroll-snap (user didn't like it). Added nav dot sidebar for section navigation. RSVP modal needs mobile verification — applied `@media (max-width: 480px)` fix to remove internal scroll and make it a bottom sheet. Still needs user verification on mobile device.

### Next Steps (When Resuming)
1. User reviews all 3 layouts on Tailscale VPN
2. User picks ONE layout as master
3. Fix any remaining bugs on chosen layout
4. Deploy to Coolify production

## Layout Details

### Layout A — Songket Manuscript (Classic Scroll)
- **Route:** `/songket/nurul-dan-afiq`
- **Structure:** Cover → Hero → Story → Verse → Venue → Schedule → Gallery → DressCode → Gift → RsvpSection → Footer
- **Components:** 12 under `src/components/templates/songket/`
- **Animation:** `src/lib/invitation-animations-songket.ts` (cover fade, scroll reveals, sparkle)
- **Colors:** midnight `#071D18`, antique gold `#D9B867`, jade, ivory
- **Fonts:** Cormorant Garamond + Inter + Amiri
- **RSVP:** Modal triggered from CTA section

### Layout B — Quiet Luxury (Split Hero + Cards)
- **Route:** `/noir/nurul-dan-afiq`
- **Structure:** Hero (split-screen) → Verse → Story → Venue → Schedule → Gallery → DressCode → Gift → RsvpSection (inline form) → Footer
- **Components:** 11 under `src/components/templates/noir/`
- **Animation:** `src/lib/invitation-animations-noir.ts` (card reveals, countdown)
- **Colors:** cream `#FAF8F5`, charcoal `#2C2C2C`, gold `#C5A55A`
- **Fonts:** Playfair Display + DM Sans
- **RSVP:** Inline form at bottom (NOT modal)

### Layout C — Ethereal Garden (Nav Dots)
- **Route:** `/garden/nurul-dan-afiq`
- **Structure:** Cover → Hero → Story → Verse → Venue → Schedule → Gallery → DressCode → Gift → Footer (each section min-height: 100dvh)
- **Components:** 11 under `src/components/templates/garden/`
- **Animation:** `src/lib/invitation-animations-garden.ts` (bloom, wreath rotation)
- **Navigation:** Fixed dot sidebar on right side, click to scroll to section
- **Colors:** garden cream `#FDF8F0`, sage `#8FA98A`, blush, lavender
- **Fonts:** Cormorant Garamond + Lora
- **RSVP:** Modal with mobile bottom-sheet styling

## Technical
- **Project:** `~/pancatz-invitations-prod/`
- **Framework:** Astro 5 SSR, Node adapter
- **Build:** `npm run build` → 0 errors, 0 warnings
- **Server:** `NODE_ENV=production HOST=0.0.0.0 PORT=4321 node dist/server/entry.mjs`
- **Source repo:** Not yet on Git (needs push)
- **agy models available:** gemini-3.7-flash-high (95% quota), claude-sonnet-4-6 (31%), claude-opus-4-6-thinking (31%)

## Bugs Fixed This Session
1. SVG asset paths: `/src/assets/...` → `/ornaments/` and `/botanicals/` (public dir)
2. Songket main-content visibility: added `style="visibility:hidden;opacity:0"`
3. Songket RSVP modal: `[hidden] { display: none !important }` to override `display: flex`
4. Garden scroll-snap: removed, replaced with nav dot sidebar
5. Garden DressCode ID: `dress-code` → `dresscode` to match nav dots
6. Garden RSVP modal mobile: bottom-sheet style, no internal scroll
7. Garden null target guard: `if (!target) return;` in nav dot click handler

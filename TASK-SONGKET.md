# TASK: Build Layout A — Songket Manuscript (Classic Scroll)

## Context
You are building ONE of 3 master layout candidates for Pancatz Wedding Invitations. This is Layout A: "Classic Scroll" — a traditional vertical scrolling invitation with Malay heritage aesthetic.

## Existing Infrastructure
The project already has these files — use them, don't recreate:
- `astro.config.mjs`, `package.json`, `tsconfig.json`
- `src/lib/directus.ts` — Invitation interface and data types
- `src/data/mock-invitation.ts` — mock invitation data (use this for all components)
- `src/pages/api/` — API routes (rsvp.ts, qr.ts, contact.ts)
- `src/pages/dashboard/` — dashboard pages
- `src/pages/admin.astro` — admin page
- `public/ornaments/` — corner.svg, corner-flip.svg, mandala-top.svg, mandala-divider.svg
- `public/botanicals/` — (not used in this layout)

## Layout A — Classic Scroll Structure

The page flows as a single vertical scroll: Cover → Hero → Story → Verse → Venue → Schedule → Gallery → Dress Code → Gift → RSVP CTA → Footer

Each section is full-width, stacked vertically, with gold dividers between them.

### Components to create under src/components/templates/songket/

1. **Cover.astro** — Full-viewport cover with:
   - SVG corner ornaments from `/ornaments/corner.svg` and `/ornaments/corner-flip.svg`
   - Bismillah in Amiri font, centered
   - Couple names in Cormorant Garamond italic (massive, centered)
   - Date below names
   - "Buka Undangan" button with pulse animation
   - On click: cover fades out, main content fades in
   - noscript fallback: cover hidden, main visible

2. **Hero.astro** — Names + countdown section:
   - Couple names again (smaller than cover)
   - SVG circular countdown rings (days, hours, minutes)
   - "Save to Calendar" button
   - Background: subtle mandala SVG from `/ornaments/mandal-top.svg`

3. **StorySection.astro** — Left-aligned prose:
   - Story text from mockInvitation
   - Decorative gold divider below

4. **VerseSection.astro** — Centered quote:
   - Large decorative quotation marks
   - verse_or_message text, centered, italic
   - Attribution below

5. **Venue.astro** — Venue card:
   - Venue name, address
   - Google Maps + Waze buttons side by side
   - Card with glass effect (backdrop-filter blur)

6. **Schedule.astro** — Vertical timeline:
   - schedule items with time + description
   - Gold dot markers on left
   - Vertical line connecting dots

7. **Gallery.astro** — 3-column masonry grid:
   - 6 placeholder items with colored backgrounds (375px → 2-col on mobile)
   - Hover: slight scale + gold border

8. **DressCode.astro** — Color swatches in a row:
   - dress_code_palette items as circular swatches with names

9. **GiftSection.astro** — QR + bank details card:
   - QR code area (placeholder)
   - Bank transfer details
   - Copy-to-clipboard button

10. **RsvpSection.astro** — CTA section:
    - "Send RSVP" button that opens modal
    - Brief text encouraging guests to RSVP

11. **RsvpModal.astro** — Full-screen modal:
    - Form: name, attendance (yes/no/maybe), guest count, wish message
    - Validation
    - Submit to `/api/rsvp`
    - Success: gold sparkle animation

12. **Footer.astro** — Contact info + "Made by Pancatz"

### Page file
- `src/pages/songket/[...slug].astro` — imports all components, passes mockInvitation props, under 80 lines

### Animation library
- `src/lib/invitation-animations-songket.ts` — GSAP animations:
  - Cover entrance (fade in elements sequentially)
  - Cover open (fade out, reveal main)
  - Scroll reveals (sections fade up on scroll enter)
  - Countdown ring animation
  - RSVP success sparkle

### Design System
- **Colors:** midnight `#071D18`, deep green `#0B2B23`, jade `#174D3D`, light jade `#2C6A54`, antique gold `#D9B867`, light gold `#F1D993`, ivory `#F7F0DF`, paper `#EADFC7`, muted `#B8C8BE`, rose `#B77B71`
- **Fonts:** Cormorant Garamond (headings, italic), Inter (body), Amiri (Arabic/Bismillah)
- **CSS custom properties** for all colors
- **Mobile-first** responsive design (375px base)
- **prefers-reduced-motion** support
- **noscript fallback** (cover hidden, main visible)

### Acceptance Criteria
1. `npm run build` passes with 0 errors
2. `npx astro check` passes with 0 errors
3. All SVGs load from `/ornaments/` path (NOT `/src/assets/`)
4. Page file under 80 lines
5. Mobile-responsive at 375px
6. noscript fallback works
7. prefers-reduced-motion disables all animations
8. Mock data renders correctly (names, date, venue, schedule, etc.)

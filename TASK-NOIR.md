# TASK: Build Layout B — Quiet Luxury (Split Hero + Floating Cards)

## Context
You are building ONE of 3 master layout candidates for Pancatz Wedding Invitations. This is Layout B: "Split Hero + Floating Cards" — a modern editorial layout with split-screen hero and overlapping card sections.

## Existing Infrastructure
- `astro.config.mjs`, `package.json`, `tsconfig.json`
- `src/lib/directus.ts` — Invitation interface
- `src/data/mock-invitation.ts` — mock data
- `src/pages/api/`, `src/pages/dashboard/`, `src/pages/admin.astro`
- `public/ornaments/` — (not used in this layout)
- `public/botanicals/` — (not used in this layout)

## Layout B — Split Hero + Floating Cards Structure

Distinct from Layout A (classic scroll):
- **Hero is split-screen**: left side = massive names, right side = date/venue/countdown
- **Content floats in offset cards**: sections are cards with subtle shadows, not full-width blocks
- **Gallery is horizontal scroll**: not a masonry grid
- **RSVP is inline form at bottom**: NOT a modal
- **Schedule is horizontal card timeline**: scrollable on mobile

### Components to create under src/components/templates/noir/

1. **Cover.astro** — Minimal cover with:
   - Thin gold border SVG (draws slowly on load)
   - Corner brackets
   - Bismillah in serif (small, muted)
   - Couple names in Playfair Display (extreme thin weight 100, massive)
   - "Open Invitation" button (minimal, transparent with gold border)
   - On click: cover fades to white with upward drift

2. **Hero.astro** — Split-screen hero:
   - Left column: massive couple names (clamp for responsive), ultra-thin
   - Right column: date, venue name, countdown (minimal digits with underline)
   - "Save to Calendar" button (minimal)

3. **StorySection.astro** — Floating card:
   - Card with subtle shadow, offset to the right
   - Story text in Playfair italic
   - Minimal gold divider

4. **Venue.astro** — Full-width card:
   - Venue details card spanning full width
   - Google Maps + Waze buttons below

5. **Schedule.astro** — Horizontal card timeline:
   - Scrollable horizontal cards for each schedule item
   - Time + description in each card
   - On mobile: stacks vertically

6. **VerseSection.astro** — Inline pull-quote:
   - Centered between sections
   - Massive quotation marks
   - verse text in Playfair italic

7. **Gallery.astro** — Horizontal scroll photo essay:
   - Horizontal scrolling gallery (desktop)
   - On mobile: 2-column grid
   - Placeholder colored rectangles

8. **DressCode.astro** — Minimal color dots:
   - Small circular swatches with labels
   - Minimal, no borders

9. **GiftSection.astro** — Compact expandable card:
   - Bank details in `<details>` element
   - Copy-to-clipboard

10. **RsvpSection.astro** — Inline form at page bottom:
    - NOT a modal — form is part of the page
    - Fields: name, attendance, wish
    - Submit button
    - Validation

11. **Footer.astro** — Minimal footer:
    - "Made by Pancatz" centered, small

### Page file
- `src/pages/noir/[...slug].astro` — imports all components, under 80 lines

### Animation library
- `src/lib/invitation-animations-noir.ts` — GSAP animations:
  - Cover entrance (border draw, names type in)
  - Cover open (fade to white, upward drift)
  - Scroll reveals (staggered card reveals)
  - Countdown digit animation
  - RSVP form validation feedback

### Design System
- **Colors:** cream `#FAF8F5`, ivory `#F5F0E8`, warm-stone `#E8E0D4`, charcoal `#2C2C2C`, soft-black `#1A1A1A`, gold `#C5A55A`, muted `#8A8A8A`, blush `#E8C4B8`, sage `#A8B5A0`
- **Fonts:** Playfair Display (100-700 weight, headings), DM Sans (body)
- **Layout:** extreme whitespace, max-width 600px for text, massive typography
- **Cards:** subtle shadow, offset positioning, warm ivory backgrounds
- **Mobile-first** responsive
- **prefers-reduced-motion** support

### Acceptance Criteria
1. `npm run build` passes with 0 errors
2. `npx astro check` passes with 0 errors
3. Page file under 80 lines
4. Layout is genuinely different from Layout A (split hero, floating cards, horizontal gallery, inline RSVP)
5. Mobile-responsive at 375px
6. noscript fallback works
7. prefers-reduced-motion disables all animations

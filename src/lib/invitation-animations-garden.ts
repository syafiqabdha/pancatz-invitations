/**
 * src/lib/invitation-animations-garden.ts
 * GSAP animation library for Layout C — Ethereal Garden (Full-Screen Snap Sections).
 */

import { gsap } from 'gsap';

/* ─────────────────────────────────────────────
   1. Reduced-motion check helper
   ───────────────────────────────────────────── */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ─────────────────────────────────────────────
   2. Cover Entrance — floral bloom sequence
   ───────────────────────────────────────────── */
export function initCoverEntrance(): void {
  if (prefersReducedMotion()) return;

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  tl.fromTo(
    '.garden-cover__bismillah',
    { opacity: 0, y: -18 },
    { opacity: 0.9, y: 0, duration: 1.1, delay: 0.2 },
  )
    .fromTo(
      '.garden-cover__names',
      { opacity: 0, scale: 0.92, y: 15 },
      { opacity: 1, scale: 1, y: 0, duration: 1.3 },
      '-=0.5',
    )
    .fromTo(
      '.garden-cover__date',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.5',
    )
    .fromTo(
      '.garden-cover__btn',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.4',
    )
    .fromTo(
      '.garden-cover__petals',
      { opacity: 0, scale: 1.1 },
      { opacity: 0.4, scale: 1, duration: 1.5 },
      '<-0.8',
    );
}

/* ─────────────────────────────────────────────
   3. Cover Open — petals part like flower opening
   ───────────────────────────────────────────── */
export function coverOpen(onComplete?: () => void): void {
  if (prefersReducedMotion()) {
    const cover = document.getElementById('cover');
    if (cover) cover.style.display = 'none';
    if (onComplete) onComplete();
    return;
  }

  const tl = gsap.timeline({
    onComplete: () => {
      if (onComplete) onComplete();
    },
  });

  tl.to('.garden-cover__petals', {
    scale: 2.4,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.inOut',
  })
    .to(
      '.garden-cover__inner',
      { opacity: 0, scale: 0.94, duration: 0.6, ease: 'power2.in' },
      '-=0.4',
    )
    .to(
      '.garden-cover',
      { opacity: 0.85, duration: 0.3 },
      '-=0.1',
    );
}

/* ─────────────────────────────────────────────
   4. Scroll-snap section reveals
   ───────────────────────────────────────────── */
export function initSectionReveals(): void {
  if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;

  const panels = document.querySelectorAll<HTMLElement>('.garden-panel:not(.garden-cover)');

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const inner = target.querySelector('.garden-panel__content, [class$="__inner"]') as HTMLElement | null;
          if (inner) {
            gsap.fromTo(
              inner,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' },
            );
          }
          io.unobserve(target);
        }
      });
    },
    { threshold: 0.2 },
  );

  panels.forEach((p) => io.observe(p));
}

/* ─────────────────────────────────────────────
   5. Wreath Countdown — slow rotating petals
   ───────────────────────────────────────────── */
export function initWreathRotation(): void {
  if (prefersReducedMotion()) return;

  const wreaths = document.querySelectorAll<HTMLElement>('.garden-hero__wreath-img, .garden-footer__wreath');
  if (!wreaths.length) return;

  wreaths.forEach((el) => {
    gsap.to(el, {
      rotation: 360,
      duration: 60,
      ease: 'none',
      repeat: -1,
      transformOrigin: '50% 50%',
    });
  });
}

/* ─────────────────────────────────────────────
   6. Countdown ticker
   ───────────────────────────────────────────── */
export function initCountdown(targetIso: string): void {
  if (!targetIso) return;
  const target = new Date(targetIso).getTime();

  function pad(n: number): string {
    return String(Math.max(0, n)).padStart(2, '0');
  }

  function tick(): void {
    const now = Date.now();
    const diff = Math.max(0, target - now);

    const days = Math.floor(diff / 86_400_000);
    const hours = Math.floor((diff % 86_400_000) / 3_600_000);
    const mins = Math.floor((diff % 3_600_000) / 60_000);
    const secs = Math.floor((diff % 60_000) / 1_000);

    const setEl = (sel: string, val: string): void => {
      const el = document.querySelector<HTMLElement>(sel);
      if (el) el.textContent = val;
    };

    setEl('.cd-days', pad(days));
    setEl('.cd-hours', pad(hours));
    setEl('.cd-mins', pad(mins));
    setEl('.cd-secs', pad(secs));
  }

  tick();
  setInterval(tick, 1000);
}

/* ─────────────────────────────────────────────
   7. RSVP Bloom Success — petals expand outward
   ───────────────────────────────────────────── */
export function rsvpBloomSuccess(container: Element): void {
  if (prefersReducedMotion()) return;

  const colors = ['#E8C4B8', '#8FA98A', '#C5B8D4', '#D4A843', '#F5D5C8', '#C4988A'];
  const petalCount = 24;

  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement('div');
    petal.className = 'garden-bloom-petal';
    petal.style.cssText = `
      position: absolute;
      width: 12px;
      height: 18px;
      border-radius: 50% 50% 50% 0;
      background: ${colors[i % colors.length]};
      top: 50%;
      left: 50%;
      transform-origin: center center;
      pointer-events: none;
      z-index: 10;
    `;
    container.appendChild(petal);

    const angle = (360 / petalCount) * i;
    const radius = 90 + Math.random() * 70;
    const tx = Math.cos((angle * Math.PI) / 180) * radius;
    const ty = Math.sin((angle * Math.PI) / 180) * radius;

    gsap.fromTo(
      petal,
      { x: 0, y: 0, scale: 0, opacity: 1, rotation: angle },
      {
        x: tx,
        y: ty,
        scale: 1 + Math.random() * 0.8,
        opacity: 0,
        rotation: angle + 180,
        duration: 1.2 + Math.random() * 0.6,
        ease: 'power2.out',
        onComplete: () => petal.remove(),
      },
    );
  }

  gsap.fromTo(
    '.garden-rsvp__success-msg',
    { scale: 0.7, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(2)', delay: 0.15 },
  );
}

/* ─────────────────────────────────────────────
   8. Bootstrap all animations
   ───────────────────────────────────────────── */
export function initGardenAnimations(eventDateIso: string): void {
  if (prefersReducedMotion()) return;

  initCoverEntrance();
  initSectionReveals();
  initWreathRotation();
  if (eventDateIso) {
    initCountdown(eventDateIso);
  }
}

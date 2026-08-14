/**
 * invitation-animations-noir.ts
 * GSAP animation library for Layout B — Quiet Luxury (Split Hero + Floating Cards)
 * All animations respect prefers-reduced-motion.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// ─── Cover Animations ────────────────────────────────────────────────────────

/**
 * Animate the thin border SVG path on load (slow draw-in effect).
 */
export function animateCoverBorderDraw(svgSelector = '#cover-border-path'): void {
  if (prefersReducedMotion()) return;
  const path = document.querySelector<SVGPathElement>(svgSelector);
  if (!path) return;

  const len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  gsap.to(path, {
    strokeDashoffset: 0,
    duration: 2.2,
    ease: 'power2.inOut',
    delay: 0.2,
  });
}

/**
 * Fade the couple names upward into view on the cover.
 */
export function animateCoverNames(namesSelector = '#cover-names'): void {
  if (prefersReducedMotion()) return;
  gsap.from(namesSelector, {
    opacity: 0,
    y: 24,
    duration: 1.2,
    ease: 'power3.out',
    delay: 0.8,
  });
}

/**
 * Fade in the Bismillah and Open Invitation button after names.
 */
export function animateCoverMeta(
  bismillahSel = '#cover-bismillah',
  btnSel = '#btn-open'
): void {
  if (prefersReducedMotion()) return;
  const tl = gsap.timeline({ delay: 1.4 });
  tl.from(bismillahSel, { opacity: 0, duration: 0.8, ease: 'power2.out' })
    .from(btnSel, { opacity: 0, y: 12, duration: 0.6, ease: 'power2.out' }, '-=0.3');
}

/**
 * Open animation: cover fades upward and disappears, revealing main content.
 */
export function animateCoverOpen(
  coverSelector = '#cover',
  mainSelector = '#main-content'
): Promise<void> {
  return new Promise((resolve) => {
    const cover = document.querySelector<HTMLElement>(coverSelector);
    const main = document.querySelector<HTMLElement>(mainSelector);

    if (main) {
      main.removeAttribute('aria-hidden');
      main.style.visibility = 'visible';
    }
    document.body.style.overflow = 'auto';

    if (prefersReducedMotion()) {
      if (cover) {
        cover.style.display = 'none';
        cover.style.pointerEvents = 'none';
      }
      ScrollTrigger.refresh();
      resolve();
      return;
    }

    if (!cover) {
      animateHeroEntrance();
      ScrollTrigger.refresh();
      resolve();
      return;
    }

    gsap.to(cover, {
      opacity: 0,
      y: -60,
      duration: 0.9,
      ease: 'power3.inOut',
      onComplete: () => {
        cover.style.display = 'none';
        cover.style.pointerEvents = 'none';
        animateHeroEntrance();
        ScrollTrigger.refresh();
        resolve();
      },
    });
  });
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

/**
 * Animate the split-screen hero: left names slide from left, right column slides from right.
 */
export function animateHeroEntrance(
  leftSel = '#hero-left',
  rightSel = '#hero-right'
): void {
  if (prefersReducedMotion()) return;
  const tl = gsap.timeline({ delay: 0.1 });
  tl.from(leftSel, {
    opacity: 0,
    x: -40,
    duration: 1.0,
    ease: 'power3.out',
  }).from(
    rightSel,
    { opacity: 0, x: 40, duration: 1.0, ease: 'power3.out' },
    '-=0.7'
  );
}

// ─── Countdown ────────────────────────────────────────────────────────────────

/**
 * Live countdown: updates digits every second and micro-animates digit changes.
 */
export function startCountdown(targetIso: string, containerSel = '#countdown'): void {
  const container = document.querySelector<HTMLElement>(containerSel);
  if (!container || !targetIso) return;

  const targetDate = new Date(targetIso).getTime();
  if (Number.isNaN(targetDate)) return;

  const getEls = () => ({
    days: container.querySelector<HTMLElement>('[data-unit="days"]'),
    hours: container.querySelector<HTMLElement>('[data-unit="hours"]'),
    mins: container.querySelector<HTMLElement>('[data-unit="mins"]'),
    secs: container.querySelector<HTMLElement>('[data-unit="secs"]'),
  });

  function update(): void {
    const diff = targetDate - Date.now();
    const d = Math.max(0, Math.floor(diff / 86400000));
    const h = Math.max(0, Math.floor((diff % 86400000) / 3600000));
    const m = Math.max(0, Math.floor((diff % 3600000) / 60000));
    const s = Math.max(0, Math.floor((diff % 60000) / 1000));

    const els = getEls();
    const vals: [HTMLElement | null, string][] = [
      [els.days, String(d).padStart(2, '0')],
      [els.hours, String(h).padStart(2, '0')],
      [els.mins, String(m).padStart(2, '0')],
      [els.secs, String(s).padStart(2, '0')],
    ];

    for (const [el, val] of vals) {
      if (el && el.textContent !== val) {
        el.textContent = val;
        if (!prefersReducedMotion()) {
          gsap.fromTo(
            el,
            { y: -6, opacity: 0.5 },
            { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' }
          );
        }
      }
    }
  }

  update();
  const timer = setInterval(update, 1000);

  // Clean up timer if container is removed from DOM
  const observer = new MutationObserver(() => {
    if (!document.body.contains(container)) {
      clearInterval(timer);
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// ─── Scroll Reveals ───────────────────────────────────────────────────────────

/**
 * Staggered scroll-triggered reveal for floating cards and sections.
 */
export function initScrollReveals(cardSel = '[data-reveal]'): void {
  if (prefersReducedMotion()) return;

  document.querySelectorAll<HTMLElement>(cardSel).forEach((el) => {
    const dir = el.dataset['reveal'] ?? 'up';
    const fromVars: gsap.TweenVars = { opacity: 0, duration: 0.85, ease: 'power3.out' };

    if (dir === 'up') fromVars['y'] = 40;
    else if (dir === 'left') fromVars['x'] = -40;
    else if (dir === 'right') fromVars['x'] = 40;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter: () => gsap.from(el, fromVars),
      once: true,
    });
  });
}

/**
 * Staggered children reveal inside a parent container.
 */
export function initStaggeredReveal(
  parentSel: string,
  childSel: string,
  stagger = 0.1
): void {
  if (prefersReducedMotion()) return;

  document.querySelectorAll<HTMLElement>(parentSel).forEach((parent) => {
    const children = parent.querySelectorAll<HTMLElement>(childSel);
    if (!children.length) return;

    ScrollTrigger.create({
      trigger: parent,
      start: 'top 85%',
      onEnter: () => {
        gsap.from(children, {
          opacity: 0,
          y: 24,
          duration: 0.65,
          stagger,
          ease: 'power3.out',
        });
      },
      once: true,
    });
  });
}

// ─── RSVP Feedback ────────────────────────────────────────────────────────────

/**
 * Field-level validation shake animation.
 */
export function animateFieldError(fieldSel: string): void {
  if (prefersReducedMotion()) return;
  const tl = gsap.timeline();
  tl.to(fieldSel, { x: -6, duration: 0.06, ease: 'power1.out' })
    .to(fieldSel, { x: 6, duration: 0.06 })
    .to(fieldSel, { x: -4, duration: 0.06 })
    .to(fieldSel, { x: 4, duration: 0.06 })
    .to(fieldSel, { x: -2, duration: 0.05 })
    .to(fieldSel, { x: 0, duration: 0.05, ease: 'power1.in' });
}

/**
 * RSVP success transition: fade out form, smoothly reveal success message.
 */
export function animateRsvpSuccess(
  formSel = '#rsvp-form',
  successSel = '#rsvp-success'
): void {
  const form = document.querySelector<HTMLElement>(formSel);
  const success = document.querySelector<HTMLElement>(successSel);
  if (!form || !success) return;

  if (prefersReducedMotion()) {
    form.style.display = 'none';
    success.style.display = 'block';
    return;
  }

  gsap.to(form, {
    opacity: 0,
    y: -16,
    duration: 0.4,
    ease: 'power2.in',
    onComplete: () => {
      form.style.display = 'none';
      gsap.fromTo(
        success,
        { opacity: 0, y: 16, display: 'block' },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    },
  });
}

// ─── Main Initializer ─────────────────────────────────────────────────────────

/**
 * Boot all Noir animations.
 */
export function initNoirAnimations(params: {
  targetIso: string;
  hasCover?: boolean;
}): void {
  const hasCover = params.hasCover ?? true;
  const coverEl = document.getElementById('cover');
  const openBtn = document.getElementById('btn-open');
  const mainEl = document.getElementById('main-content');

  if (hasCover && coverEl && openBtn) {
    document.body.style.overflow = 'hidden';
    if (mainEl) mainEl.setAttribute('aria-hidden', 'true');

    animateCoverBorderDraw();
    animateCoverNames();
    animateCoverMeta();

    openBtn.addEventListener('click', () => {
      animateCoverOpen('#cover', '#main-content');
    });
  } else {
    document.body.style.overflow = 'auto';
    if (mainEl) mainEl.removeAttribute('aria-hidden');
    animateHeroEntrance();
  }

  if (params.targetIso) {
    startCountdown(params.targetIso);
  }

  initScrollReveals();
  initStaggeredReveal('#schedule-track', '.schedule-card');
}

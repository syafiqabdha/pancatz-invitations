/**
 * src/lib/invitation-animations-songket.ts
 * GSAP animation suite for Layout A — Songket Manuscript (Classic Scroll)
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Check if the user prefers reduced motion
 */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Cover entrance animation — animates ornaments, typography, and CTA on initial load
 */
export function animateCoverEntrance(): void {
  if (isReducedMotion()) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.cover-corner', {
    opacity: 0,
    scale: 0.85,
    duration: 1.1,
    stagger: 0.12,
  })
    .from(
      '.cover-bismillah',
      { opacity: 0, y: -18, duration: 0.85 },
      '-=0.5',
    )
    .from(
      '.cover-names',
      { opacity: 0, y: 28, duration: 1.0 },
      '-=0.45',
    )
    .from(
      '.cover-date',
      { opacity: 0, y: 16, duration: 0.75 },
      '-=0.5',
    )
    .from(
      '.cover-cta',
      { opacity: 0, y: 14, scale: 0.95, duration: 0.7 },
      '-=0.35',
    );
}

/**
 * Cover reveal animation — smoothly fades out cover and unlocks main invitation content
 */
export function animateCoverOpen(
  cover: HTMLElement,
  main: HTMLElement,
): Promise<void> {
  return new Promise((resolve) => {
    if (isReducedMotion()) {
      cover.style.display = 'none';
      main.style.visibility = 'visible';
      main.style.opacity = '1';
      if (typeof window !== 'undefined') {
        ScrollTrigger.refresh();
      }
      resolve();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        cover.style.display = 'none';
        ScrollTrigger.refresh();
        resolve();
      },
    });

    tl.to(cover, {
      opacity: 0,
      scale: 0.97,
      duration: 0.65,
      ease: 'power2.inOut',
    }).fromTo(
      main,
      { opacity: 0, visibility: 'visible' },
      {
        opacity: 1,
        duration: 0.75,
        ease: 'power2.out',
      },
      '-=0.15',
    );
  });
}

/**
 * Scroll reveal animations for sections and staggered child elements
 */
export function initScrollReveals(): void {
  if (isReducedMotion()) return;

  // Single section reveal
  gsap.utils.toArray<HTMLElement>('.section-reveal').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 36,
      duration: 0.85,
      ease: 'power3.out',
    });
  });

  // Staggered list / grid items
  gsap.utils.toArray<HTMLElement>('.stagger-reveal').forEach((parent) => {
    const children = parent.querySelectorAll<HTMLElement>('.stagger-child');
    if (!children.length) return;
    gsap.from(children, {
      scrollTrigger: {
        trigger: parent,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
    });
  });
}

/**
 * Animate SVG countdown progress rings when scrolled into view
 */
export function animateCountdownRings(): void {
  if (isReducedMotion()) return;

  gsap.utils.toArray<SVGCircleElement>('.countdown-ring').forEach((ring) => {
    const circumference = parseFloat(ring.getAttribute('data-circumference') ?? '0');
    const targetDash = parseFloat(ring.getAttribute('data-dash') ?? circumference.toString());

    gsap.set(ring, {
      strokeDasharray: circumference,
      strokeDashoffset: circumference,
    });

    gsap.to(ring, {
      scrollTrigger: {
        trigger: ring,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      strokeDashoffset: circumference - targetDash,
      duration: 1.5,
      ease: 'power2.out',
    });
  });
}

/**
 * RSVP celebration sparkle effect upon successful submission
 */
export function animateRsvpSuccess(container: HTMLElement): void {
  if (isReducedMotion()) return;

  const count = 28;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    particle.className = 'sparkle-particle';
    fragment.appendChild(particle);
  }

  container.appendChild(fragment);

  const particles = container.querySelectorAll<HTMLElement>('.sparkle-particle');

  particles.forEach((p) => {
    const angle = Math.random() * 360;
    const distance = 50 + Math.random() * 85;
    const rad = (angle * Math.PI) / 180;
    const tx = Math.cos(rad) * distance;
    const ty = Math.sin(rad) * distance;

    gsap.fromTo(
      p,
      { opacity: 1, x: 0, y: 0, scale: 1.2 + Math.random() * 0.8 },
      {
        opacity: 0,
        x: tx,
        y: ty,
        scale: 0,
        duration: 0.75 + Math.random() * 0.5,
        ease: 'power2.out',
        onComplete: () => p.remove(),
      },
    );
  });
}

/**
 * Initialize all songket invitation animations
 */
export function initSongketAnimations(): void {
  if (!isReducedMotion()) {
    animateCoverEntrance();
  }

  initScrollReveals();
  animateCountdownRings();
}

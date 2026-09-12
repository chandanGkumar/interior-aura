'use client';

import { useEffect } from 'react';

/**
 * CursorEffect — three-layer cursor follower (dot, ring, glow).
 * The dot pins to the pointer; the ring trails with easing; the glow trails
 * further still. Hover state widens the ring; press state tightens it.
 * Bail on touch devices and reduced-motion users.
 */
export function CursorEffect() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const EASE = 0.16;
    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]';

    const dot = document.querySelector<HTMLElement>('.cursor-dot');
    const ring = document.querySelector<HTMLElement>('.cursor-ring');
    const glow = document.querySelector<HTMLElement>('.cursor-glow');
    if (!dot || !ring || !glow) return;

    const root = document.documentElement;
    root.classList.add('cursor-active');

    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    let rx = px, ry = py;
    let gx = px, gy = py;
    let rafId = 0;

    function onMove(e: PointerEvent) {
      px = e.clientX;
      py = e.clientY;
      root.classList.add('cursor-visible');
    }
    function onLeave() {
      root.classList.remove('cursor-visible');
    }
    function onDown() { root.classList.add('cursor-down'); }
    function onUp() { root.classList.remove('cursor-down'); }
    function onOver(e: PointerEvent) {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.(INTERACTIVE)) root.classList.add('cursor-hover');
    }
    function onOut(e: PointerEvent) {
      const t = e.target as HTMLElement | null;
      const leaving = t?.closest?.(INTERACTIVE);
      const rt = e.relatedTarget as HTMLElement | null;
      const entering = rt?.closest?.(INTERACTIVE);
      if (leaving && !entering) root.classList.remove('cursor-hover');
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerout', onOut, { passive: true });

    // Arrow function, not a hoisted declaration: TypeScript keeps the
    // non-null narrowing from the guard above across an arrow closure.
    const loop = () => {
      rx += (px - rx) * EASE;
      ry += (py - ry) * EASE;
      gx += (px - gx) * EASE * 0.5;
      gy += (py - gy) * EASE * 0.5;

      dot.style.transform  = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      glow.style.transform = `translate3d(${gx}px, ${gy}px, 0) translate(-50%, -50%)`;

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerout', onOut);
      root.classList.remove('cursor-active', 'cursor-visible', 'cursor-hover', 'cursor-down');
    };
  }, []);

  return (
    <>
      <div className="cursor-glow" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true" />
      <div className="cursor-dot" aria-hidden="true" />
    </>
  );
}

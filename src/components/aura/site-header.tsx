'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Phone, FormInput } from 'lucide-react';

interface SiteHeaderProps {
  onOpenForm: () => void;
}

const NAV = [
  { id: 'work', label: 'Work' },
  { id: 'services', label: 'Services' },
  { id: 'studio', label: 'Studio' },
  { id: 'moodboard', label: 'Our designs', gated: true },
];

const CONTACT_PHONE = '8923033977';

export function SiteHeader({ onOpenForm }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function navClick(e: React.MouseEvent, id: string) {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'border-b border-border/60 bg-background/90 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div
        className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-3 md:py-4"
        style={{ paddingInline: 'max(1.5rem, 3vw)' }}
      >
        {/* Brand — real logo + visible wordmark (prominent) */}
        <a
          href="#top"
          onClick={(e) => navClick(e, 'top')}
          className="group flex items-center gap-3.5"
          aria-label="Interior Aura home"
        >
          <span className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-full ring-2 ring-primary/40 transition-all duration-500 group-hover:ring-primary group-hover:scale-105 md:h-16 md:w-16">
            <img
              src="/aura/brand-logo.jpg"
              alt="Interior Aura emblem"
              className="h-full w-full object-cover"
              style={{ mixBlendMode: 'multiply' }}
            />
            {/* soft saffron halo */}
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-2 -z-10 rounded-full opacity-50 blur-xl transition-opacity duration-500 group-hover:opacity-90"
              style={{ background: 'radial-gradient(closest-side, var(--primary), transparent 70%)' }}
            />
            {/* live indicator */}
            <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-background">
              <span className="h-2 w-2 animate-aura-pulse rounded-full bg-primary" />
            </span>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg uppercase leading-none tracking-tight text-foreground md:text-xl">
              Interior Aura
            </span>
            <span className="mt-1.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
              <span className="h-1 w-1 rounded-full bg-primary" />
              Ghaziabad · Est. 2026
            </span>
          </span>
        </a>

        {/* Nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => navClick(e, item.id)}
              className="group relative font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/75 transition-colors hover:text-foreground"
            >
              {item.label}
              {item.gated && (
                <span className="ml-1.5 inline-block h-1 w-1 rounded-full bg-primary align-middle" />
              )}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-primary transition-all duration-400 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Actions — Instagram + Form + Contact (no more Sign-in) */}
        <div className="flex items-center justify-end gap-2 md:gap-3">
          <a
            href="https://www.instagram.com/interior_aura/?hl=en"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary sm:inline-flex"
          >
            Instagram
            <ArrowUpRight className="h-3 w-3" />
          </a>
          <button
            type="button"
            onClick={onOpenForm}
            className="group flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] hover:border-primary hover:text-primary"
          >
            <FormInput className="h-3 w-3 transition-transform duration-300 group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Form</span>
            <span className="sm:hidden">Form</span>
          </button>
          <a
            href={`tel:${CONTACT_PHONE}`}
            className="group flex items-center gap-2 rounded-full bg-foreground px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-background transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] hover:bg-primary hover:text-primary-foreground"
            aria-label={`Call ${CONTACT_PHONE}`}
          >
            <Phone className="h-3 w-3 transition-transform duration-300 group-hover:scale-110" />
            <span className="hidden sm:inline">Contact</span>
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-background/70 md:hidden"
            aria-label="Open menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col p-4">
              {NAV.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => navClick(e, item.id)}
                  className="flex items-center justify-between border-b border-border/40 py-4 font-display text-2xl uppercase tracking-tight"
                >
                  <span>{item.label}</span>
                  {item.gated && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-3">
                <a
                  href="https://www.instagram.com/interior_aura/?hl=en"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-full border border-border/60 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
                >
                  Instagram <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenForm();
                  }}
                  className="flex items-center justify-between rounded-full border border-border/60 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground"
                >
                  Form <FormInput className="h-3.5 w-3.5" />
                </button>
                <a
                  href={`tel:${CONTACT_PHONE}`}
                  className="flex items-center justify-between rounded-full bg-foreground px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-background"
                >
                  Contact <Phone className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

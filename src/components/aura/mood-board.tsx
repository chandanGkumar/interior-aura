'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight, Bookmark, X } from 'lucide-react';
import Image from 'next/image';
import { Reveal } from './reveal';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface MoodBoardProps {
  onOpenForm: () => void;
}

const MOOD_ITEMS = [
  {
    slug: 'walnut-kitchen',
    title: 'Walnut Modular Kitchen',
    meta: 'Material study / 2026',
    img: '/aura/mood-1.png',
    span: 'md:col-span-2 md:row-span-2',
    palette: ['#C67640', '#3F2A1D', '#E8D5C4'],
    desc: 'Brushed brass inlay meets walnut veneer. Built around the rhythm of three worktop zones — prep, cook, plate.',
  },
  {
    slug: 'material-swatches',
    title: 'Brass & Terrazzo Palette',
    meta: 'Swatch / 2026',
    img: '/aura/mood-2.png',
    span: '',
    palette: ['#B07D56', '#D4A574', '#8B5A3C'],
    desc: 'Ivory terrazzo with saffron chip, paired with honed brass hardware and warm cream plaster.',
  },
  {
    slug: 'elevation-study',
    title: 'Elevation Shadow Study',
    meta: 'Drafting / 2026',
    img: '/aura/mood-3.png',
    span: '',
    palette: ['#7C4D2E', '#D4A574', '#3F2A1D'],
    desc: 'A study of vertical louvres in golden-hour light — proportion considered against seasonal shadow.',
  },
  {
    slug: 'vastu-ritual',
    title: 'Vastu Ritual Room',
    meta: 'Concept / 2026',
    img: '/aura/mood-4.png',
    span: 'md:col-span-2',
    palette: ['#C67640', '#E8D5C4', '#8B5A3C'],
    desc: 'A contemplative interior layered with warm terracotta, brass accents and natural light — sacred geometry meets contemporary living.',
  },
] as const;

const MATERIAL_LIBRARY = [
  { name: 'Brushed brass hardware', tag: 'Hardware' },
  { name: 'Walnut veneer, matte seal', tag: 'Timber' },
  { name: 'Terrazzo — ivory + saffron chip', tag: 'Stone' },
  { name: 'Lime-washed plaster, ochre', tag: 'Plaster' },
  { name: 'Hand-loomed saffron dhurrie', tag: 'Textile' },
  { name: 'Brass inlay black granite', tag: 'Stone' },
  { name: 'Reclaimed teak louvre', tag: 'Timber' },
  { name: 'Travertine — warm cream', tag: 'Stone' },
];

const STORAGE_KEY = 'aura-moodboard-saved';

interface SavedState {
  projects: string[];
  materials: string[];
}

function loadSaved(): SavedState {
  if (typeof window === 'undefined') return { projects: [], materials: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { projects: [], materials: [] };
    const parsed = JSON.parse(raw) as Partial<SavedState>;
    return {
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      materials: Array.isArray(parsed.materials) ? parsed.materials : [],
    };
  } catch {
    return { projects: [], materials: [] };
  }
}

export function MoodBoard({ onOpenForm }: MoodBoardProps) {
  const [saved, setSaved] = useState<SavedState>({ projects: [], materials: [] });
  const [active, setActive] = useState<(typeof MOOD_ITEMS)[number] | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Canonical pattern: read from localStorage after hydration to avoid SSR mismatch.
    // The set-state-in-effect rule is intentionally suppressed here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(loadSaved());
    setReady(true);
  }, []);

  // Lightbox: close on Escape and stop the page scrolling behind it.
  useEffect(() => {
    if (!active) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setActive(null);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);

  function persist(next: SavedState) {
    setSaved(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota errors */
    }
  }

  function toggleSaved(slug: string) {
    const has = saved.projects.includes(slug);
    const projects = has ? saved.projects.filter((s) => s !== slug) : [...saved.projects, slug];
    persist({ ...saved, projects });
    toast(has ? 'Removed from saved' : 'Saved to your mood board', {
      description: MOOD_ITEMS.find((m) => m.slug === slug)?.title,
    });
  }

  function toggleFav(name: string) {
    const has = saved.materials.includes(name);
    const materials = has ? saved.materials.filter((s) => s !== name) : [...saved.materials, name];
    persist({ ...saved, materials });
    toast(has ? 'Unfavourited' : 'Favourited', { description: name });
  }

  return (
    <section id="moodboard" className="bg-secondary text-secondary-foreground">
      <div className="section-pad">
        <Reveal>
          <div className="flex flex-col items-start gap-5">
            <span className="font-mono fs-meta uppercase tracking-[0.1em] text-primary">
              04 / Our designs
            </span>

            <h2 className="display-2">
              Our <em className="not-italic text-primary">Designs</em>
            </h2>

            <div className="grid w-full grid-cols-1 gap-x-14 gap-y-5 md:grid-cols-2">
              <p className="fs-lead text-secondary-foreground/70">
                Save materials, flag project briefs and follow elevation studies
                as they develop. Every tile comes out of a real project — a
                joinery detail, a stone sample, the way afternoon light lands on
                a wall. Tap one to open it, or send an enquiry from the form to
                start your own brief.
              </p>

              <p className="fs-lead text-secondary-foreground/70">
                Anything you save stays on this device, so the board can grow
                across several visits rather than one sitting. Material, light
                and proportion read differently side by side than they do alone
                — that comparison is the whole point of keeping one.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenForm}
              className="group mt-1 flex items-center gap-2 border-b border-secondary-foreground/40 pb-1 font-mono fs-meta uppercase tracking-[0.1em] text-secondary-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Start a brief
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </Reveal>

        {/* Mood grid — always unlocked */}
        <div className="mt-12 grid auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-4 md:auto-rows-[260px]">
          {MOOD_ITEMS.map((item, i) => {
            const isSaved = ready && saved.projects.includes(item.slug);
            return (
              <Reveal
                key={item.slug}
                delay={i * 0.06}
                as="article"
                className={`group relative overflow-hidden border border-secondary-foreground/15 ${item.span}`}
              >
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaved(item.slug);
                  }}
                  className={`absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition-all duration-300 hover:scale-105 ${
                    isSaved
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-secondary-foreground/20 bg-secondary/40 text-secondary-foreground hover:border-primary hover:text-primary'
                  }`}
                  aria-label={isSaved ? 'Remove from saved' : 'Save to mood board'}
                >
                  <Heart className={`h-4 w-4 transition-colors ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setActive(item)}
                  className="absolute inset-0 z-0 cursor-pointer"
                  aria-label={`Open ${item.title}`}
                />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-4 text-left">
                  <p className="font-mono fs-micro uppercase tracking-[0.1em] text-primary">
                    {item.meta}
                  </p>
                  <h3 className="mt-1 font-display text-xl uppercase leading-none md:text-2xl">
                    {item.title}
                  </h3>
                  <div className="mt-3 flex gap-1.5">
                    {item.palette.map((c) => (
                      <span
                        key={c}
                        className="h-2.5 w-2.5 rounded-full ring-1 ring-secondary-foreground/30"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Material library */}
        <Reveal>
          <div id="saved" className="mt-16 scroll-mt-32">
            <div className="flex items-end justify-between">
              <div>
                <span className="font-mono fs-meta uppercase tracking-[0.1em] text-primary">
                  Material library
                </span>
                <h3 className="mt-3 display-3">
                  Curated this season
                </h3>
              </div>
              <span className="hidden font-mono fs-meta uppercase tracking-[0.1em] text-secondary-foreground/50 md:inline">
                Tap to favourite
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {MATERIAL_LIBRARY.map((m) => {
                const fav = ready && saved.materials.includes(m.name);
                return (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => toggleFav(m.name)}
                    className={`group flex items-center gap-2 rounded-full border px-4 py-2 font-mono fs-meta uppercase tracking-[0.1em] transition-all duration-300 ${
                      fav
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-secondary-foreground/20 text-secondary-foreground/80 hover:border-primary hover:text-primary'
                    }`}
                  >
                    <span className={`rounded-full px-2 py-0.5 fs-micro ${
                      fav
                        ? 'bg-primary-foreground/15 text-primary-foreground'
                        : 'bg-secondary-foreground/10 text-secondary-foreground/60'
                    }`}>
                      {m.tag}
                    </span>
                    {m.name}
                    <Bookmark className={`h-3 w-3 transition-transform ${fav ? 'scale-110' : 'scale-100 group-hover:scale-110'}`} />
                  </button>
                );
              })}
            </div>

            {/* Save summary */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="border border-secondary-foreground/15 p-5">
                <p className="font-display text-5xl uppercase leading-none">
                  {ready ? saved.projects.length : 0}
                </p>
                <p className="mt-2 font-mono fs-meta uppercase tracking-[0.1em] text-secondary-foreground/60">
                  Saved projects
                </p>
              </div>
              <div className="border border-secondary-foreground/15 p-5">
                <p className="font-display text-5xl uppercase leading-none">
                  {ready ? saved.materials.length : 0}
                </p>
                <p className="mt-2 font-mono fs-meta uppercase tracking-[0.1em] text-secondary-foreground/60">
                  Favourite materials
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Lightbox for active mood item */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-secondary/85 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              className="relative grid max-w-4xl overflow-hidden bg-background text-foreground md:grid-cols-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-border bg-background/80 backdrop-blur transition-colors hover:text-primary"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
              <Image
                src={active.img}
                alt={active.title}
                width={1024}
                height={1024}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="aspect-square w-full object-cover md:h-full"
              />
              <div className="p-8 md:p-10">
                <p className="font-mono fs-meta uppercase tracking-[0.1em] text-primary">
                  {active.meta}
                </p>
                <h3 className="mt-3 display-3">
                  {active.title}
                </h3>
                <p className="mt-4 fs-body leading-relaxed text-muted-foreground">
                  {active.desc}
                </p>
                <div className="mt-6">
                  <p className="font-mono fs-meta uppercase tracking-[0.1em] text-muted-foreground">
                    Palette
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {active.palette.map((c) => (
                      <div key={c} className="flex items-center gap-2">
                        <span
                          className="h-5 w-5 rounded-full ring-1 ring-border"
                          style={{ background: c }}
                        />
                        <span className="font-mono fs-meta uppercase tracking-[0.1em] text-foreground/70">
                          {c}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    onClick={() => {
                      toggleSaved(active.slug);
                    }}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Heart
                      className={`mr-1 h-4 w-4 ${
                        ready && saved.projects.includes(active.slug)
                          ? 'fill-current'
                          : ''
                      }`}
                    />
                    {ready && saved.projects.includes(active.slug)
                      ? 'Remove from mood board'
                      : 'Save to mood board'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setActive(null);
                      onOpenForm();
                    }}
                  >
                    Enquire about this
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

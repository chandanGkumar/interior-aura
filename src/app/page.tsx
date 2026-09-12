'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  MapPin,
  Instagram,
} from 'lucide-react';
import { toast } from 'sonner';

import { SiteHeader } from '@/components/aura/site-header';
import { FormDialog } from '@/components/aura/form-dialog';
import { MoodBoard } from '@/components/aura/mood-board';
import { Reveal } from '@/components/aura/reveal';
import { CursorEffect } from '@/components/aura/cursor-effect';

const SERVICES = [
  {
    no: '01',
    title: 'Construction',
    desc: 'End-to-end execution shaped around structure, finish and everyday living.',
  },
  {
    no: '02',
    title: 'Modular furnishing',
    desc: 'Purpose-built kitchens, wardrobes and storage with a precise material language.',
  },
  {
    no: '03',
    title: 'Vastu',
    desc: 'Thoughtful spatial planning that balances traditional principles with modern life.',
  },
  {
    no: '04',
    title: 'Elevation',
    desc: 'Distinct exterior identities considered through proportion, texture and light.',
  },
  {
    no: '05',
    title: 'Design consultancy',
    desc: 'Clear creative direction for layouts, materials, lighting and finishes.',
  },
];

const MARQUEE_WORDS = [
  'Construction',
  'Modular',
  'Vastu',
  'Elevation',
  'Atmosphere',
  'Material',
  'Light',
  'Proportion',
  'Warmth',
];

export default function Home() {
  const [formOpen, setFormOpen] = useState(false);

  const heroMediaRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroMediaRef,
    offset: ['start start', 'end start'],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    els.forEach((el) => obs.observe(el));

    return () => obs.disconnect();
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <CursorEffect />

      <SiteHeader onOpenForm={() => setFormOpen(true)} />

      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section
        id="top"
        className="
          relative
          px-[max(1.25rem,3vw)]
          pb-16
          pt-28
          sm:pb-20
          sm:pt-32
          md:pb-24
          md:pt-36
          lg:pb-28
          lg:pt-40
        "
      >
        {/* Hero top grid */}
        <div
          className="
            grid
            min-w-0
            grid-cols-1
            gap-10
            lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]
            lg:items-end
            lg:gap-10
            xl:gap-14
          "
        >
          {/* ===================== HERO TITLE ===================== */}

          <div className="min-w-0">
            <motion.p
              className="eyebrow flex items-center gap-2.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.19, 1, 0.22, 1],
              }}
            >
              <span className="inline-block h-1.5 w-1.5 animate-aura-pulse rounded-full bg-primary" />

              Interior design / architecture
            </motion.p>

            {/*
              IMPORTANT:

              The previous 14.5vw size was making the word
              "TRANSFORMATION" larger than its grid column.

              This version uses a smaller responsive clamp and
              min-width: 0 so the heading stays inside the viewport.
            */}

            <h1
              className="
                mt-6
                w-full
                max-w-full
                min-w-0
                overflow-visible
                font-display
                text-[clamp(3.8rem,8vw,10rem)]
                uppercase
                leading-[0.82]
                tracking-[-0.035em]
                sm:text-[clamp(4.8rem,8.5vw,10rem)]
                md:text-[clamp(5.2rem,8vw,10rem)]
                lg:text-[clamp(5.2rem,7.4vw,10rem)]
                xl:text-[clamp(6rem,7.2vw,10rem)]
              "
            >
              <motion.span
                className="block whitespace-nowrap"
                initial={{
                  opacity: 0,
                  y: 48,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 1.1,
                  ease: [0.19, 1, 0.22, 1],
                }}
              >
                Interior
              </motion.span>

              <motion.span
                className="
                  relative
                  z-10
                  block
                  whitespace-nowrap
                  text-primary
                "
                initial={{
                  opacity: 0,
                  y: 48,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 1.1,
                  delay: 0.15,
                  ease: [0.19, 1, 0.22, 1],
                }}
              >
                Transformation
              </motion.span>
            </h1>
          </div>

          {/* ===================== HERO DESCRIPTION ===================== */}

          <motion.div
            className="
              min-w-0
              flex
              flex-col
              justify-end
              pb-2
              lg:pb-3
          "
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
              delay: 0.4,
              ease: [0.19, 1, 0.22, 1],
            }}
          >
            <p
              className="
                max-w-[31ch]
                text-base
                leading-relaxed
                text-foreground/85
                sm:text-lg
                lg:text-lg
                xl:text-xl
              "
            >
              We turn blueprints into expressive spaces — designed for the way a
              new generation lives, gathers and grows.
            </p>

            <div className="mt-7 h-px w-full origin-left animate-draw-line bg-border" />

            <div className="mt-3 flex min-w-0 items-center gap-3">
              <span className="eyebrow min-w-0">
                A complete interior solution
              </span>

              <button
                type="button"
                onClick={() => scrollTo('services')}
                className="
                  ml-auto
                  flex
                  shrink-0
                  items-center
                  gap-1
                  font-mono
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-primary
                "
              >
                Scroll

                <ArrowDown className="h-3 w-3 animate-bounce" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* ========================================================= */}
        {/* HERO MEDIA */}
        {/* ========================================================= */}

        <motion.div
          ref={heroMediaRef}
          className="
            relative
            mt-10
            overflow-hidden
            sm:mt-12
            md:mt-14
            lg:mt-16
          "
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            delay: 0.5,
            ease: [0.19, 1, 0.22, 1],
          }}
        >
          <motion.div
            style={{
              scale: heroScale,
              y: heroY,
            }}
            className="relative"
          >
            <img
              src="/aura/hero.jpg"
              alt="Contemporary living room with warm wood and saffron accents"
              className="
                block
                h-[clamp(300px,55vw,780px)]
                w-full
                object-cover
                sm:h-[clamp(350px,52vw,700px)]
                md:h-[clamp(400px,50vw,720px)]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-secondary/35
                via-transparent
                to-secondary/10
              "
            />
          </motion.div>

          {/* Hero image labels */}

          <motion.div
            className="
              absolute
              inset-x-4
              top-4
              flex
              justify-between
              gap-4
              font-mono
              text-[9px]
              uppercase
              tracking-[0.18em]
              text-primary-foreground
              sm:inset-x-5
              sm:top-5
              sm:text-[10px]
            "
            style={{
              textShadow:
                '0 1px 14px color-mix(in oklab, var(--foreground) 70%, transparent)',
            }}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 1,
              duration: 0.6,
            }}
          >
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-primary-foreground" />

              Interior Aura
            </span>

            <span>Ghaziabad, India</span>
          </motion.div>

          {/* Floating card */}

          <motion.div
            className="
              animate-aura-float
              absolute
              bottom-4
              right-4
              z-20
              w-[240px]
              bg-primary
              p-5
              text-primary-foreground
              shadow-[0_22px_50px_color-mix(in_oklab,var(--foreground)_18%,transparent)]
              sm:bottom-6
              sm:right-[5%]
              sm:w-[280px]
              sm:p-6
            "
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1.2,
              duration: 0.8,
              ease: [0.19, 1, 0.22, 1],
            }}
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-aura-pulse rounded-full bg-primary-foreground" />

              <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                Now creating
              </span>
            </div>

            <strong className="mt-3 block text-lg leading-tight">
              Homes with
              <br />
              a point of view.
            </strong>
          </motion.div>
        </motion.div>

        {/* ========================================================= */}
        {/* MARQUEE */}
        {/* ========================================================= */}

        <div className="mt-16 overflow-hidden border-y border-border/60 py-5 sm:mt-20 md:mt-24">
          <div className="flex w-max animate-aura-marquee gap-10 whitespace-nowrap sm:gap-12">
            {[
              ...MARQUEE_WORDS,
              ...MARQUEE_WORDS,
              ...MARQUEE_WORDS,
              ...MARQUEE_WORDS,
            ].map((w, i) => (
              <span
                key={i}
                className="
                  flex
                  items-center
                  gap-10
                  font-display
                  text-2xl
                  uppercase
                  tracking-tight
                  text-foreground/80
                  sm:gap-12
                  sm:text-3xl
                  md:text-4xl
                "
              >
                {w}

                <span className="text-primary opacity-40">/</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SERVICES */}
      {/* ========================================================= */}

      <section
        id="services"
        className="
          border-t
          border-border/60
          px-[max(1.25rem,3vw)]
          py-16
          sm:py-20
          md:py-28
          lg:py-32
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-10
            md:gap-14
            lg:grid-cols-[minmax(220px,1fr)_minmax(0,2fr)]
            lg:gap-16
          "
        >
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <span className="index-label">
                01 / Capabilities
              </span>

              <h2
                className="
                  mt-4
                  font-display
                  text-[clamp(3.5rem,7vw,7rem)]
                  uppercase
                  leading-[0.9]
                "
              >
                The
                <br />
                Blueprint
              </h2>

              <p
                className="
                  mt-4
                  max-w-[18ch]
                  text-sm
                  leading-relaxed
                  text-muted-foreground
                "
              >
                From first line to final layer — a complete interior solution,
                considered end to end.
              </p>
            </div>
          </Reveal>

          <div className="flex min-w-0 flex-col">
            {SERVICES.map((s, i) => (
              <Reveal
                key={s.no}
                delay={i * 0.05}
              >
                <article
                  onClick={() => {
                    setFormOpen(true);

                    toast(`${s.title} selected`, {
                      description: 'Tell us more in the form.',
                    });
                  }}
                  className="
                    group
                    grid
                    cursor-pointer
                    grid-cols-[28px_minmax(0,1fr)_20px]
                    items-center
                    gap-3
                    border-t
                    border-border/60
                    py-6
                    transition-[padding,background]
                    duration-500
                    ease-[cubic-bezier(0.19,1,0.22,1)]
                    last:border-b
                    hover:bg-[color-mix(in_oklab,var(--primary)_8%,var(--background))]
                    hover:pl-3
                    sm:grid-cols-[36px_minmax(0,1fr)_24px]
                    sm:gap-4
                    sm:py-7
                    lg:grid-cols-[36px_minmax(180px,1fr)_minmax(180px,0.8fr)_24px]
                    lg:gap-5
                    lg:min-h-[130px]
                  "
                >
                  <span
                    className="
                      font-mono
                      text-[10px]
                      uppercase
                      tracking-[0.18em]
                      text-muted-foreground
                      transition-colors
                      group-hover:text-primary
                    "
                  >
                    {s.no}
                  </span>

                  <h3
                    className="
                      min-w-0
                      font-display
                      text-[clamp(1.7rem,4vw,3rem)]
                      uppercase
                      leading-none
                    "
                  >
                    {s.title}
                  </h3>

                  <p
                    className="
                      hidden
                      max-w-[42ch]
                      font-mono
                      text-[11px]
                      leading-relaxed
                      text-muted-foreground
                      lg:block
                    "
                  >
                    {s.desc}
                  </p>

                  <ArrowRight
                    className="
                      h-4
                      w-4
                      text-muted-foreground
                      transition-all
                      duration-500
                      ease-[cubic-bezier(0.19,1,0.22,1)]
                      group-hover:translate-x-1
                      group-hover:text-primary
                    "
                  />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* WORK */}
      {/* ========================================================= */}

      <section
        id="work"
        className="
          bg-secondary
          px-[max(1.25rem,3vw)]
          py-16
          text-secondary-foreground
          sm:py-20
          md:py-28
        "
      >
        <Reveal>
          <div
            className="
              grid
              grid-cols-1
              items-start
              gap-6
              md:grid-cols-[minmax(180px,1fr)_minmax(0,2fr)]
              md:gap-12
              lg:gap-16
            "
          >
            <span className="index-label !text-primary">
              02 / Selected spaces
            </span>

            <h2
              className="
                min-w-0
                font-display
                text-[clamp(4rem,9vw,10rem)]
                uppercase
                leading-[0.9]
              "
            >
              Designed to be
              <br />
              <em className="not-italic text-primary">
                felt.
              </em>
            </h2>
          </div>
        </Reveal>

        <div
          className="
            mt-10
            grid
            grid-cols-1
            gap-8
            sm:mt-14
            md:grid-cols-[minmax(0,1.15fr)_minmax(220px,0.7fr)_minmax(0,1fr)]
            md:gap-6
          "
        >
          {/* Kitchen */}

          <Reveal>
            <figure className="group relative">
              <div className="overflow-hidden bg-muted">
                <img
                  src="/aura/kitchen.jpg"
                  alt="Warm walnut modular kitchen"
                  loading="lazy"
                  className="
                    block
                    aspect-[4/5]
                    w-full
                    object-cover
                    transition-transform
                    duration-1000
                    ease-[cubic-bezier(0.19,1,0.22,1)]
                    group-hover:scale-[1.04]
                  "
                />
              </div>

              <figcaption
                className="
                  mt-4
                  flex
                  flex-col
                  gap-2
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <span className="text-primary">
                  Modular living
                </span>

                <span className="text-secondary-foreground/55">
                  Kitchen / Material study
                </span>
              </figcaption>
            </figure>
          </Reveal>

          {/* Middle text */}

          <Reveal delay={0.08}>
            <div
              className="
                flex
                h-full
                flex-col
                justify-center
                px-0
                py-4
                sm:px-2
                sm:py-6
                md:px-4
              "
            >
              <p
                className="
                  font-display
                  text-[clamp(2rem,3.5vw,3.8rem)]
                  uppercase
                  leading-[0.98]
                "
              >
                Less decoration.
                <br />
                More atmosphere.
              </p>

              <p
                className="
                  mt-5
                  max-w-[25ch]
                  text-sm
                  leading-relaxed
                  text-secondary-foreground/55
                "
              >
                Precision, warmth and utility in every decision.
              </p>

              <button
                type="button"
                onClick={() => scrollTo('moodboard')}
                className="
                  group
                  mt-7
                  flex
                  w-fit
                  items-center
                  gap-2
                  border-b
                  border-secondary-foreground/40
                  pb-1
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  text-secondary-foreground
                  transition-colors
                  hover:border-primary
                  hover:text-primary
                "
              >
                Open mood board

                <ArrowRight
                  className="
                    h-3
                    w-3
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </button>
            </div>
          </Reveal>

          {/* Bedroom */}

          <Reveal delay={0.16}>
            <figure className="group relative">
              <div className="overflow-hidden bg-muted">
                <img
                  src="/aura/bedroom.jpg"
                  alt="Warm contemporary bedroom interior"
                  loading="lazy"
                  className="
                    block
                    aspect-[4/5]
                    w-full
                    object-cover
                    transition-transform
                    duration-1000
                    ease-[cubic-bezier(0.19,1,0.22,1)]
                    group-hover:scale-[1.04]
                  "
                />
              </div>

              <figcaption
                className="
                  mt-4
                  flex
                  flex-col
                  gap-2
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <span className="text-primary">
                  Quiet retreat
                </span>

                <span className="text-secondary-foreground/55">
                  Bedroom / Light study
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ========================================================= */}
      {/* MOOD BOARD */}
      {/* ========================================================= */}

      <MoodBoard
        onOpenForm={() => setFormOpen(true)}
      />

      {/* ========================================================= */}
      {/* STUDIO */}
      {/* ========================================================= */}

      <section
        id="studio"
        className="
          grid
          grid-cols-1
          md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]
          md:min-h-[640px]
        "
      >
        <Reveal>
          <div
            className="
              grid
              min-h-[420px]
              place-items-center
              bg-primary
              p-10
              sm:p-12
              md:min-h-0
              md:p-16
            "
          >
            <motion.img
              src="/aura/brand-logo.jpg"
              alt="Interior Aura emblem"
              className="
                w-full
                max-w-[360px]
                mix-blend-multiply
              "
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: [0.19, 1, 0.22, 1],
              }}
            />
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div
            className="
              flex
              flex-col
              justify-center
              p-8
              sm:p-12
              md:p-16
              lg:p-[7vw]
            "
          >
            <span className="index-label">
              03 / The studio
            </span>

            <h2
              className="
                mt-4
                font-display
                text-[clamp(3.2rem,6vw,6.4rem)]
                uppercase
                leading-[0.9]
              "
            >
              Local insight.
              <br />
              Contemporary instinct.
            </h2>

            <p
              className="
                mt-6
                max-w-[50ch]
                text-base
                leading-relaxed
                text-muted-foreground
                md:text-lg
              "
            >
              Interior Aura is an artist-led design practice based in Muradnagar,
              Ghaziabad. We bring construction, interiors, furnishing, elevation
              and Vastu into one considered process — every brief is shaped by
              the people who will live inside it, and the light, materials and
              rituals of the place it sits in.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {[
                'Construction',
                'Interiors',
                'Furnishing',
                'Elevation',
                'Vastu',
              ].map((c) => (
                <span
                  key={c}
                  className="
                    rounded-full
                    border
                    border-border/60
                    px-4
                    py-2
                    font-mono
                    text-[10px]
                    uppercase
                    tracking-[0.18em]
                    text-muted-foreground
                    transition-colors
                    hover:border-primary
                    hover:text-primary
                  "
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ========================================================= */}
      {/* CONTACT */}
      {/* ========================================================= */}

      <section
        id="contact"
        className="
          bg-foreground
          px-[max(1.25rem,3vw)]
          py-16
          text-background
          sm:py-20
          md:py-28
        "
      >
        <Reveal>
          <div
            className="
              grid
              grid-cols-1
              items-end
              gap-8
              md:grid-cols-[minmax(180px,1fr)_minmax(0,2fr)]
              md:gap-16
            "
          >
            <span
              className="
                font-mono
                text-[10px]
                uppercase
                tracking-[0.18em]
                text-primary
              "
            >
              Have a space in mind?
            </span>

            <div className="min-w-0">
              <h2
                className="
                  font-display
                  text-[clamp(4rem,10vw,11rem)]
                  uppercase
                  leading-[0.85]
                "
              >
                Let&apos;s build
                <br />
                your aura.
              </h2>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => setFormOpen(true)}
                  className="
                    group
                    flex
                    items-center
                    gap-2
                    border-b
                    border-primary
                    pb-2
                    font-mono
                    text-[11px]
                    uppercase
                    tracking-[0.18em]
                    text-primary
                    transition-colors
                    hover:border-background
                    hover:text-background
                  "
                >
                  Send an enquiry

                  <ArrowRight
                    className="
                      h-3.5
                      w-3.5
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </button>

                <a
                  href="https://www.instagram.com/interior_aura/?hl=en"
                  target="_blank"
                  rel="noreferrer"
                  className="
                    group
                    flex
                    items-center
                    gap-2
                    border-b
                    border-background/40
                    pb-2
                    font-mono
                    text-[11px]
                    uppercase
                    tracking-[0.18em]
                    text-background/80
                    transition-colors
                    hover:border-background
                    hover:text-background
                  "
                >
                  <Instagram className="h-3.5 w-3.5" />

                  DM on Instagram

                  <ArrowUpRight
                    className="
                      h-3.5
                      w-3.5
                      transition-transform
                      duration-300
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                    "
                  />
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ========================================================= */}
        {/* FOOTER GRID */}
        {/* ========================================================= */}

        <div
          className="
            mt-14
            grid
            grid-cols-1
            gap-8
            border-t
            border-background/15
            pt-10
            sm:mt-16
            md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,2fr)]
          "
        >
          {/* Studio */}

          <div>
            <span
              className="
                font-mono
                text-[10px]
                uppercase
                tracking-[0.18em]
                text-primary
              "
            >
              Studio
            </span>

            <address
              className="
                mt-3
                flex
                items-start
                gap-2
                text-sm
                not-italic
                leading-relaxed
                text-background/75
              "
            >
              <MapPin
                className="
                  mt-0.5
                  h-3.5
                  w-3.5
                  shrink-0
                  text-background/50
                "
              />

              <span>
                Shop No. 90, Muradnagar
                <br />
                Ghaziabad, India 201206
              </span>
            </address>
          </div>

          {/* Contact */}

          <div>
            <span
              className="
                font-mono
                text-[10px]
                uppercase
                tracking-[0.18em]
                text-primary
              "
            >
              Reach us
            </span>

            <a
              href="tel:8923033977"
              className="
                mt-3
                flex
                items-center
                gap-2
                text-sm
                text-background/75
                transition-colors
                hover:text-background
              "
            >
              Call 89230 33977
            </a>

            <a
              href="mailto:soumaysinghal11@gmail.com"
              className="
                mt-2
                flex
                items-center
                gap-2
                break-all
                text-sm
                text-background/75
                transition-colors
                hover:text-background
              "
            >
              soumaysinghal11@gmail.com
            </a>
          </div>

          {/* Footer brand */}

          <div
            className="
              md:justify-self-end
              md:text-right
            "
          >
            <p
              className="
                font-display
                text-[clamp(2rem,4vw,4.5rem)]
                uppercase
                leading-none
                text-background/25
              "
            >
              Interior Aura
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COPYRIGHT */}
        {/* ========================================================= */}

        <div
          className="
            mt-8
            flex
            flex-col
            justify-between
            gap-2
            border-t
            border-background/10
            pt-6
            font-mono
            text-[10px]
            uppercase
            tracking-[0.18em]
            text-background/40
            md:flex-row
          "
        >
          <span>
            © 2026 / A complete interior solution
          </span>

          <a
            href="https://www.instagram.com/interior_aura/?hl=en"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-background"
          >
            Instagram ↗
          </a>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FORM DIALOG */}
      {/* ========================================================= */}

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
      />
    </main>
  );
}
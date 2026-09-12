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
import Image from 'next/image';

import { CursorEffect } from '@/components/aura/cursor-effect';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_E164,
  CONTACT_PHONE_DISPLAY,
  INSTAGRAM_URL,
  STUDIO_ADDRESS,
} from '@/lib/contact';

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

  function openService(title: string) {
    setFormOpen(true);
    toast(`${title} selected`, {
      description: 'Tell us more in the form.',
    });
  }

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
          px-[var(--gutter)]
          pt-[var(--hero-top)]
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
                animate-aura-tilt
                mt-6
                w-full
                max-w-full
                min-w-0
                display-1
              "
            >
              {/* Each line sits in its own mask and slides up out of it. */}

              <span className="block overflow-hidden pb-[0.04em]">
                <motion.span
                  className="block whitespace-nowrap"
                  initial={{ y: '115%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: 1.15,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                >
                  Interior
                </motion.span>
              </span>

              <span className="block overflow-hidden pb-[0.04em]">
                <motion.span
                  className="
                    animate-aura-tint
                    block
                    whitespace-nowrap
                    text-primary
                  "
                  initial={{ y: '115%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: 1.15,
                    delay: 0.14,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                >
                  Transformation
                </motion.span>
              </span>
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
                max-w-[36ch]
                fs-lead
                leading-relaxed
                text-foreground/85
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
                  fs-meta
                  font-semibold
                  uppercase
                  tracking-[0.1em]
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
            <Image
              src="/aura/hero.jpg"
              alt="Contemporary living room with warm wood and saffron accents"
              width={1920}
              height={1080}
              /* LCP element: load eagerly and skip lazy-loading. */
              priority
              sizes="100vw"
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
              fs-micro
              uppercase
              tracking-[0.1em]
              text-primary-foreground
              sm:inset-x-5
              sm:top-5
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

              <span className="font-mono fs-meta uppercase tracking-[0.1em]">
                Now creating
              </span>
            </div>

            <strong className="mt-3 block text-xl leading-tight">
              Homes with
              <br />
              a point of view.
            </strong>
          </motion.div>
        </motion.div>

        {/* ========================================================= */}
        {/* MARQUEE */}
        {/* ========================================================= */}

        <div className="mt-[clamp(2.5rem,4vw,3.5rem)] overflow-hidden border-y border-border/60 py-5">
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
          px-[var(--gutter)]
          py-[var(--section-y)]
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-10
            md:gap-14
            lg:grid-cols-[minmax(20rem,1fr)_minmax(0,1.9fr)]
            lg:gap-24
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
                  display-2
                  uppercase
                "
              >
                The
                <br />
                Blueprint
              </h2>

              <p
                className="
                  mt-4
                  max-w-[28ch]
                  fs-body
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
                  role="button"
                  tabIndex={0}
                  aria-label={`Enquire about ${s.title}`}
                  onClick={() => openService(s.title)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openService(s.title);
                    }
                  }}
                  className="
                    group
                    grid
                    cursor-pointer
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-background
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
                      fs-meta
                      uppercase
                      tracking-[0.1em]
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
                      display-3
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
                      fs-meta
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
          px-[var(--gutter)]
          pt-[var(--section-y)]
          text-secondary-foreground
        "
      >
        <Reveal>
          <div className="flex flex-col items-center gap-5 text-center">
            <span className="index-label !text-primary">
              02 / Selected spaces
            </span>

            <h2
              className="
                min-w-0
                font-display
                display-2
                uppercase
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
            relative
            mx-auto
            mt-12
            grid
            w-full
            max-w-6xl
            grid-cols-1
            gap-8
            md:grid-cols-2
          "
        >
          {/* Animated backdrop */}

          <div
            aria-hidden
            className="
              pointer-events-none
              absolute
              -inset-x-12
              -inset-y-16
              -z-10
              overflow-hidden
            "
          >
            <div
              className="
                animate-aura-drift
                absolute
                left-[-6%]
                top-[6%]
                h-[62%]
                w-[62%]
                rounded-full
                bg-primary/25
                blur-[90px]
              "
            />

            <div
              className="
                animate-aura-drift-slow
                absolute
                bottom-[2%]
                right-[-6%]
                h-[58%]
                w-[58%]
                rounded-full
                bg-primary/15
                blur-[110px]
              "
            />
          </div>

          {/* Kitchen */}

          <Reveal>
            <figure className="group relative">
              <div
                aria-hidden
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  translate-x-7
                  translate-y-7
                  border
                  border-primary/55
                  transition-transform
                  duration-700
                  ease-[cubic-bezier(0.19,1,0.22,1)]
                  group-hover:translate-x-0
                  group-hover:translate-y-0
                "
              />

              <div className="relative overflow-hidden bg-muted">
                <Image
                  src="/aura/kitchen.jpg"
                  alt="Warm walnut modular kitchen"
                  width={1200}
                  height={1500}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
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
                  fs-meta
                  uppercase
                  tracking-[0.1em]
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

          {/* Bedroom */}

          <Reveal delay={0.16}>
            <figure className="group relative">
              <div
                aria-hidden
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  translate-x-7
                  translate-y-7
                  border
                  border-primary/55
                  transition-transform
                  duration-700
                  ease-[cubic-bezier(0.19,1,0.22,1)]
                  group-hover:translate-x-0
                  group-hover:translate-y-0
                "
              />

              <div className="relative overflow-hidden bg-muted">
                <Image
                  src="/aura/bedroom.jpg"
                  alt="Warm contemporary bedroom interior"
                  width={1200}
                  height={1500}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
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
                  fs-meta
                  uppercase
                  tracking-[0.1em]
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

        <div className="mx-auto mt-14 w-full max-w-6xl">
          {/* Middle text */}

          <Reveal delay={0.05}>
            <div className="flex flex-col items-center text-center">
              <p
                className="
                  font-display
                  display-3
                  uppercase
                "
              >
                Less decoration.
                <br />
                More atmosphere.
              </p>

              <p
                className="
                  mt-5
                  max-w-[44ch]
                  fs-body
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
                  mt-8
                  flex
                  w-fit
                  items-center
                  gap-2
                  border-b
                  border-secondary-foreground/40
                  pb-1
                  font-mono
                  fs-meta
                  uppercase
                  tracking-[0.1em]
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
          md:min-h-[clamp(28rem,42vw,34rem)]
        "
      >
        <Reveal>
          <div
            className="
              grid
              min-h-[clamp(18rem,34vw,24rem)]
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
              lg:p-[clamp(2.5rem,4vw,4.5rem)]
            "
          >
            <span className="index-label">
              03 / The studio
            </span>

            <h2
              className="
                mt-4
                font-display
                display-2
                uppercase
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
                fs-lead
                leading-relaxed
                text-muted-foreground
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
                    fs-meta
                    uppercase
                    tracking-[0.1em]
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
          px-[var(--gutter)]
          py-[var(--section-y)]
          text-background
        "
      >
        <Reveal>
          <div className="flex flex-col items-center gap-5 text-center">
            <span
              className="
                font-mono
                fs-meta
                uppercase
                tracking-[0.1em]
                text-primary
              "
            >
              Have a space in mind?
            </span>

            <div className="min-w-0">
              <h2
                className="
                  font-display
                  display-2
                  uppercase
                "
              >
                Let&apos;s build
                <br />
                your aura.
              </h2>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
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
                    fs-meta
                    uppercase
                    tracking-[0.1em]
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
                  href={INSTAGRAM_URL}
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
                    fs-meta
                    uppercase
                    tracking-[0.1em]
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
            mt-[clamp(2.5rem,4vw,3.5rem)]
            grid
            grid-cols-1
            gap-8
            border-t
            border-background/15
            pt-10
            md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,2fr)]
          "
        >
          {/* Studio */}

          <div>
            <span
              className="
                font-mono
                fs-meta
                uppercase
                tracking-[0.1em]
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
                fs-body
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
                {STUDIO_ADDRESS.line1}
                <br />
                {STUDIO_ADDRESS.line2}
              </span>
            </address>
          </div>

          {/* Contact */}

          <div>
            <span
              className="
                font-mono
                fs-meta
                uppercase
                tracking-[0.1em]
                text-primary
              "
            >
              Reach us
            </span>

            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="
                mt-3
                flex
                items-center
                gap-2
                fs-body
                text-background/75
                transition-colors
                hover:text-background
              "
            >
              Call {CONTACT_PHONE_DISPLAY}
            </a>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="
                mt-2
                flex
                items-center
                gap-2
                break-all
                fs-body
                text-background/75
                transition-colors
                hover:text-background
              "
            >
              {CONTACT_EMAIL}
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
                display-3
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
            fs-meta
            uppercase
            tracking-[0.1em]
            text-background/40
            md:flex-row
          "
        >
          <span>
            © 2026 / A complete interior solution
          </span>

          <a
            href={INSTAGRAM_URL}
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
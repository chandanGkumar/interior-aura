'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'figure';
  once?: boolean;
}

const EASE = [0.19, 1, 0.22, 1] as const;

const variants: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE, delay: custom },
  }),
};

/**
 * Reveal — scroll-triggered fade-and-rise animation.
 * Used heavily across sections so the page breathes as you scroll.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
  once = true,
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={variants}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-12% 0px -12% 0px' }}
    >
      {children}
    </MotionTag>
  );
}

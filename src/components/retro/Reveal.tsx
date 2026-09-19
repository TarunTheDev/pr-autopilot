import React, { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  rotate?: number;
  className?: string;
  once?: boolean;
}

/**
 * Scroll-triggered reveal with a springy, slightly rotated entrance —
 * the motion signature of the Paper & Pixels system.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  y = 28,
  rotate = -1.1,
  className = '',
  once = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, rotate }}
      animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
      transition={{ type: 'spring', stiffness: 90, damping: 16, delay }}
    >
      {children}
    </motion.div>
  );
};

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  /** seconds between each child entrance */
  interval?: number;
}

/** Container that staggers any <motion.div variants={staggerItem}> children on scroll into view. */
export const Stagger: React.FC<StaggerProps> = ({
  children,
  className = '',
  interval = 0.08,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: interval } },
      }}
    >
      {children}
    </motion.div>
  );
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 26, rotate: -1 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: 'spring', stiffness: 90, damping: 16 },
  },
};

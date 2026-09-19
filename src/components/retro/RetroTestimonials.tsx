import React from 'react';
import { Quote } from 'lucide-react';
import { SectionTag } from './RetroBits';
import { Stagger, staggerItem } from './Reveal';
import { motion } from 'framer-motion';

const QUOTES = [
  {
    quote: 'It caught a missing token-expiry check that three human reviewers scrolled past. The file:line evidence made the fix a five-minute job.',
    name: 'Priya N.',
    role: 'Staff Engineer, fintech',
    color: '#ffbe0b',
    rotate: -2.5,
  },
  {
    quote: 'We stopped arguing about "looks good to me" in review. Now the verdict stamp is the first thing on every PR thread.',
    name: 'Marcus T.',
    role: 'Engineering Lead, SaaS',
    color: '#06d6a0',
    rotate: 1.8,
  },
  {
    quote: 'The generated Jest tests paste straight into CI. Our acceptance-criteria coverage went from vibes to enforced in a week.',
    name: 'Yuki H.',
    role: 'CTO, dev-tools startup',
    color: '#ff5d8f',
    rotate: -1.6,
  },
  {
    quote: 'As the person who writes the Jira tickets, watching the agent check each criterion one by one is deeply satisfying.',
    name: 'Dana R.',
    role: 'Product Manager, platform team',
    color: '#3a86ff',
    rotate: 2.2,
  },
];

/** Paper polaroids — slightly rotated, taped at the top, hand-written feel. */
export const RetroTestimonials: React.FC = () => (
  <section id="testimonials" className="relative px-4 sm:px-6 py-24 scroll-mt-28">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <SectionTag color="#fb5607">05 — FIELD REPORTS</SectionTag>
        <h2 className="font-display-retro text-4xl sm:text-5xl text-ink tracking-tight">
          TEAMS THAT <span className="retro-marker">STOPPED GUESSING.</span>
        </h2>
        <p className="mt-4 font-mono text-sm text-ink-soft max-w-xl mx-auto leading-relaxed">
          Pinned to the wall by engineers who ship daily.
        </p>
      </div>

      <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {QUOTES.map((q) => (
          <motion.figure
            key={q.name}
            variants={staggerItem}
            whileHover={{ rotate: 0, y: -8 }}
            style={{ rotate: q.rotate }}
            className="retro-card p-6 pt-8 relative bg-[#fffdf6]"
          >
            {/* tape */}
            <span
              aria-hidden="true"
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 opacity-80 border border-ink/20"
              style={{ background: q.color, transform: 'translateX(-50%) rotate(-2deg)' }}
            />
            <Quote size={20} className="text-ink/30 mb-3" />
            <blockquote className="font-mono text-xs sm:text-sm text-ink-soft leading-relaxed min-h-[120px]">
              {q.quote}
            </blockquote>
            <figcaption className="mt-5 pt-4 border-t-2 border-dashed border-ink/20">
              <div className="font-display-retro text-sm text-ink">{q.name}</div>
              <div className="retro-pixel-tag text-ink/50 mt-1.5">{q.role}</div>
            </figcaption>
          </motion.figure>
        ))}
      </Stagger>
    </div>
  </section>
);

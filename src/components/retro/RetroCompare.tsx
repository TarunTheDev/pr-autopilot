import React from 'react';
import { Check, X } from 'lucide-react';
import { SectionTag } from './RetroBits';
import { Stagger, staggerItem } from './Reveal';
import { motion } from 'framer-motion';

const ROWS: Array<{ label: string; vibes: boolean; autopilot: boolean }> = [
  { label: 'Reads the actual diff', vibes: false, autopilot: true },
  { label: 'Checks every acceptance criterion', vibes: false, autopilot: true },
  { label: 'file:line evidence for each finding', vibes: false, autopilot: true },
  { label: 'Generates runnable Jest tests', vibes: false, autopilot: true },
  { label: 'Answers follow-up questions', vibes: false, autopilot: true },
  { label: 'Done in ~30 seconds', vibes: true, autopilot: true },
  { label: 'Costs nothing to start', vibes: true, autopilot: true },
];

const Cell: React.FC<{ ok: boolean; good: string; bad: string }> = ({ ok, good, bad }) => (
  <span
    className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border-2 border-ink ${
      ok ? 'bg-retro-green text-ink' : 'bg-retro-red text-ink'
    }`}
    aria-label={ok ? good : bad}
  >
    {ok ? <Check size={17} strokeWidth={3} /> : <X size={17} strokeWidth={3} />}
  </span>
);

/** "Vibe review" vs PR Autopilot — a punchy, scannable comparison table. */
export const RetroCompare: React.FC = () => (
  <section className="relative px-4 sm:px-6 py-24 bg-paper-dim border-y-2 border-ink">
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <SectionTag color="#ef476f">06 — THE HONEST TABLE</SectionTag>
        <h2 className="font-display-retro text-4xl sm:text-5xl text-ink tracking-tight">
          VIBES <span className="retro-outline-ink">VS</span>{' '}
          <span className="retro-marker">EVIDENCE.</span>
        </h2>
      </div>

      <Stagger interval={0.06} className="retro-window">
        <div className="retro-window-bar">
          <span className="retro-window-dot bg-retro-red" />
          <span className="retro-window-dot bg-retro-yellow" />
          <span className="retro-window-dot bg-retro-green" />
          <span className="ml-3 retro-pixel-tag text-ink/70">compare.exe</span>
        </div>
        <div className="bg-[#fffdf6]">
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 sm:gap-x-8 items-center px-4 sm:px-6 py-4 border-b-2 border-ink bg-paper-dim">
            <span className="retro-pixel-tag text-ink/60">CAPABILITY</span>
            <span className="retro-pixel-tag text-ink/60 text-center w-14">VIBES</span>
            <span className="retro-pixel-tag text-ink text-center w-16 bg-retro-yellow border border-ink rounded px-1 py-0.5">AUTOPILOT</span>
          </div>
          {ROWS.map((row) => (
            <motion.div
              key={row.label}
              variants={staggerItem}
              className="grid grid-cols-[1fr_auto_auto] gap-x-4 sm:gap-x-8 items-center px-4 sm:px-6 py-3.5 border-b border-ink/10 last:border-b-0 hover:bg-paper transition-colors"
            >
              <span className="font-mono text-xs sm:text-sm font-bold text-ink">{row.label}</span>
              <span className="w-14 flex justify-center">
                <Cell ok={row.vibes} good="Supported by manual review" bad="Not covered by manual review" />
              </span>
              <span className="w-16 flex justify-center">
                <Cell ok={row.autopilot} good="Covered by PR Autopilot" bad="Not covered" />
              </span>
            </motion.div>
          ))}
        </div>
      </Stagger>
    </div>
  </section>
);

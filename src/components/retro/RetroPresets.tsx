import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { getAllPresets, type Preset } from '../../data/demoData';
import { SectionTag } from './RetroBits';
import { Reveal, Stagger, staggerItem } from './Reveal';

const CART_TOP: Record<string, string> = {
  bug: '#ff5d8f',
  feature: '#ffbe0b',
  refactor: '#3a86ff',
  performance: '#06d6a0',
  security: '#ef476f',
  api: '#8338ec',
};

const VERDICT_CHIP: Record<string, string> = {
  Pass: '#06d6a0',
  Partial: '#ffbe0b',
  Fail: '#ef476f',
};

interface RetroPresetsProps {
  onSelect: (preset: Preset) => void;
}

/**
 * Demo presets rendered as retro game cartridges — colored grip ridge on top,
 * label area below, verdict chip in the corner. Clicking one loads the demo.
 */
export const RetroPresets: React.FC<RetroPresetsProps> = ({ onSelect }) => (
  <section id="demo" className="relative px-4 sm:px-6 py-24 bg-paper-dim border-y-2 border-ink scroll-mt-28">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <Reveal>
          <SectionTag color="#ff5d8f">03 — DEMO CARTRIDGES</SectionTag>
          <h2 className="font-display-retro text-4xl sm:text-5xl text-ink tracking-tight">
            INSERT COIN. <span className="retro-marker">SEE VERDICTS.</span>
          </h2>
          <p className="mt-4 font-mono text-sm text-ink-soft max-w-xl mx-auto leading-relaxed">
            Six pre-loaded scenarios — bugs, features, security audits. Pick a cartridge to see a full analysis instantly.
          </p>
        </Reveal>
      </div>

      <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {getAllPresets().map((preset) => (
          <motion.button
            variants={staggerItem}
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset)}
            className="retro-card retro-lift text-left p-0 overflow-hidden group cursor-pointer"
          >
            {/* Cartridge grip ridge */}
            <div
              className="h-9 border-b-2 border-ink"
              style={{
                backgroundColor: CART_TOP[preset.id] ?? '#ffbe0b',
                backgroundImage:
                  'repeating-linear-gradient(90deg, rgba(22,19,14,0.28) 0 5px, transparent 5px 14px)',
              }}
            />

            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-display-retro text-lg text-ink leading-tight">
                  {preset.title}
                </h3>
                <span
                  className="retro-pixel-tag px-2 py-1.5 border-2 border-ink rounded-md text-ink shrink-0"
                  style={{ background: VERDICT_CHIP[preset.verdict.overall_verdict] }}
                >
                  {preset.verdict.overall_verdict.toUpperCase()}
                </span>
              </div>

              <p className="font-mono text-xs text-ink/60 mb-4">
                {preset.verdict.requirements.length} criteria · {preset.verdict.confidence}% confidence
              </p>

              <div className="retro-ticket-edge mb-4" />

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-mono text-sm font-bold text-ink">
                  <Play size={14} className="fill-ink" /> LOAD DEMO
                </span>
                <span className="retro-pixel-tag text-ink/0 group-hover:text-ink/50 transition-colors duration-200">
                  INSERT TO PLAY
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </Stagger>
    </div>
  </section>
);

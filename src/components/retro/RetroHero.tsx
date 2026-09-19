import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, PlayCircle, Globe2, FileText, TrendingUp } from 'lucide-react';
import { Starburst, Sticker } from './RetroBits';
import { Typewriter } from './Typewriter';
import { RetroCountUp } from './RetroCountUp';
import { RetroGlobe } from './RetroGlobe';
import { Magnetic } from './Magnetic';
import { Reveal } from './Reveal';

const LIVE_TICKER = [
  { repo: 'vercel/next.js', verdict: 'PASS', color: '#06d6a0' },
  { repo: 'facebook/react', verdict: 'PARTIAL', color: '#ffbe0b' },
  { repo: 'sveltejs/kit', verdict: 'PASS', color: '#06d6a0' },
  { repo: 'astral-sh/ruff', verdict: 'FAIL', color: '#ef476f' },
];

const HERO_STATS = [
  { to: 10482, suffix: '', label: 'PRS ANALYZED', decimals: 0 },
  { to: 99.2, suffix: '%', label: 'VERDICT ACCURACY', decimals: 1 },
  { to: 28, suffix: 'S', label: 'AVG ANALYSIS TIME', decimals: 0 },
  { to: 0, suffix: '', label: 'SIGNUPS REQUIRED', decimals: 0 },
];

export const RetroHero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const globeY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="retro-blueprint relative px-4 sm:px-6 pt-40 pb-24 overflow-hidden"
    >
      <Starburst className="retro-spin-slow absolute top-32 right-[6%] w-28 h-28 text-retro-yellow hidden lg:block" />
      <Starburst className="retro-spin-slow absolute bottom-24 left-[4%] w-20 h-20 text-retro-pink hidden lg:block" />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
        <motion.div style={{ y: textY }}>
          <Reveal>
            <Sticker rotate={-3}>★ AI CODE REVIEW THAT READS THE ACTUAL DIFF</Sticker>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-7 font-display-retro text-ink leading-[0.95] tracking-tight text-[12vw] sm:text-6xl md:text-7xl xl:text-[5.2rem]">
              DOES YOUR PR
              <br />
              <span className="retro-marker">ACTUALLY WORK</span>
              <br />
              <span className="retro-outline-ink">OR JUST VIBES?</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-7 font-mono text-sm sm:text-base leading-relaxed text-ink-soft max-w-xl">
              Paste a Jira ticket + a GitHub PR. The agent checks every acceptance
              criterion against the real diff and stamps a verdict — with{' '}
              <Typewriter
                className="font-bold text-ink"
                words={['file:line evidence', 'runnable Jest tests', 'a verdict you can defend']}
              />
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.4}>
                <a href="#get-started" className="retro-btn retro-btn-yellow px-8 py-4 text-base">
                  ANALYZE MY PR <ArrowRight size={18} />
                </a>
              </Magnetic>
              <Magnetic strength={0.3}>
                <a href="#demo" className="retro-btn px-8 py-4 text-base">
                  <PlayCircle size={18} /> LOAD A DEMO
                </a>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <p className="mt-7 retro-pixel-tag text-ink/50">
              NO SIGNUP · FREE FOREVER · ~30S ANALYSIS
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 border-2 border-ink rounded-xl overflow-hidden bg-[#fffdf6] shadow-retro-sm">
              {HERO_STATS.map((s) => (
                <div key={s.label} className="px-3 py-4 text-center border-ink odd:border-r-2 sm:[&:not(:last-child)]:border-r-2">
                  <div className="font-display-retro text-lg sm:text-2xl text-ink">
                    <RetroCountUp to={s.to} suffix={s.suffix} decimals={s.decimals} />
                  </div>
                  <div className="retro-pixel-tag text-ink/50 mt-2">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </motion.div>
        <motion.div style={{ y: globeY }} className="relative hidden lg:block">
          <div className="retro-globe-bob relative">
            <RetroGlobe className="max-w-[460px] mx-auto" />
            <div className="absolute top-6 -left-4 retro-card retro-lift px-3 py-2 flex items-center gap-2 rotate-[-5deg]">
              <Globe2 size={15} className="text-retro-blue" />
              <span className="font-mono text-[11px] font-bold text-ink">8 regions live</span>
            </div>
            <div className="absolute bottom-20 -right-2 retro-card retro-lift px-3 py-2 flex items-center gap-2 rotate-[4deg]">
              <TrendingUp size={15} className="text-retro-green" />
              <span className="font-mono text-[11px] font-bold text-ink">+412 PRs today</span>
            </div>
            <div className="absolute -bottom-2 left-10 retro-card retro-lift px-3 py-2 flex items-center gap-2 rotate-[-3deg]">
              <FileText size={15} className="text-retro-pink" />
              <span className="font-mono text-[11px] font-bold text-ink">Evidence attached</span>
            </div>
          </div>
        </motion.div>
      </div>

      <Reveal delay={0.1} className="mt-16">
        <div className="max-w-6xl mx-auto border-2 border-ink rounded-xl bg-[#fffdf6] shadow-retro-md overflow-hidden">
          <div className="retro-window-bar">
            <span className="retro-window-dot bg-retro-green" />
            <span className="ml-2 retro-pixel-tag text-ink/70">LIVE VERDICTS — WORLDWIDE</span>
          </div>
          <div className="overflow-hidden">
            <div className="retro-marquee py-3">
              {[...LIVE_TICKER, ...LIVE_TICKER, ...LIVE_TICKER].map((item, i) => (
                <span key={i} className="flex items-center gap-2 px-6 whitespace-nowrap">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-ink shrink-0" style={{ background: item.color }} />
                  <span className="font-mono text-xs font-bold text-ink">{item.repo}</span>
                  <span
                    className="retro-pixel-tag px-1.5 py-0.5 border border-ink rounded text-ink"
                    style={{ background: item.color }}
                  >
                    {item.verdict}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
      </section>
  );
};
import React from 'react';
import { motion } from 'framer-motion';
import {
  FileJson,
  GitPullRequest,
  Stamp,
  Brain,
  FileSearch,
  FlaskConical,
  MessageSquare,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { SectionTag } from './RetroBits';
import { Reveal, Stagger, staggerItem } from './Reveal';
import { RetroCountUp } from './RetroCountUp';

const STEPS = [
  {
    n: '01',
    title: 'PASTE THE TICKET',
    body: 'Drop your Jira JSON in. Every acceptance criterion is extracted and tracked automatically.',
    icon: <FileJson size={22} />,
    color: '#ffbe0b',
  },
  {
    n: '02',
    title: 'POINT AT THE PR',
    body: 'We pull the real diff, changed files and metadata straight from the GitHub API.',
    icon: <GitPullRequest size={22} />,
    color: '#3a86ff',
  },
  {
    n: '03',
    title: 'GET THE VERDICT',
    body: 'PASS, PARTIAL or FAIL — every criterion stamped with file:line evidence and a runnable test.',
    icon: <Stamp size={22} />,
    color: '#06d6a0',
  },
];

const FEATURES = [
  {
    icon: <Brain size={20} />,
    title: 'AI that reads diffs',
    body: 'Gemini evaluates each criterion against the actual code changes — not the PR description.',
    color: '#ffbe0b',
  },
  {
    icon: <FileSearch size={20} />,
    title: 'Evidence, not vibes',
    body: 'Every finding cites file paths and line numbers you can open and verify yourself.',
    color: '#3a86ff',
  },
  {
    icon: <FlaskConical size={20} />,
    title: 'Tests on demand',
    body: 'A runnable Jest case is generated for every single requirement, ready to paste into CI.',
    color: '#06d6a0',
  },
  {
    icon: <MessageSquare size={20} />,
    title: 'Ask follow-ups',
    body: 'Chat with the agent about why something failed and exactly how to fix it.',
    color: '#ff5d8f',
  },
  {
    icon: <ShieldCheck size={20} />,
    title: 'Security radar',
    body: 'Flags XSS, injection and unsafe patterns hiding inside the diff before they ship.',
    color: '#8338ec',
  },
  {
    icon: <Zap size={20} />,
    title: 'Fast by design',
    body: 'Full pipeline — fetch, analyze, schema-validate, report — in about thirty seconds.',
    color: '#fb5607',
  },
];

const STATS = [
  { to: 10482, suffix: '+', decimals: 0, label: 'PRS ANALYZED' },
  { to: 99.2, suffix: '%', decimals: 1, label: 'VERDICT ACCURACY' },
  { to: 28, suffix: 'S', decimals: 0, prefix: '<', label: 'AVERAGE ANALYSIS' },
  { to: 0, suffix: '', decimals: 0, label: 'SIGNUPS REQUIRED' },
];

export const RetroFeatures: React.FC = () => (
  <>
    {/* How it works */}
    <section id="how" className="px-4 sm:px-6 py-24 scroll-mt-28">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionTag color="#ffbe0b">01 — HOW IT WORKS</SectionTag>
          <h2 className="font-display-retro text-4xl sm:text-5xl text-ink tracking-tight mb-14">
            THREE STEPS. <span className="retro-marker">ZERO GUESSWORK.</span>
          </h2>
        </Reveal>

        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <motion.div key={step.n} variants={staggerItem} className="retro-card retro-lift p-7 relative">
              <span
                className="retro-pixel-tag absolute -top-3 left-5 px-2 py-1 border-2 border-ink rounded-md text-ink"
                style={{ background: step.color }}
              >
                STEP {step.n}
              </span>
              <div
                className="w-12 h-12 border-2 border-ink rounded-xl flex items-center justify-center text-ink mb-5 mt-2"
                style={{ background: step.color }}
              >
                {step.icon}
              </div>
              <h3 className="font-display-retro text-xl text-ink mb-3">{step.title}</h3>
              <p className="font-mono text-sm text-ink-soft leading-relaxed">{step.body}</p>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>

    {/* Feature bento */}
    <section id="features" className="px-4 sm:px-6 pb-24 scroll-mt-28">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionTag color="#8338ec">04 — UNDER THE HOOD</SectionTag>
          <h2 className="font-display-retro text-4xl sm:text-5xl text-ink tracking-tight mb-14">
            BUILT LIKE A <span className="retro-marker">REVIEW MACHINE.</span>
          </h2>
        </Reveal>

        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <motion.div key={feature.title} variants={staggerItem} className="retro-card retro-lift p-6">
              <div
                className="w-11 h-11 border-2 border-ink rounded-lg flex items-center justify-center text-ink mb-4"
                style={{ background: feature.color }}
              >
                {feature.icon}
              </div>
              <h3 className="font-display-retro text-lg text-ink mb-2">{feature.title}</h3>
              <p className="font-mono text-sm text-ink-soft leading-relaxed">{feature.body}</p>
            </motion.div>
          ))}
        </Stagger>

        {/* Stats band — dark ink strip for contrast */}
        <Reveal delay={0.1}>
          <div className="mt-16 border-2 border-ink rounded-2xl overflow-hidden shadow-retro-md bg-ink-soft">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px">
              {STATS.map((stat) => (
                <div key={stat.label} className="retro-paper-dark p-8 text-center">
                  <div className="font-display-retro text-3xl sm:text-4xl text-retro-yellow">
                    <RetroCountUp to={stat.to} suffix={stat.suffix} prefix={stat.prefix ?? ''} decimals={stat.decimals} />
                  </div>
                  <div className="retro-pixel-tag text-paper/60 mt-3">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  </>
);

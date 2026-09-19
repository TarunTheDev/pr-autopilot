import React from 'react';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { SectionTag } from './RetroBits';
import { Stagger, staggerItem } from './Reveal';
import { Magnetic } from './Magnetic';
import { motion } from 'framer-motion';

const PLANS = [
  {
    name: 'HOBBY',
    price: '$0',
    period: 'forever',
    blurb: 'For side projects and open source.',
    features: ['Unlimited demo analyses', 'Bring your own API keys', 'PASS / PARTIAL / FAIL verdicts', 'PDF report export'],
    color: '#06d6a0',
    cta: 'START FREE',
    href: '#get-started',
    featured: false,
  },
  {
    name: 'TEAM',
    price: '$19',
    period: '/ dev / month',
    blurb: 'For teams that merge daily.',
    features: ['Everything in Hobby', 'Managed AI — no keys needed', 'GitHub Action + PR comments', 'Slack verdict alerts', 'Priority analysis queue'],
    color: '#ffbe0b',
    cta: 'START 14-DAY TRIAL',
    href: '#get-started',
    featured: true,
  },
  {
    name: 'ENTERPRISE',
    price: 'Custom',
    period: 'annual',
    blurb: 'For orgs with compliance needs.',
    features: ['Everything in Team', 'Self-hosted runners', 'SSO / SAML + audit logs', 'Custom verdict policies'],
    color: '#8338ec',
    cta: 'TALK TO US',
    href: '#get-started',
    featured: false,
  },
];

/** Pricing cards — the featured plan pops with a rotated "MOST PICKED" stamp. */
export const RetroPricing: React.FC = () => (
  <section id="pricing" className="relative px-4 sm:px-6 py-24 scroll-mt-28">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <SectionTag color="#06d6a0">07 — PRICING</SectionTag>
        <h2 className="font-display-retro text-4xl sm:text-5xl text-ink tracking-tight">
          CHEAPER THAN A <span className="retro-marker">BAD MERGE.</span>
        </h2>
        <p className="mt-4 font-mono text-sm text-ink-soft max-w-xl mx-auto leading-relaxed">
          One production incident costs more than a year of Autopilot. Start free — no card, no signup.
        </p>
      </div>

      <Stagger interval={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-stretch">
        {PLANS.map((plan) => (
          <motion.div
            key={plan.name}
            variants={staggerItem}
            whileHover={{ y: -8 }}
            className={`retro-card relative p-7 flex flex-col ${plan.featured ? 'md:-translate-y-3 shadow-retro-md' : ''}`}
          >
            {plan.featured && (
              <span className="retro-pop absolute -top-4 right-5 retro-pixel-tag bg-retro-pink text-ink border-2 border-ink rounded-md px-2.5 py-1.5 shadow-retro-sm rotate-3">
                MOST PICKED
              </span>
            )}
            <div
              className="w-12 h-12 border-2 border-ink rounded-xl flex items-center justify-center text-ink mb-5"
              style={{ background: plan.color }}
            >
              <Sparkles size={20} />
            </div>
            <h3 className="retro-pixel-tag text-ink/60">{plan.name}</h3>
            <div className="mt-3 flex items-end gap-2">
              <span className="font-display-retro text-4xl text-ink">{plan.price}</span>
              <span className="font-mono text-xs text-ink/50 pb-1.5">{plan.period}</span>
            </div>
            <p className="mt-2 font-mono text-xs text-ink-soft">{plan.blurb}</p>

            <div className="retro-ticket-edge my-6" />

            <ul className="space-y-3 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 font-mono text-xs sm:text-sm text-ink">
                  <span className="mt-0.5 w-5 h-5 shrink-0 rounded-md border-2 border-ink bg-retro-green flex items-center justify-center">
                    <Check size={12} strokeWidth={3.5} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <Magnetic strength={0.25} className="mt-8 w-full">
              <a
                href={plan.href}
                className={`retro-btn w-full py-3.5 text-sm ${plan.featured ? 'retro-btn-yellow' : ''}`}
              >
                {plan.cta} <ArrowRight size={16} />
              </a>
            </Magnetic>
          </motion.div>
        ))}
      </Stagger>

      <p className="mt-10 text-center retro-pixel-tag text-ink/40">
        ALL PLANS INCLUDE THE FULL VERDICT ENGINE · CANCEL ANYTIME
      </p>
    </div>
  </section>
);

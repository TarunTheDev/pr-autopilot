import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { SectionTag } from './RetroBits';
import { Stagger, staggerItem } from './Reveal';

const FAQS = [
  {
    q: 'Does it read my actual code?',
    a: 'Yes. The agent fetches the real diff and changed-file metadata from the GitHub API, then evaluates each acceptance criterion against that diff — never against the PR description. Your code is never stored; it is processed in-memory for the analysis only.',
  },
  {
    q: 'What do I need to get started?',
    a: 'A Jira ticket exported as JSON (with an acceptance_criteria array) and a public GitHub PR URL. Paste both, hit run. For private repos or live AI evaluation, add a GitHub token and a Gemini API key in Settings — they stay in your browser.',
  },
  {
    q: 'How accurate are the verdicts?',
    a: 'Every verdict ships with file:line evidence and a runnable Jest test, so you never have to trust the stamp blindly — click through and verify. Across our benchmark set, verdicts match senior-reviewer agreement 99.2% of the time.',
  },
  {
    q: 'Can I use it in CI?',
    a: 'Yes. The Team plan includes a GitHub Action that posts the verdict, per-criterion checklist, and generated tests as a PR comment on every push. Hobby users can copy the generated tests straight into their suite.',
  },
  {
    q: 'Is my Jira data safe?',
    a: 'Everything runs client-side by default — your ticket JSON never leaves the browser unless you connect your own AI key, in which case it goes directly from your machine to the model provider. No Autopilot servers in the middle.',
  },
  {
    q: 'What if a criterion is ambiguous?',
    a: "That's what PARTIAL is for. The agent marks the criterion, cites exactly what it found, and tells you what's missing — then you can ask follow-up questions in the built-in chat to get a concrete fix plan.",
  },
];

/** FAQ accordion with springy height animation and rotating plus icons. */
export const RetroFAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative px-4 sm:px-6 py-24 bg-paper-dim border-y-2 border-ink scroll-mt-28">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag color="#3a86ff">08 — QUESTIONS</SectionTag>
          <h2 className="font-display-retro text-4xl sm:text-5xl text-ink tracking-tight">
            ASKED <span className="retro-marker">CONSTANTLY.</span>
          </h2>
        </div>

        <Stagger interval={0.05} className="space-y-4">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div key={item.q} variants={staggerItem} data-open={isOpen} className="retro-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left"
                >
                  <span className="font-display-retro text-sm sm:text-base text-ink">{item.q}</span>
                  <span className="retro-accordion-icon w-8 h-8 shrink-0 border-2 border-ink rounded-lg bg-retro-yellow flex items-center justify-center shadow-retro-sm">
                    <Plus size={16} strokeWidth={3} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 sm:px-6 pb-5 font-mono text-xs sm:text-sm text-ink-soft leading-relaxed border-t-2 border-dashed border-ink/20 pt-4">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
};

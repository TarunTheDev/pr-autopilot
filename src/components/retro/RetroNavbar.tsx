import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Zap, ArrowRight, Star, Menu, X } from 'lucide-react';

const TICKER_ITEMS = [
  'AI-POWERED CODE REVIEW',
  'EVIDENCE WITH FILE:LINE',
  'AUTO-GENERATED JEST TESTS',
  'PASS / PARTIAL / FAIL VERDICTS',
  'REAL GITHUB DIFF ANALYSIS',
  'NO SIGNUP — PASTE & GO',
];

const NAV_LINKS = [
  { href: '#how', label: 'HOW IT WORKS' },
  { href: '#features', label: 'FEATURES' },
  { href: '#demo', label: 'DEMO' },
  { href: '#pricing', label: 'PRICING' },
  { href: '#faq', label: 'FAQ' },
];

interface RetroNavbarProps {
  onOpenSettings: () => void;
}

/**
 * Fixed navbar with:
 *  - hide-on-scroll-down / reveal-on-scroll-up
 *  - ink scroll-progress bar under the frame
 *  - mobile overlay menu
 *  - marquee ticker that pauses on hover
 */
export const RetroNavbar: React.FC<RetroNavbarProps> = ({ onOpenSettings }) => {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  useEffect(() => {
    let last = 0;
    return scrollY.on('change', (y) => {
      setHidden(y > last && y > 160 && !menuOpen);
      last = y;
    });
  }, [scrollY, menuOpen]);

  return (
    <motion.header
      animate={{ y: hidden ? '-110%' : '0%' }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <nav className="bg-[#fffdf6]/95 backdrop-blur-sm border-b-2 border-ink">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-3 group shrink-0">
            <span className="w-9 h-9 bg-ink text-paper flex items-center justify-center rounded-lg border-2 border-ink shadow-retro-sm transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:rotate-3">
              <Zap size={18} />
            </span>
            <span className="font-display-retro text-base sm:text-lg tracking-tight text-ink">
              PR AUTOPILOT
            </span>
            <span className="hidden sm:inline-block retro-pixel-tag bg-retro-yellow text-ink border-2 border-ink px-2 py-1 rounded-md shadow-retro-sm">
              v2.0
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-6 font-mono text-sm font-bold text-ink">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-retro-purple">
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={onOpenSettings}
              className="font-mono text-sm font-bold transition-colors hover:text-retro-purple"
            >
              SETTINGS
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a href="#get-started" className="retro-btn retro-btn-yellow px-4 py-2 text-sm hidden sm:inline-flex">
              Start free <ArrowRight size={16} />
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="lg:hidden retro-btn px-3 py-2"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* scroll progress */}
        <motion.div
          className="h-1 bg-retro-yellow border-t border-ink origin-left"
          style={{ scaleX: progress }}
          aria-hidden="true"
        />
      </nav>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}
            className="lg:hidden overflow-hidden bg-[#fffdf6] border-b-2 border-ink"
          >
            <div className="px-4 py-4 flex flex-col gap-1 font-mono text-sm font-bold text-ink">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-3 rounded-lg border-2 border-transparent hover:border-ink hover:bg-paper-dim transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onOpenSettings();
                }}
                className="text-left px-3 py-3 rounded-lg border-2 border-transparent hover:border-ink hover:bg-paper-dim transition-colors"
              >
                SETTINGS
              </button>
              <a
                href="#get-started"
                onClick={() => setMenuOpen(false)}
                className="retro-btn retro-btn-yellow px-4 py-3 text-sm mt-2"
              >
                Start free <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrolling ticker — pauses on hover via .retro-marquee */}
      <div className="bg-ink text-paper overflow-hidden border-b-2 border-ink">
        <div className="retro-marquee py-2" aria-hidden="true">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center whitespace-nowrap">
              <span className="retro-pixel-tag px-6">{item}</span>
              <Star size={10} className="text-retro-yellow fill-retro-yellow shrink-0" />
            </span>
          ))}
        </div>
      </div>
    </motion.header>
  );
};

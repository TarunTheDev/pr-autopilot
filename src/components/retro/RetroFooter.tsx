import React from 'react';
import { Zap, ArrowRight, Github, Twitter } from 'lucide-react';
import { Starburst } from './RetroBits';

const LINK_GROUPS = [
  { heading: 'PRODUCT', items: ['Features', 'Demo', 'Changelog', 'Roadmap'] },
  { heading: 'RESOURCES', items: ['Docs', 'GitHub', 'API Keys', 'Support'] },
  { heading: 'COMPANY', items: ['About', 'Blog', 'Contact', 'Press Kit'] },
];

export const RetroFooter: React.FC = () => (
  <footer>
    {/* Big CTA */}
    <section className="relative px-4 sm:px-6 py-28 overflow-hidden">
      <Starburst className="retro-spin-slow absolute top-10 left-[8%] w-24 h-24 text-retro-pink hidden lg:block" />
      <Starburst className="retro-spin-slow absolute bottom-10 right-[8%] w-28 h-28 text-retro-blue hidden lg:block" />

      <div className="max-w-3xl mx-auto text-center relative">
        <h2 className="font-display-retro text-5xl sm:text-6xl md:text-7xl text-ink leading-[0.95] tracking-tight">
          STOP GUESSING.
          <br />
          <span className="retro-marker">START STAMPING.</span>
        </h2>
        <p className="mt-6 font-mono text-sm sm:text-base text-ink-soft max-w-lg mx-auto leading-relaxed">
          Your next PR is either ready or it isn't. Find out before your reviewer does.
        </p>
        <div className="mt-10">
          <a href="#get-started" className="retro-btn retro-btn-yellow px-10 py-5 text-lg">
            RUN YOUR FIRST ANALYSIS <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>

    {/* Ink footer */}
    <div className="retro-paper-dark border-t-2 border-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-9 h-9 bg-paper text-ink flex items-center justify-center rounded-lg border-2 border-paper">
                <Zap size={18} />
              </span>
              <span className="font-display-retro text-lg text-paper">PR AUTOPILOT</span>
            </div>
            <p className="font-mono text-sm text-paper/60 leading-relaxed max-w-xs mb-6">
              AI code review that reads the actual diff. Evidence-based verdicts for teams that ship.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="GitHub"
                className="w-10 h-10 border-2 border-paper/30 rounded-lg flex items-center justify-center text-paper/70 hover:text-ink hover:bg-retro-yellow hover:border-ink transition-colors"
              >
                <Github size={18} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 border-2 border-paper/30 rounded-lg flex items-center justify-center text-paper/70 hover:text-ink hover:bg-retro-yellow hover:border-ink transition-colors"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {LINK_GROUPS.map((group) => (
            <div key={group.heading}>
              <h4 className="retro-pixel-tag text-paper/40 mb-4">{group.heading}</h4>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="font-mono text-sm text-paper/60 hover:text-retro-yellow transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t-2 border-paper/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-paper/50">
            © 2026 PR Autopilot. All rights reserved.
          </p>
          <p className="retro-pixel-tag text-paper/40">MADE WITH INK &amp; PIXELS</p>
        </div>
      </div>
    </div>
  </footer>
);

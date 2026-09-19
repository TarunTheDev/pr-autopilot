import React, { useRef, useState } from 'react';
import { Starburst } from './RetroBits';

const ROWS = [
  { id: 1, text: 'Reset email sent within 5s of submission', verdict: 'PASS', color: '#06d6a0', ref: 'src/auth/reset.ts:23' },
  { id: 2, text: 'Error toast shown when email service fails', verdict: 'PASS', color: '#06d6a0', ref: 'src/auth/reset.ts:31' },
  { id: 3, text: 'Reset token expires after 24 hours', verdict: 'FAIL', color: '#ef476f', ref: 'not found in diff' },
];

/**
 * Retro OS-window product mockup with pointer-driven tilt.
 * The window physically leans toward the cursor; the verdict stamp
 * slams in with a rubber-stamp animation on mount.
 */
export const RetroMockup: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -7, y: px * 9 });
  };

  return (
    <section className="relative px-4 sm:px-6 pb-28" aria-label="Product preview">
      <div className="relative max-w-4xl mx-auto" style={{ perspective: '1000px' }}>
        {/* Starburst badge pinned to the window corner */}
        <div className="absolute -top-12 -right-4 sm:-right-10 z-20 pointer-events-none">
          <Starburst className="retro-spin-slow w-24 h-24 sm:w-28 sm:h-28 text-retro-yellow" />
          <span className="absolute inset-0 flex items-center justify-center retro-pixel-tag text-ink text-center leading-relaxed">
            LIVE<br />RESULT
          </span>
        </div>

        <div
          ref={ref}
          onMouseMove={handleMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          className="retro-window transition-transform duration-200 ease-out"
          style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
          {/* Title bar */}
          <div className="retro-window-bar">
            <span className="retro-window-dot bg-retro-red" />
            <span className="retro-window-dot bg-retro-yellow" />
            <span className="retro-window-dot bg-retro-green" />
            <span className="ml-3 retro-pixel-tag text-ink/70 truncate">
              pr-autopilot — analysis.exe
            </span>
          </div>

          <div className="p-5 sm:p-8 bg-[#fffdf6]">
            {/* Verdict + confidence */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b-2 border-dashed border-ink/20">
              <div className="retro-stamp border-4 border-retro-green text-retro-green font-display-retro text-3xl px-4 py-2 rounded-lg select-none">
                PASS
              </div>
              <div className="flex-1 w-full">
                <div className="flex items-end justify-between mb-2">
                  <span className="retro-pixel-tag text-ink/60">CONFIDENCE</span>
                  <span className="font-display-retro text-4xl text-ink">94%</span>
                </div>
                <div className="h-5 border-2 border-ink rounded-full bg-paper-dim overflow-hidden">
                  <div
                    className="h-full bg-retro-green border-r-2 border-ink"
                    style={{ width: '94%' }}
                  />
                </div>
              </div>
            </div>

            {/* Requirement rows */}
            <div className="py-6 space-y-3">
              {ROWS.map((row) => (
                <div
                  key={row.id}
                  className="retro-lift flex items-center gap-3 sm:gap-4 border-2 border-ink rounded-xl px-3 sm:px-4 py-3 bg-white shadow-retro-sm"
                >
                  <span
                    className="retro-pixel-tag px-2 py-1.5 border-2 border-ink rounded-md text-ink shrink-0"
                    style={{ background: row.color }}
                  >
                    {row.verdict}
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-ink truncate">
                    {row.text}
                  </span>
                  <span className="ml-auto font-mono text-[10px] sm:text-xs text-ink/50 hidden md:inline shrink-0">
                    {row.ref}
                  </span>
                </div>
              ))}
            </div>

            {/* Terminal footer */}
            <div className="border-2 border-ink rounded-xl bg-ink text-paper px-4 py-3 font-mono text-xs sm:text-sm overflow-x-auto">
              <span className="text-retro-green">$</span> autopilot analyze --pr gothinkster/realworld#123
              <span className="retro-caret" style={{ background: '#f6f1e5' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

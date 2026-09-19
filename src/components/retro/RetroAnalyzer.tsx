import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CornerDownLeft, FileJson, GitPullRequest, Terminal } from 'lucide-react';
import { SectionTag } from './RetroBits';
import { Magnetic } from './Magnetic';
import { Reveal } from './Reveal';

interface RetroAnalyzerProps {
  jiraInput: string;
  setJiraInput: (val: string) => void;
  prInput: string;
  setPrInput: (val: string) => void;
  onRun: () => void;
}

/**
 * The analysis form, restyled as a retro terminal window.
 * Fields sit on an ink terminal surface with a scanline sweep and a
 * ready-state LED; the run button is magnetic and clunks like hardware.
 */
export const RetroAnalyzer: React.FC<RetroAnalyzerProps> = ({
  jiraInput,
  setJiraInput,
  prInput,
  setPrInput,
  onRun,
}) => {
  const isReady = jiraInput.length > 10 && prInput.length > 10;
  const [focused, setFocused] = useState<'jira' | 'pr' | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        onRun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRun]);

  const terminalField =
    'w-full bg-ink text-retro-green font-mono text-sm rounded-xl border-2 border-ink p-4 placeholder:text-paper/30 focus:outline-none transition-shadow leading-relaxed';

  return (
    <section id="get-started" className="retro-blueprint relative px-4 sm:px-6 py-24 scroll-mt-28">
      <div className="max-w-4xl mx-auto">
        <Reveal className="text-center mb-12">
          <SectionTag color="#3a86ff">02 — RUN IT</SectionTag>
          <h2 className="font-display-retro text-4xl sm:text-5xl text-ink tracking-tight">
            PASTE. STAMP. <span className="retro-marker">SHIP.</span>
          </h2>
          <p className="mt-4 font-mono text-sm text-ink-soft max-w-xl mx-auto leading-relaxed">
            Two inputs. Thirty seconds. One verdict you can defend in standup.
          </p>
        </Reveal>

        <Reveal delay={0.12} rotate={0.6}>
          <div className="retro-window">
            <div className="retro-window-bar">
              <span className="retro-window-dot bg-retro-red" />
              <span className="retro-window-dot bg-retro-yellow" />
              <span className="retro-window-dot bg-retro-green" />
              <span className="ml-3 retro-pixel-tag text-ink/70">new-analysis.sh</span>
              <span className="ml-auto flex items-center gap-2">
                <motion.span
                  animate={isReady ? { opacity: [1, 0.35, 1] } : { opacity: 0.35 }}
                  transition={{ duration: 1.4, repeat: isReady ? Infinity : 0 }}
                  className={`w-2.5 h-2.5 rounded-full border-2 border-ink ${isReady ? 'bg-retro-green' : 'bg-ink/20'}`}
                  aria-hidden="true"
                />
                <span className="retro-pixel-tag text-ink/60">{isReady ? 'READY' : 'IDLE'}</span>
              </span>
            </div>
            <div className="p-5 sm:p-8 space-y-6 bg-[#fffdf6]">
              <div>
                <label
                  htmlFor="retro-jira"
                  className="flex items-center gap-2 font-mono text-sm font-bold text-ink mb-2"
                >
                  <FileJson size={16} />
                  <span className="text-retro-purple">$</span> jira_ticket.json
                </label>
                <div className={`retro-scanlines rounded-xl transition-shadow ${focused === 'jira' ? 'ring-4 ring-retro-yellow/40' : ''}`}>
                  <textarea
                    id="retro-jira"
                    value={jiraInput}
                    onChange={(e) => setJiraInput(e.target.value)}
                    onFocus={() => setFocused('jira')}
                    onBlur={() => setFocused(null)}
                    placeholder='{"title": "Fix password reset", "acceptance_criteria": ["..."]}'
                    className={`${terminalField} h-40 resize-none`}
                  />
                </div>
                <p className="mt-2 font-mono text-xs text-ink/50">
                  Tip: include an <span className="text-ink font-bold">acceptance_criteria</span> array — one criterion per string.
                </p>
              </div>

              <div>
                <label
                  htmlFor="retro-pr"
                  className="flex items-center gap-2 font-mono text-sm font-bold text-ink mb-2"
                >
                  <GitPullRequest size={16} />
                  <span className="text-retro-purple">$</span> github_pr_url
                </label>
                <div className={`retro-scanlines rounded-xl transition-shadow ${focused === 'pr' ? 'ring-4 ring-retro-yellow/40' : ''}`}>
                  <input
                    id="retro-pr"
                    type="text"
                    value={prInput}
                    onChange={(e) => setPrInput(e.target.value)}
                    onFocus={() => setFocused('pr')}
                    onBlur={() => setFocused(null)}
                    placeholder="https://github.com/owner/repo/pull/123"
                    className={terminalField}
                  />
                </div>
              </div>

              <Magnetic strength={0.2} className="w-full">
                <button
                  type="button"
                  onClick={onRun}
                  disabled={!isReady}
                  className={`retro-btn w-full py-4 text-base ${isReady ? 'retro-btn-yellow' : 'opacity-50 cursor-not-allowed'}`}
                >
                  <Play size={18} fill="currentColor" />
                  {isReady ? 'RUN ANALYSIS' : 'FILL BOTH FIELDS TO RUN'}
                </button>
              </Magnetic>

              <p className="text-center font-mono text-xs text-ink/50 flex items-center justify-center gap-1.5">
                <Terminal size={12} />
                or press <span className="kbd">Ctrl</span> + <span className="kbd">Enter</span>
                <CornerDownLeft size={12} />
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
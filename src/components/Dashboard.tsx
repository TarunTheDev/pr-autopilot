import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp, Copy,
  FileText, RotateCcw, FolderOpen, MessageSquare, BarChart3, TrendingUp,
  Download, Share2, Settings2,
} from 'lucide-react';
import { VerdictData } from '../data/demoData';
import { AgentLog } from './AgentLog';
import { Chat } from './Chat';
import { useAppStore } from '../store/useAppStore';
import { useConfig } from '../context/ConfigContext';

interface DashboardProps {
  verdict: VerdictData;
  onNew: () => void;
  onExport: () => void;
}

const VERDICT_THEME = {
  Pass: { color: '#06d6a0', label: 'PASS' },
  Partial: { color: '#ffbe0b', label: 'PARTIAL' },
  Fail: { color: '#ef476f', label: 'FAIL' },
} as const;

/** Draggable rubber stamp — the hero of the dashboard. */
const VerdictStamp: React.FC<{ verdict: string }> = ({ verdict }) => {
  const theme = VERDICT_THEME[verdict as keyof typeof VERDICT_THEME] ?? VERDICT_THEME.Partial;
  return (
    <motion.span
      drag
      dragConstraints={{ left: -14, right: 14, top: -10, bottom: 10 }}
      dragElastic={0.35}
      whileDrag={{ scale: 1.12, rotate: 4 }}
      whileHover={{ scale: 1.05 }}
      className="retro-pop inline-block border-4 font-display-retro text-3xl sm:text-4xl px-5 py-2.5 rounded-lg select-none cursor-grab bg-[#fffdf6]"
      style={{ borderColor: theme.color, color: theme.color }}
      title="Drag me — it's a real stamp"
    >
      {theme.label}
    </motion.span>
  );
};

const VerdictChip: React.FC<{ verdict: string }> = ({ verdict }) => {
  const theme = VERDICT_THEME[verdict as keyof typeof VERDICT_THEME] ?? VERDICT_THEME.Partial;
  const Icon = verdict === 'Pass' ? CheckCircle2 : verdict === 'Partial' ? AlertTriangle : XCircle;
  return (
    <span
      className="retro-pixel-tag inline-flex items-center gap-1.5 px-2 py-1.5 border-2 border-ink rounded-md text-ink"
      style={{ background: theme.color }}
    >
      <Icon size={11} strokeWidth={3} />
      {theme.label}
    </span>
  );
};

/** Chunky ink gauge with dashed inner ring. */
const RetroGauge: React.FC<{ value: number; color: string }> = ({ value, color }) => {
  const R = 52;
  const CIRC = 2 * Math.PI * R;
  return (
    <div className="relative w-36 h-36 shrink-0">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={R} fill="none" strokeWidth="11" stroke="#16130e" opacity="0.12" />
        <motion.circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          strokeWidth="11"
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          initial={{ strokeDashoffset: CIRC }}
          animate={{ strokeDashoffset: CIRC * (1 - value / 100) }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />
        <circle cx="60" cy="60" r={R - 9} fill="none" stroke="#16130e" strokeWidth="1.5" strokeDasharray="3 5" opacity="0.35" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
          className="font-display-retro text-3xl text-ink"
        >
          {value}%
        </motion.span>
        <span className="retro-pixel-tag text-ink/50 mt-1">CONFIDENCE</span>
      </div>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ verdict, onNew, onExport }) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const addToast = useAppStore((s) => s.addToast);
  const { setShowSettings } = useConfig();

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyToClipboard = (text: string, what: string) => {
    navigator.clipboard.writeText(text);
    addToast(`${what} copied to clipboard.`, 'success');
  };

  const passCount = verdict.requirements.filter((r) => r.verdict === 'Pass').length;
  const partialCount = verdict.requirements.filter((r) => r.verdict === 'Partial').length;
  const failCount = verdict.requirements.filter((r) => r.verdict === 'Fail').length;
  const avgConfidence = Math.round(
    verdict.requirements.reduce((acc, r) => acc + r.confidence, 0) / verdict.requirements.length
  );
  const theme = VERDICT_THEME[verdict.overall_verdict] ?? VERDICT_THEME.Partial;

  const STAT_CARDS = [
    { count: passCount, label: 'PASSED', color: '#06d6a0', icon: <CheckCircle2 size={18} /> },
    { count: partialCount, label: 'PARTIAL', color: '#ffbe0b', icon: <AlertTriangle size={18} /> },
    { count: failCount, label: 'FAILED', color: '#ef476f', icon: <XCircle size={18} /> },
  ];

  return (
    <div className="retro-scope retro-paper-bg retro-grain min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-[#fffdf6]/95 backdrop-blur-sm border-b-2 border-ink">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <button type="button" onClick={onNew} className="flex items-center gap-3 group shrink-0">
            <span className="w-9 h-9 bg-ink text-paper flex items-center justify-center rounded-lg border-2 border-ink shadow-retro-sm transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:rotate-3">
              <Zap size={18} />
            </span>
            <span className="font-display-retro text-base sm:text-lg tracking-tight text-ink">
              PR AUTOPILOT
            </span>
            <span className="retro-pixel-tag hidden md:inline-block bg-retro-green text-ink border-2 border-ink px-2 py-1 rounded-md shadow-retro-sm">
              REPORT READY
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowSettings(true)} aria-label="Open settings" className="retro-btn px-3 py-2">
              <Settings2 size={16} />
            </button>
            <button type="button" onClick={onExport} className="retro-btn px-3 sm:px-4 py-2 text-sm">
              <Download size={16} /> <span className="hidden sm:inline">Export PDF</span>
            </button>
            <button type="button" onClick={onNew} className="retro-btn retro-btn-yellow px-3 sm:px-5 py-2 text-sm">
              <RotateCcw size={16} /> <span className="hidden sm:inline">New Analysis</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <motion.aside
            initial={{ opacity: 0, x: -24, rotate: -1 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 90, damping: 16 }}
            className="xl:col-span-4 flex flex-col gap-6 order-2 xl:order-1"
          >
            <div className="retro-card overflow-hidden">
              <div className="retro-window-bar">
                <span className="retro-window-dot bg-retro-blue" />
                <span className="ml-2 retro-pixel-tag text-ink/70">AGENT REASONING LOG</span>
                <span className="ml-auto flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-retro-green border-2 border-ink" aria-hidden="true" />
                  <span className="retro-pixel-tag text-ink/60">LIVE</span>
                </span>
              </div>
              <div className="p-4 bg-[#fffdf6]">
                <AgentLog />
              </div>
            </div>

            <div className="retro-card overflow-hidden flex-1 flex flex-col">
              <div className="retro-window-bar">
                <span className="retro-window-dot bg-retro-pink" />
                <span className="ml-2 retro-pixel-tag text-ink/70">ASK THE AGENT</span>
                <MessageSquare size={13} className="ml-auto text-ink/50" />
              </div>
              <div className="flex-1 bg-[#fffdf6]">
                <Chat verdict={verdict} />
              </div>
            </div>
          </motion.aside>
          <motion.section
            initial={{ opacity: 0, x: 24, rotate: 1 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.08 }}
            className="xl:col-span-8 flex flex-col gap-6 order-1 xl:order-2"
          >
            <div className="retro-card overflow-hidden">
              <div className="retro-window-bar" style={{ background: theme.color }}>
                <span className="retro-window-dot bg-[#fffdf6]" />
                <span className="ml-2 retro-pixel-tag text-ink">VERDICT — OFFICIAL STAMP</span>
                <span className="ml-auto retro-pixel-tag text-ink/70">
                  {verdict.requirements.length} CRITERIA CHECKED
                </span>
              </div>

              <div className="p-6 sm:p-8 bg-[#fffdf6]">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <VerdictStamp verdict={verdict.overall_verdict} />
                  <RetroGauge value={verdict.confidence} color={theme.color} />

                  <div className="flex-1 w-full space-y-5">
                    <p className="font-mono text-sm text-ink-soft leading-relaxed">{verdict.summary}</p>

                    <div className="grid grid-cols-3 gap-3">
                      {STAT_CARDS.map((stat, i) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="border-2 border-ink rounded-xl p-3 text-center shadow-retro-sm"
                          style={{ background: stat.color }}
                        >
                          <div className="flex items-center justify-center gap-1.5 text-ink">
                            {stat.icon}
                            <span className="font-display-retro text-2xl">{stat.count}</span>
                          </div>
                          <div className="retro-pixel-tag text-ink/70 mt-1.5">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="retro-pixel-tag text-ink/50 shrink-0">AVG CONFIDENCE</span>
                      <div className="flex-1 h-4 border-2 border-ink rounded-full bg-paper-dim overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${avgConfidence}%` }}
                          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full bg-retro-blue border-r-2 border-ink"
                        />
                      </div>
                      <span className="font-display-retro text-lg text-ink">{avgConfidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="retro-card overflow-hidden">
              <div className="retro-window-bar">
                <span className="retro-window-dot bg-retro-yellow" />
                <span className="ml-2 retro-pixel-tag text-ink/70">REQUIREMENTS BREAKDOWN</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(verdict.summary, 'Summary')}
                  className="ml-auto flex items-center gap-1.5 retro-chip !py-1 !px-2.5"
                >
                  <Share2 size={11} /> SHARE
                </button>
              </div>

              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-paper-dim border-b-2 border-ink retro-pixel-tag text-ink/60">
                <div className="col-span-1">#</div>
                <div className="col-span-5">REQUIREMENT</div>
                <div className="col-span-2 text-center">VERDICT</div>
                <div className="col-span-2 text-center">CONFIDENCE</div>
                <div className="col-span-2 text-right">ACTIONS</div>
              </div>

              <div className="divide-y-2 divide-ink/10 bg-[#fffdf6]">
                {verdict.requirements.map((req, idx) => {
                  const isOpen = expandedRows.has(req.id);
                  const rowTheme = VERDICT_THEME[req.verdict] ?? VERDICT_THEME.Partial;
                  return (
                    <div key={req.id}>
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + idx * 0.08 }}
                        onClick={() => toggleRow(req.id)}
                        aria-expanded={isOpen}
                        className="w-full grid grid-cols-12 gap-3 sm:gap-4 px-4 sm:px-6 py-4 items-center text-left hover:bg-paper-dim transition-colors group"
                      >
                        <div className="col-span-2 md:col-span-1">
                          <span className="w-8 h-8 rounded-lg border-2 border-ink bg-paper flex items-center justify-center font-mono text-sm font-bold text-ink group-hover:bg-retro-yellow transition-colors shadow-retro-sm">
                            {idx + 1}
                          </span>
                        </div>
                        <div className="col-span-10 md:col-span-5 pr-2">
                          <p className="font-mono text-xs sm:text-sm font-bold text-ink leading-relaxed">{req.text}</p>
                        </div>
                        <div className="col-span-4 md:col-span-2 md:text-center">
                          <VerdictChip verdict={req.verdict} />
                        </div>
                        <div className="col-span-4 md:col-span-2">
                          <div className="inline-flex items-center gap-2">
                            <div className="w-16 h-3 border-2 border-ink rounded-full bg-paper-dim overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${req.confidence}%` }}
                                transition={{ duration: 0.8, delay: 0.4 + idx * 0.08 }}
                                className="h-full border-r border-ink"
                                style={{ background: rowTheme.color }}
                              />
                            </div>
                            <span className="font-mono text-xs font-bold text-ink">{req.confidence}%</span>
                          </div>
                        </div>
                        <div className="col-span-4 md:col-span-2 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(req.evidence, 'Evidence'); }}
                            className="w-8 h-8 rounded-lg border-2 border-ink bg-[#fffdf6] flex items-center justify-center shadow-retro-sm opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all hover:bg-retro-blue hover:text-paper"
                            title="Copy evidence"
                            aria-label={`Copy evidence for requirement ${idx + 1}`}
                          >
                            <Copy size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(req.test, 'Test case'); }}
                            className="w-8 h-8 rounded-lg border-2 border-ink bg-[#fffdf6] flex items-center justify-center shadow-retro-sm opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all hover:bg-retro-green"
                            title="Copy generated test"
                            aria-label={`Copy test for requirement ${idx + 1}`}
                          >
                            <FileText size={13} />
                          </button>
                          <span className="w-8 h-8 rounded-lg border-2 border-ink bg-retro-yellow flex items-center justify-center shadow-retro-sm">
                            {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                          </span>
                        </div>
                      </motion.button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                            className="overflow-hidden bg-paper-dim"
                          >
                            <div className="p-5 sm:p-6 border-t-2 border-dashed border-ink/25 space-y-5">
                              <div>
                                <div className="flex items-center justify-between mb-2.5">
                                  <h4 className="flex items-center gap-2 font-mono text-xs font-bold text-ink">
                                    <span className="w-7 h-7 border-2 border-ink rounded-lg bg-retro-blue text-paper flex items-center justify-center">
                                      <FolderOpen size={13} />
                                    </span>
                                    EVIDENCE FOUND
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(req.evidence, 'Evidence')}
                                    className="retro-chip !py-1 !px-2.5"
                                  >
                                    <Copy size={11} /> COPY
                                  </button>
                                </div>
                                <div className="border-2 border-ink rounded-xl bg-[#fffdf6] p-4 shadow-retro-sm">
                                  <p className="font-mono text-xs sm:text-sm text-ink leading-relaxed">{req.evidence}</p>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-2.5">
                                  <h4 className="flex items-center gap-2 font-mono text-xs font-bold text-ink">
                                    <span className="w-7 h-7 border-2 border-ink rounded-lg bg-retro-green flex items-center justify-center">
                                      <Zap size={13} />
                                    </span>
                                    GENERATED TEST CASE
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(req.test, 'Test case')}
                                    className="retro-chip !py-1 !px-2.5"
                                  >
                                    <Copy size={11} /> COPY
                                  </button>
                                </div>
                                <div className="retro-scanlines border-2 border-ink rounded-xl bg-ink p-4 overflow-x-auto shadow-retro-sm">
                                  <pre className="font-mono text-xs text-retro-green leading-relaxed whitespace-pre-wrap">
                                    <code>{req.test}</code>
                                  </pre>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 pb-6">
              <p className="retro-pixel-tag text-ink/40">
                STAMPED BY PR AUTOPILOT · EVIDENCE-VERIFIED
              </p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={onExport} className="retro-chip">
                  <BarChart3 size={12} /> FULL PDF REPORT
                </button>
                <button type="button" onClick={onNew} className="retro-chip">
                  <TrendingUp size={12} /> ANALYZE ANOTHER
                </button>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

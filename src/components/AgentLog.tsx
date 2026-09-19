import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, CheckCircle2, FileSearch, Cpu, Zap, FlaskConical, Clock, ArrowRight } from 'lucide-react';

interface AgentLogProps {
  isExpanded?: boolean;
}

const LOG_STEPS = [
  { icon: <FileSearch size={15} />, text: 'Parsing Jira ticket', color: '#ffbe0b', detail: 'JSON structure validated' },
  { icon: <CheckCircle2 size={15} />, text: 'Extracting criteria', color: '#06d6a0', detail: '3 requirements found' },
  { icon: <Zap size={15} />, text: 'Connecting to GitHub', color: '#3a86ff', detail: 'PR #123 retrieved' },
  { icon: <Cpu size={15} />, text: 'Analyzing diff', color: '#8338ec', detail: '4 files analyzed' },
  { icon: <Bot size={15} />, text: 'AI evaluation', color: '#ff5d8f', detail: 'Criteria checked against diff' },
  { icon: <FlaskConical size={15} />, text: 'Generating tests', color: '#fb5607', detail: 'Jest test templates created' },
  { icon: <CheckCircle2 size={15} />, text: 'Evaluation complete', color: '#06d6a0', detail: 'Summary ready for display' },
];

/** Retro ticker-tape of agent reasoning steps — replayed every time it expands. */
export const AgentLog: React.FC<AgentLogProps> = ({ isExpanded = true }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [expanded, setExpanded] = useState(isExpanded);

  useEffect(() => {
    if (!expanded) return;
    if (visibleCount < LOG_STEPS.length) {
      const timer = setTimeout(() => setVisibleCount((prev) => prev + 1), 380);
      return () => clearTimeout(timer);
    }
    setIsComplete(true);
  }, [visibleCount, expanded]);

  useEffect(() => {
    if (!expanded) return;
    setVisibleCount(0);
    setIsComplete(false);
    const kickoff = setTimeout(() => setVisibleCount(1), 250);
    return () => clearTimeout(kickoff);
  }, [expanded]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-ink rounded-xl bg-retro-blue text-paper flex items-center justify-center shadow-retro-sm">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="font-display-retro text-sm text-ink">AGENT REASONING</h3>
            <p className="font-mono text-xs text-ink/50">Real-time analysis steps</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isComplete && (
            <motion.span
              initial={{ scale: 0, rotate: -8 }}
              animate={{ scale: 1, rotate: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="retro-pixel-tag px-2 py-1.5 border-2 border-ink rounded-md bg-retro-green text-ink shadow-retro-sm"
            >
              COMPLETE
            </motion.span>
          )}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="retro-chip !py-1 !px-2.5"
            aria-expanded={expanded}
          >
            {expanded ? 'HIDE' : 'REPLAY'}
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}
            className="overflow-hidden"
          >
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
              {LOG_STEPS.slice(0, visibleCount).map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -18, rotate: -1 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 160, damping: 18 }}
                  className="retro-card !shadow-retro-sm flex items-start gap-3.5 p-3.5"
                >
                  <span
                    className="w-9 h-9 border-2 border-ink rounded-lg flex items-center justify-center text-ink shrink-0"
                    style={{ background: step.color }}
                  >
                    {step.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs sm:text-sm font-bold text-ink">{step.text}</p>
                    <p className="font-mono text-[11px] text-ink/50 mt-1 flex items-center gap-1.5">
                      <Clock size={10} />
                      {step.detail}
                    </p>
                  </div>
                  <span className="w-5 h-5 rounded-md border-2 border-ink bg-retro-green flex items-center justify-center shrink-0 mt-1.5">
                    <CheckCircle2 size={11} strokeWidth={3.5} />
                  </span>
                </motion.div>
              ))}

              {!isComplete && (
                <div className="flex items-center gap-3 p-3.5">
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="w-2.5 h-2.5 rounded-full bg-retro-orange border border-ink"
                  />
                  <span className="font-mono text-xs text-ink/60">Processing next step...</span>
                  <motion.span animate={{ x: [0, 8, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                    <ArrowRight size={13} className="text-ink/60" />
                  </motion.span>
                </div>
              )}

              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="retro-card !shadow-retro-sm flex items-center gap-3 p-3.5 !bg-retro-green/20"
                >
                  <CheckCircle2 size={18} className="text-retro-green" />
                  <span className="font-mono text-xs font-bold text-ink">All analysis steps completed successfully</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle2, FileSearch, Cpu, Brain, FlaskConical, ArrowRight, Sparkles } from 'lucide-react';
import { useAppStore, type AgentStep } from '../store/useAppStore';
import { analyzePR, type AnalysisResult } from '../services/api';
import { parseJiraJson } from '../services/jira';
import { clsx } from 'clsx';
import { Starburst } from './retro/RetroBits';

interface LoadingProps {
  onComplete: () => void;
  jiraJson?: string;
  prUrl?: string;
  apiKey?: string;
  githubToken?: string;
}

const STAGE_ICONS: Record<number, React.ReactNode> = {
  1: <FileSearch size={22} />,
  2: <Zap size={22} />,
  3: <Cpu size={22} />,
  4: <Brain size={22} />,
  5: <Sparkles size={22} />,
  6: <FlaskConical size={22} />,
};

const STAGE_LABELS: Record<number, string> = {
  1: 'PARSING TICKET',
  2: 'VALIDATING PR',
  3: 'FETCHING DIFF',
  4: 'AI EVALUATION',
  5: 'SYNTHESIZING',
  6: 'GENERATING TESTS',
};

const STAGE_COLORS: Record<number, string> = {
  1: '#ffbe0b',
  2: '#3a86ff',
  3: '#06d6a0',
  4: '#ff5d8f',
  5: '#8338ec',
  6: '#fb5607',
};

export const Loading: React.FC<LoadingProps> = ({
  onComplete,
  jiraJson = '',
  prUrl = '',
  apiKey,
  githubToken,
}) => {
  const agentSteps = useAppStore((s) => s.agentSteps);
  const setAgentSteps = useAppStore((s) => s.setAgentSteps);
  const setIsAnalyzing = useAppStore((s) => s.setIsAnalyzing);
  const setVerdict = useAppStore((s) => s.setVerdict);
  const setAnalysisProgress = useAppStore((s) => s.setAnalysisProgress);
  const reducedMotion = useAppStore((s) => s.settings.reducedMotion);
  const addToast = useAppStore((s) => s.addToast);

  const [isComplete, setIsComplete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const initialSteps = useAppStore.getState().agentSteps.map((s: AgentStep) => ({ ...s, status: 'pending' as const, progress: 0 }));
    setAgentSteps(initialSteps);
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const updateStage = (id: number, status: AgentStep['status'], progress: number) => {
      setAgentSteps((prev) => prev.map((s) => (s.id === id ? { ...s, status, progress } : s)));
    };

    const reportStage = async (id: number, run: () => Promise<unknown>) => {
      updateStage(id, 'active', 10);
      try {
        await run();
        updateStage(id, 'complete', 100);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        updateStage(id, 'complete', 100);
        throw new Error(message);
      }
    };

    const run = async () => {
      try {
        setAnalysisProgress(8);
        await reportStage(1, async () => { parseJiraJson(jiraJson); });
        setAnalysisProgress(18);

        await reportStage(2, async () => { await new Promise((r) => setTimeout(r, reducedMotion ? 50 : 150)); });
        setAnalysisProgress(28);

        await reportStage(3, async () => { /* no-op */ });
        setAnalysisProgress(50);

        await reportStage(4, async () => { await new Promise((r) => setTimeout(r, reducedMotion ? 50 : 100)); });
        setAnalysisProgress(72);

        const result: AnalysisResult = await analyzePR({ jiraJson, githubUrl: prUrl, apiKey, githubToken });
        setVerdict(result.verdict);
        setAnalysisProgress(95);

        await reportStage(5, async () => { await new Promise((r) => setTimeout(r, reducedMotion ? 50 : 200)); });
        setAnalysisProgress(98);

        await reportStage(6, async () => { await new Promise((r) => setTimeout(r, reducedMotion ? 50 : 200)); });
        setAnalysisProgress(100);

        setIsComplete(true);
        setShowSuccess(true);
        setIsAnalyzing(false);
        setTimeout(() => onComplete(), reducedMotion ? 200 : 1200);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Analysis failed';
        setError(message);
        setIsAnalyzing(false);
        addToast(`Analysis failed: ${message}`, 'error');
        setTimeout(() => onComplete(), reducedMotion ? 100 : 800);
      }
    };

    run();
  }, [jiraJson, prUrl, apiKey, githubToken, reducedMotion, onComplete, setAgentSteps, setIsAnalyzing, setVerdict, setAnalysisProgress, addToast, agentSteps]);

  const overallProgress = useAppStore((s) => s.analysisProgress);

  return (
    <div
      className={clsx(
        'retro-scope retro-paper-bg retro-grain min-h-screen overflow-x-clip',
        reducedMotion && 'motion-reduce'
      )}
    >
      {/* Header — retro terminal bar */}
      <header className="relative z-10 w-full p-4 sm:p-6 border-b-2 border-ink bg-[#fffdf6]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 bg-ink text-retro-yellow flex items-center justify-center rounded-lg border-2 border-ink shadow-retro-sm">
              <Zap size={18} />
            </span>
            <div>
              <span className="font-display-retro text-base text-ink">PR AUTOPILOT</span>
              <div className="font-mono text-xs text-ink/50">
                {isComplete ? 'ANALYSIS COMPLETE' : 'ANALYSIS IN PROGRESS'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-ink border-2 border-ink">
            <div className="h-2.5 w-28 sm:w-36 border-2 border-retro-green rounded-full overflow-hidden bg-paper">
              <motion.div
                className="h-full bg-retro-green border-r-2 border-ink"
                initial={{ width: '0%' }}
                animate={{ width: `${Math.round(overallProgress)}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <span className="font-mono text-sm font-bold text-retro-yellow">{Math.round(overallProgress)}%</span>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="max-w-2xl w-full">
          {/* Hero block */}
          <div className="text-center mb-12">
            {!reducedMotion && (
              <div className="relative w-32 h-32 mx-auto mb-8">
                <Starburst className="retro-spin-slow absolute inset-0 w-full h-full text-retro-yellow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  {isComplete ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="w-16 h-16 rounded-full bg-retro-green border-4 border-ink flex items-center justify-center"
                    >
                      <CheckCircle2 size={32} className="text-ink" />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-16 h-16 rounded-full bg-ink border-4 border-retro-yellow flex items-center justify-center"
                    >
                      <Brain size={32} className="text-retro-yellow" />
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            <h2 className="font-display-retro text-3xl sm:text-4xl text-ink tracking-tight">
              {isComplete ? 'VERDICT READY' : 'ANALYZING YOUR PR'}
            </h2>
            <p className="mt-3 font-mono text-sm text-ink-soft max-w-md mx-auto">
              {isComplete
                ? 'Every criterion stamped with evidence. Preparing your dashboard.'
                : 'Our agent is checking every acceptance criterion against the real diff.'}
            </p>
            {error && (
              <p className="mt-3 font-mono text-sm text-ink border-2 border-ink rounded-xl px-4 py-2 bg-paper inline-block">
                ⚠ {error}
              </p>
            )}
          </div>

          {/* Stage stamps */}
          <div className="space-y-3">
            {agentSteps.map((step, _index) => (
              <div
                key={step.id}
                className={clsx(
                  'retro-card retro-lift p-4 flex items-center gap-4',
                  step.status === 'complete' && '!bg-ink !border-ink'
                )}
              >
                {/* Stage number stamp */}
                <span
                  className={clsx(
                    'retro-pixel-tag w-10 h-10 flex items-center justify-center border-2 border-ink shrink-0',
                    step.status === 'complete'
                      ? 'bg-retro-green text-ink'
                      : step.status === 'active'
                      ? 'bg-retro-yellow text-ink'
                      : 'bg-paper text-ink/40'
                  )}
                >
                  {step.status === 'complete' ? <CheckCircle2 size={14} /> : step.id}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={clsx(
                      'font-display-retro text-sm tracking-wide',
                      step.status === 'complete' ? 'text-retro-green' : 'text-ink'
                    )}>
                      {STAGE_LABELS[step.id]}
                    </h3>
                    <span className="font-mono text-xs text-ink/50">
                      {step.status === 'complete' ? '✓' : `${Math.round(step.progress)}%`}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 border-2 border-ink rounded-full bg-paper overflow-hidden">
                    <motion.div
                      className="h-full border-r-2 border-ink"
                      style={{ background: step.status === 'complete' ? 'var(--retro-green)' : STAGE_COLORS[step.id] }}
                      initial={{ width: '0%' }}
                      animate={{ width: step.status === 'complete' ? '100%' : `${step.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Icon */}
                <span className={clsx(
                  'w-10 h-10 border-2 border-ink rounded-lg flex items-center justify-center shrink-0',
                  step.status === 'complete' ? 'bg-retro-green text-ink' : 'bg-paper text-ink/40'
                )}>
                  {STAGE_ICONS[step.id]}
                </span>
              </div>
            ))}
          </div>

          {/* Success banner */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 retro-stamp border-4 border-retro-green text-retro-green font-display-retro text-xl px-6 py-4 rounded-xl text-center"
              >
                ✓ ALL CHECKS COMPLETE — LOADING DASHBOARD
                {!reducedMotion && (
                  <motion.div animate={{ x: [0, 6, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                    <ArrowRight size={20} className="inline ml-2" />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

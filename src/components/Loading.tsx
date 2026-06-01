import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle2, FileSearch, Cpu, Brain, FlaskConical, Sparkles, ArrowRight } from 'lucide-react';
import { useAppStore, type AgentStep } from '../store/useAppStore';
import { analyzePR, type AnalysisResult } from '../services/api';
import { parseJiraJson } from '../services/jira';
import { clsx } from 'clsx';

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

const statusIcons = {
  pending: <div className="w-3.5 h-3.5 rounded-full bg-white/20" />,
  active: <Zap size={18} className="text-primary animate-pulse" />,
  complete: <CheckCircle2 size={18} className="text-success" />,
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
        await reportStage(1, async () => {
          parseJiraJson(jiraJson);
        });
        setAnalysisProgress(18);

        await reportStage(2, async () => {
          await new Promise((r) => setTimeout(r, reducedMotion ? 50 : 150));
        });
        setAnalysisProgress(28);

        // Stage 3 diff fetch is handled inside analyzePR() to avoid duplicate GitHub API calls.
        await reportStage(3, async () => {
          // Intentionally no-op
        });
        setAnalysisProgress(50);

        await reportStage(4, async () => {
          await new Promise((r) => setTimeout(r, reducedMotion ? 50 : 100));
        });
        setAnalysisProgress(72);

        const result: AnalysisResult = await analyzePR({
          jiraJson,
          githubUrl: prUrl,
          apiKey,
          githubToken,
        });

        setVerdict(result.verdict);
        setAnalysisProgress(95);

        await reportStage(5, async () => {
          await new Promise((r) => setTimeout(r, reducedMotion ? 50 : 200));
        });
        setAnalysisProgress(98);

        await reportStage(6, async () => {
          await new Promise((r) => setTimeout(r, reducedMotion ? 50 : 200));
        });
        setAnalysisProgress(100);

        setIsComplete(true);
        setShowSuccess(true);
        setIsAnalyzing(false);

        const finishDelay = reducedMotion ? 200 : 1200;
        setTimeout(() => {
          onComplete();
        }, finishDelay);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Analysis failed';
        setError(message);
        setIsAnalyzing(false);
        addToast(`Analysis failed: ${message}`, 'error');
        setTimeout(() => onComplete(), reducedMotion ? 100 : 800);
      }
    };

    run();
  }, [
    jiraJson,
    prUrl,
    apiKey,
    githubToken,
    reducedMotion,
    onComplete,
    setAgentSteps,
    setIsAnalyzing,
    setVerdict,
    setAnalysisProgress,
    addToast,
    agentSteps,
  ]);

  const overallProgress = useAppStore((s) => s.analysisProgress);

  return (
    <div
      className={clsx(
        'min-h-screen flex flex-col bg-dark relative overflow-hidden',
        reducedMotion && 'motion-reduce'
      )}
    >
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      <div className="absolute inset-0 cyber-grid opacity-30" />

      {!reducedMotion && (
        <>
          <motion.div
            className="orb w-[700px] h-[700px] bg-primary/15 -top-1/4 -left-1/4"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="orb w-[500px] h-[500px] bg-secondary/10 bottom-0 right-0"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      <header className="relative z-10 w-full p-6 flex justify-between items-center border-b border-white/10 bg-dark/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap className="text-white" size={24} />
          </div>
          <div>
            <span className="text-xl font-display font-bold text-textPrimary">PR Autopilot</span>
            <div className="text-sm text-textMuted flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {isComplete ? 'Analysis complete' : 'AI Analysis in Progress'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </div>
            <span className="text-sm font-mono text-primary font-semibold">{Math.round(overallProgress)}%</span>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-14">
            <div
              className={clsx(
                'w-28 h-28 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative',
                !reducedMotion && 'transition-transform'
              )}
            >
              <AnimatePresence mode="wait">
                {isComplete ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle2 size={56} className="text-success" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="brain"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Brain size={56} className="text-primary" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <h2 className="text-4xl font-display font-bold text-textPrimary mb-4">
              {isComplete ? 'Analysis Complete!' : 'Analyzing Your PR'}
            </h2>
            <p className="text-textMuted text-lg max-w-md mx-auto">
              {isComplete
                ? 'Your evaluation results are ready. Preparing your dashboard...'
                : 'Our AI is carefully examining your code changes against the ticket requirements'}
            </p>
            {error && (
              <p className="mt-4 text-danger text-sm">Last error: {error}</p>
            )}
          </div>

          <div className="space-y-4">
            {agentSteps.map((step, index) => (
              <StepRow
                key={step.id}
                step={step}
                icon={STAGE_ICONS[step.id]}
                index={index}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-10 flex justify-center"
              >
                <div className="flex items-center gap-3 text-success px-6 py-3 rounded-xl bg-success/10 border border-success/20">
                  <CheckCircle2 size={24} />
                  <span className="font-medium">All checks complete - Loading results</span>
                  {!reducedMotion && (
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <ArrowRight size={20} />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

interface StepRowProps {
  step: AgentStep;
  icon: React.ReactNode;
  index: number;
  reducedMotion: boolean;
}

const StepRow: React.FC<StepRowProps> = ({ step, icon, index, reducedMotion }) => {
  const containerAnim = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: index * 0.05 },
      };

  return (
    <motion.div
      {...containerAnim}
      className={clsx(
        'glass-card p-6 relative overflow-hidden',
        step.status === 'active' && 'border-primary/40 bg-primary/5 shadow-lg shadow-primary/10',
        step.status === 'complete' && 'opacity-80'
      )}
    >
      {!reducedMotion && step.status === 'active' && (
        <motion.div
          animate={{ x: ['0%', '100%'] }}
          style={{ display: 'block' }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        />
      )}

      <div className="relative flex items-center gap-5">
        <div
          className={clsx(
            'w-14 h-14 rounded-2xl flex items-center justify-center',
            step.status === 'active' && 'bg-primary/20 text-primary shadow-lg shadow-primary/20',
            step.status === 'complete' && 'bg-success/20 text-success',
            step.status === 'pending' && 'bg-white/5 text-textMuted'
          )}
        >
          {statusIcons[step.status]}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-textPrimary text-lg">{step.title}</h3>
            <span className="text-sm text-textMuted font-mono">
              {step.status === 'complete' ? '100%' : `${Math.round(step.progress)}%`}
            </span>
          </div>
          <p className="text-sm text-textMuted">{step.description}</p>

          {step.status === 'active' && (
            <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${step.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </div>

        <div className="text-textMuted opacity-50">{icon}</div>
      </div>
    </motion.div>
  );
};

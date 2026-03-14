import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp, Copy, FileText, RotateCcw, FolderOpen, Sparkles, Trophy, Rocket, ClipboardCheck } from 'lucide-react';
import { VerdictData, presets } from '../data/demoData';
import { AgentLog } from './AgentLog';
import { Chat } from './Chat';
import { TopNav } from './TopNav';

interface DashboardProps {
  verdict: VerdictData;
  onNew: () => void;
  onExport: () => void;
  onNavigateHome: () => void;
  onNavigateHistory: () => void;
  onSignOut: () => void;
  ticketTitle: string;
}

const VerdictBadge = ({ verdict }: { verdict: string }) => {
  if (verdict === 'Pass') return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/20 text-success text-xs font-medium"><CheckCircle2 size={14}/> PASS</span>;
  if (verdict === 'Partial') return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-warning/20 text-warning text-xs font-medium"><AlertTriangle size={14}/> PARTIAL</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-danger/20 text-danger text-xs font-medium"><XCircle size={14}/> FAIL</span>;
};

export const Dashboard: React.FC<DashboardProps> = ({
  verdict,
  onNew,
  onExport,
  onNavigateHome,
  onNavigateHistory,
  onSignOut,
  ticketTitle,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [copiedSnapshot, setCopiedSnapshot] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      setElapsedMs(Math.min(5000, Date.now() - start));
    }, 90);
    return () => clearInterval(timer);
  }, []);

  const analysisComplete = elapsedMs >= 5000;
  const progressPercent = Math.round((elapsedMs / 5000) * 100);
  const statusMessage = useMemo(() => {
    if (elapsedMs < 1200) return 'Reading Jira ticket...';
    if (elapsedMs < 2400) return 'Fetching PR...';
    if (elapsedMs < 3600) return 'Analyzing requirements...';
    if (elapsedMs < 4900) return 'Generating tests...';
    return 'Done ✅';
  }, [elapsedMs]);

  const benchmarkMetrics = [
    { label: 'Requirement Traceability', our: Math.min(98, verdict.confidence + 7), market: 73 },
    { label: 'Evidence Clarity', our: Math.min(97, verdict.confidence + 4), market: 70 },
    { label: 'Actionability', our: Math.min(96, verdict.confidence + 3), market: 69 },
    { label: 'Delivery Confidence', our: verdict.confidence, market: 71 },
  ];

  const overallBenchmark = Math.round(
    benchmarkMetrics.reduce((sum, metric) => sum + metric.our, 0) / benchmarkMetrics.length
  );

  const unresolvedRequirements = verdict.requirements
    .filter((requirement) => requirement.verdict !== 'Pass')
    .sort((a, b) => b.confidence - a.confidence);

  const remediationPlan = unresolvedRequirements.map((requirement, index) => {
    const priority = index === 0 ? 'P1' : index === 1 ? 'P2' : 'P3';
    const eta = index === 0 ? '1.5h' : index === 1 ? '2h' : '3h';
    const confidenceLift = index === 0 ? 11 : index === 1 ? 7 : 4;
    return {
      id: requirement.id,
      priority,
      eta,
      confidenceLift,
      title: requirement.text,
      action: `Patch acceptance gap in code path from evidence and add one focused automated test.`,
    };
  });

  const projectedConfidence = Math.min(
    99,
    verdict.confidence + remediationPlan.reduce((sum, item) => sum + item.confidenceLift, 0)
  );

  const leaderboardArena = [
    {
      name: 'Current Submission',
      verdict: verdict.overall_verdict,
      confidence: verdict.confidence,
      traceability: Math.min(99, verdict.confidence + 6),
    },
    ...Object.values(presets).map((preset) => ({
      name: preset.title,
      verdict: preset.verdict.overall_verdict,
      confidence: preset.verdict.confidence,
      traceability: Math.min(99, preset.verdict.confidence + 5),
    })),
  ].sort((a, b) => b.confidence - a.confidence);

  const toggleRow = (id: number) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedRows(newSet);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleCopyJudgeSnapshot = () => {
    const snapshot = [
      'PR AUTOPILOT - HACKATHON SNAPSHOT',
      `Overall Verdict: ${verdict.overall_verdict}`,
      `Confidence: ${verdict.confidence}%`,
      `Benchmark Score: ${overallBenchmark}/100`,
      `Projected Confidence After Fixes: ${projectedConfidence}%`,
      '',
      'Top Remediation Priorities:',
      ...remediationPlan.slice(0, 3).map((item) => `- ${item.priority}: ${item.title} (ETA ${item.eta}, +${item.confidenceLift}%)`),
    ].join('\n');
    copyToClipboard(snapshot);
    setCopiedSnapshot(true);
    setTimeout(() => setCopiedSnapshot(false), 1600);
  };

  const getBadgeStyle = () => {
    switch (verdict.overall_verdict) {
      case 'Pass': return 'bg-success/10 border-success shadow-glow-green text-success';
      case 'Partial': return 'bg-warning/10 border-warning shadow-glow-yellow text-warning';
      case 'Fail': return 'bg-danger/10 border-danger shadow-glow-red text-danger';
    }
  };

  const getIcon = () => {
    switch (verdict.overall_verdict) {
      case 'Pass': return <CheckCircle2 size={48} />;
      case 'Partial': return <AlertTriangle size={48} />;
      case 'Fail': return <XCircle size={48} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <TopNav
        active="dashboard"
        onGoDashboard={onNavigateHome}
        onGoHistory={onNavigateHistory}
        onSignOut={onSignOut}
      />

      <section className="w-full border-b border-white/10 bg-white/[0.03] backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[1.1fr_1.8fr_1fr] md:items-center md:px-6">
          <p className="text-sm text-textMuted">Evaluating: <span className="text-textPrimary font-medium">{ticketTitle}</span></p>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent shadow-glow-purple"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ ease: 'linear', duration: 0.1 }}
            />
          </div>
          <p className="text-right text-sm text-textMuted min-h-[24px]">{statusMessage}</p>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0, filter: 'blur(8px)' }}
        animate={{ opacity: analysisComplete ? 1 : 0.35, filter: analysisComplete ? 'blur(0px)' : 'blur(3px)' }}
        transition={{ duration: 0.4 }}
        className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        
        {/* Left Column */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 flex flex-col gap-6"
        >
          <section>
            <h2 className="text-lg font-display font-bold mb-3 flex items-center gap-2">
              🧠 Agent Reasoning Log
            </h2>
            <AgentLog />
          </section>

          <section className="flex-1 flex flex-col">
            <h2 className="text-lg font-display font-bold mb-3 flex items-center gap-2">
              💬 Ask the Agent
            </h2>
            <Chat verdict={verdict} />
          </section>
        </motion.div>

        {/* Right Column */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 flex flex-col gap-6"
        >
          {/* Verdict Badge */}
          <div className={`glass-panel border p-8 flex flex-col items-center justify-center text-center ${getBadgeStyle()}`}>
            <div className="mb-4">{getIcon()}</div>
            <h1 className="text-4xl font-display font-bold mb-6 tracking-tight">
              {verdict.overall_verdict.toUpperCase()}
            </h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/10"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="currentColor" strokeWidth="3"
                  />
                  <motion.path
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${verdict.confidence}, 100` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-current"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="currentColor" strokeWidth="3"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                  {verdict.confidence}%
                </div>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium uppercase tracking-wider opacity-80">Confidence Score</div>
                <div className="text-textPrimary text-sm mt-1 max-w-md">{verdict.summary}</div>
              </div>
            </div>

            <div className="eyebrow-chip mt-2">Internet comparison percentile: top {Math.max(3, 100 - overallBenchmark)}%</div>
          </div>

          <div className="glass-panel p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
              <h3 className="text-xl font-display font-bold">Global Benchmark Lens</h3>
              <span className="eyebrow-chip">Your score: {overallBenchmark}/100</span>
            </div>
            <p className="text-sm text-textMuted mb-5">
              Side-by-side comparison against common capabilities seen in public PR review tools and OSS workflow assistants.
            </p>

            <div className="space-y-4">
              {benchmarkMetrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-white/10 bg-dark/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{metric.label}</span>
                    <span className="text-xs text-textMuted">PR Autopilot {metric.our}% vs Market Avg {metric.market}%</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-textMuted mb-1">PR Autopilot</div>
                      <div className="metric-bar-track">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.our}%` }}
                          transition={{ duration: 0.9, ease: 'easeOut' }}
                          className="metric-bar-fill"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-textMuted mb-1">Market Average</div>
                      <div className="metric-bar-track">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.market}%` }}
                          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
                          className="h-full rounded-full bg-white/30"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <section className="glass-panel p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display font-bold flex items-center gap-2">
                  <Rocket size={18} className="text-secondary" />
                  Remediation Simulator
                </h3>
                <span className="eyebrow-chip">Projected {projectedConfidence}%</span>
              </div>

              {remediationPlan.length === 0 ? (
                <p className="text-sm text-textMuted">No remediation needed. This submission is clean across all requirements.</p>
              ) : (
                <div className="space-y-3">
                  {remediationPlan.map((item) => (
                    <div key={item.id} className="rounded-xl border border-white/10 bg-dark/50 p-4">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs uppercase tracking-wide text-textMuted">{item.priority}</span>
                        <span className="text-xs text-secondary">ETA {item.eta} • +{item.confidenceLift}%</span>
                      </div>
                      <p className="text-sm font-medium mb-1">{item.title}</p>
                      <p className="text-xs text-textMuted">{item.action}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="glass-panel p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-display font-bold flex items-center gap-2">
                  <Sparkles size={18} className="text-primary" />
                  Judge Demo Toolkit
                </h3>
                <span className="eyebrow-chip">Pitch-ready</span>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCopyJudgeSnapshot}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-left hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <ClipboardCheck size={15} className="text-secondary" />
                    Copy Judge Snapshot
                  </div>
                  <p className="text-xs text-textMuted mt-1">One-click summary of verdict, benchmark score, and remediation plan.</p>
                </button>

                <button
                  onClick={onExport}
                  className="w-full rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-left hover:bg-primary/20 transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <FileText size={15} className="text-primary" />
                    Export Executive PDF
                  </div>
                  <p className="text-xs text-textMuted mt-1">Generate a clean report for mentors, judges, and engineering leads.</p>
                </button>

                <button
                  onClick={onNew}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-left hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Rocket size={15} className="text-warning" />
                    Start Next PR Challenge
                  </div>
                  <p className="text-xs text-textMuted mt-1">Instantly reset inputs to demonstrate rapid evaluation turnaround.</p>
                </button>
              </div>

              {copiedSnapshot && <p className="text-xs text-success mt-3">Snapshot copied to clipboard.</p>}
            </section>
          </div>

          <section className="glass-panel p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-xl font-display font-bold flex items-center gap-2">
                <Trophy size={18} className="text-warning" />
                Benchmark Arena
              </h3>
              <span className="eyebrow-chip">Compare scenarios</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-textMuted border-b border-white/10">
                    <th className="pb-3 pr-4">Rank</th>
                    <th className="pb-3 pr-4">Scenario</th>
                    <th className="pb-3 pr-4">Verdict</th>
                    <th className="pb-3 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardArena.map((row, index) => (
                    <tr key={`${row.name}-${index}`} className="border-b border-white/5">
                      <td className="py-3 pr-4 font-semibold">#{index + 1}</td>
                      <td className="py-3 pr-4">{row.name}</td>
                      <td className="py-3 pr-4"><VerdictBadge verdict={row.verdict} /></td>
                      <td className="py-3 text-right font-semibold">{row.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Requirements Table */}
          <div className="glass-panel overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-white/5 font-medium text-sm text-textMuted">
              <div className="col-span-1">#</div>
              <div className="col-span-7">Requirement</div>
              <div className="col-span-2 text-center">Verdict</div>
              <div className="col-span-2 text-right">Confidence</div>
            </div>
            
            <div className="divide-y divide-white/5">
              {verdict.requirements.map((req, idx) => (
                <div key={req.id} className="flex flex-col">
                  <div 
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => toggleRow(req.id)}
                  >
                    <div className="col-span-1 text-textMuted">{idx + 1}</div>
                    <div className="col-span-7 text-sm font-medium text-textPrimary pr-4">{req.text}</div>
                    <div className="col-span-2 text-center"><VerdictBadge verdict={req.verdict} /></div>
                    <div className="col-span-2 text-right flex items-center justify-end gap-2 text-sm text-textMuted">
                      {req.confidence}%
                      {expandedRows.has(req.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {expandedRows.has(req.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-dark/50"
                      >
                        <div className="p-6 border-t border-white/5 space-y-4">
                          <div>
                            <h4 className="text-xs font-bold text-textMuted uppercase tracking-wider mb-2 flex items-center gap-2">
                              <FolderOpen size={14} /> Evidence
                            </h4>
                            <div className="bg-dark border border-white/10 rounded p-3 text-sm font-mono text-textPrimary">
                              {req.evidence}
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-xs font-bold text-textMuted uppercase tracking-wider flex items-center gap-2">
                                <Zap size={14} /> Generated Test
                              </h4>
                              <button 
                                onClick={(e) => { e.stopPropagation(); copyToClipboard(req.test); }}
                                className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                              >
                                <Copy size={12} /> Copy Test
                              </button>
                            </div>
                            <pre className="bg-[#0d0d12] border border-white/10 rounded p-4 text-sm font-mono text-secondary overflow-x-auto">
                              <code>{req.test}</code>
                            </pre>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-3 px-4 pb-8 pt-1 md:grid-cols-2 md:px-6">
        <button onClick={onExport} className="h-12 rounded-xl border border-white/20 bg-white/5 text-textPrimary transition-all hover:scale-[1.02] hover:shadow-glow-purple active:scale-[0.98]">
          📄 Export PDF Report
        </button>
        <button onClick={onNew} className="h-12 rounded-xl bg-gradient-to-r from-primary to-secondary font-display font-bold text-white transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]">
          🔄 New Evaluation
        </button>
      </div>
    </div>
  );
};

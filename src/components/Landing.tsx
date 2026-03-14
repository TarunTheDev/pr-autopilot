import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Bot, ArrowRight, ClipboardList, Github } from 'lucide-react';
import { presets, Preset } from '../data/demoData';
import { clsx } from 'clsx';
import { TopNav } from './TopNav';

interface LandingProps {
  jiraInput: string;
  setJiraInput: (val: string) => void;
  prInput: string;
  setPrInput: (val: string) => void;
  onRun: () => void;
  onSelectPreset: (preset: Preset) => void;
  onNavigateHistory: () => void;
  onSignOut: () => void;
}

export const Landing: React.FC<LandingProps> = ({
  jiraInput, setJiraInput, prInput, setPrInput, onRun, onSelectPreset, onNavigateHistory, onSignOut
}) => {
  const isReady = jiraInput.length > 10 && prInput.length > 10;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="absolute top-0 left-0 w-full">
        <TopNav
          active="dashboard"
          onGoDashboard={() => undefined}
          onGoHistory={onNavigateHistory}
          onSignOut={onSignOut}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full text-center mt-32 z-10"
      >
        <div className="eyebrow-chip mx-auto mb-6">
          <Bot size={14} className="text-secondary" />
          Quality Intelligence for Pull Requests
        </div>

        <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight mb-6 leading-[1.05]">
          Turn PR reviews into a
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-cyan-400"> decision-grade report</span>
        </h1>
        <p className="text-lg text-textMuted mb-10 max-w-3xl mx-auto">
          Benchmark every requirement against code evidence, generated tests, and confidence signals so your team can compare review quality with the best tools on the internet.
        </p>

        {/* Input Card */}
        <div className="glass-panel p-6 md:p-8 text-left mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <div className="eyebrow-chip justify-center md:justify-start">Traceability-first analysis</div>
            <div className="eyebrow-chip justify-center md:justify-start">Natural language verdicts + code evidence</div>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-textPrimary mb-2">
              <ClipboardList size={16} className="text-primary" />
              Jira Ticket (paste JSON)
            </label>
            <textarea
              value={jiraInput}
              onChange={(e) => setJiraInput(e.target.value)}
              placeholder='{ "title": "...", "acceptance_criteria": [...] }'
              className="w-full bg-dark/80 border border-white/10 rounded-xl p-4 text-sm font-mono text-textPrimary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none h-40"
            />
          </div>

          <div className="mb-8">
            <label className="flex items-center gap-2 text-sm font-medium text-textPrimary mb-2">
              <Github size={16} className="text-textPrimary" />
              GitHub PR URL
            </label>
            <input
              type="text"
              value={prInput}
              onChange={(e) => setPrInput(e.target.value)}
              placeholder="https://github.com/owner/repo/pull/123"
              className="w-full bg-dark/80 border border-white/10 rounded-xl p-4 text-sm text-textPrimary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <button
            onClick={onRun}
            disabled={!isReady}
            className={clsx(
              "w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300",
              isReady 
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-glow-purple hover:scale-[1.02]" 
                : "bg-white/5 text-textMuted cursor-not-allowed"
            )}
          >
            🚀 Run AI Evaluation
          </button>
          <p className="text-center text-textMuted text-sm mt-4">or explore a curated demo case below</p>
        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(presets).map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={clsx(
                "glass-panel border-l-4 rounded-xl p-5 text-left hover:bg-white/10 transition-colors group",
                preset.color
              )}
            >
              <h3 className="font-semibold text-textPrimary mb-2">{preset.title}</h3>
              <p className="text-xs uppercase tracking-[0.12em] text-textMuted mb-3">Ready-to-benchmark scenario</p>
              <p className="text-sm text-textMuted flex items-center gap-1 group-hover:text-textPrimary transition-colors">
                Load scenario <ArrowRight size={14} />
              </p>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

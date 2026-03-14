import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const statuses = [
  "Reading Jira ticket...",
  "Fetching PR diff...",
  "Analyzing requirements...",
  "Generating tests...",
  "Synthesizing verdict..."
];

export const Loading: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => Math.min(prev + 1, statuses.length - 1));
    }, 1000);

    const timeout = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen flex flex-col bg-dark">
      <header className="w-full p-6 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-2 text-xl font-display font-bold">
          <Zap className="text-warning fill-warning" size={24} />
          <span>PR Autopilot</span>
        </div>
        <div className="text-sm text-textMuted font-mono animate-pulse">
          {statuses[statusIndex]}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-primary font-medium">AI Analysis in progress</span>
            <span className="text-textMuted font-mono">{Math.round(((statusIndex + 1) / statuses.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-card rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';

const logLines = [
  "🔍 Parsing Jira ticket...",
  "📋 Extracted 3 acceptance criteria",
  "🔗 Connecting to GitHub API...",
  "📦 Retrieved PR diff: 4 files changed, +127 -43 lines",
  "🧠 Evaluating requirement 1 of 3...",
  "🧪 Generating unit test for requirement 1...",
  "🧠 Evaluating requirement 2 of 3...",
  "🧪 Generating unit test for requirement 2...",
  "🧠 Evaluating requirement 3 of 3...",
  "🧪 Generating unit test for requirement 3...",
  "⚡ Synthesizing final verdict...",
  "✅ Evaluation complete."
];

export const AgentLog: React.FC = () => {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    if (visibleLines < logLines.length) {
      const timer = setTimeout(() => {
        setVisibleLines(prev => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [visibleLines]);

  return (
    <div className="bg-dark border border-white/10 rounded-xl p-4 font-mono text-sm h-64 overflow-y-auto shadow-inner flex flex-col">
      {logLines.slice(0, visibleLines).map((line, i) => (
        <div key={i} className="mb-2 text-success opacity-90">
          <span className="text-textMuted mr-2">{`>`}</span> {line}
        </div>
      ))}
      {visibleLines < logLines.length && (
        <div className="animate-pulse text-success">_</div>
      )}
    </div>
  );
};

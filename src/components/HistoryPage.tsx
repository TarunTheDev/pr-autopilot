import React from 'react';
import { CalendarClock, FileSearch, FolderSearch } from 'lucide-react';
import { VerdictData } from '../data/demoData';
import { TopNav } from './TopNav';

export interface HistoryRecord {
  id: string;
  ticketTitle: string;
  prUrl: string;
  overallVerdict: VerdictData['overall_verdict'];
  confidence: number;
  timestamp: string;
  verdict: VerdictData;
}

interface HistoryPageProps {
  history: HistoryRecord[];
  onNavigateHome: () => void;
  onSignOut: () => void;
  onOpenRecord: (record: HistoryRecord) => void;
}

const VerdictPill = ({ verdict }: { verdict: HistoryRecord['overallVerdict'] }) => {
  if (verdict === 'Pass') return <span className="rounded-full bg-success/20 px-2.5 py-1 text-xs text-success">✅ Pass</span>;
  if (verdict === 'Partial') return <span className="rounded-full bg-warning/20 px-2.5 py-1 text-xs text-warning">⚠️ Partial</span>;
  return <span className="rounded-full bg-danger/20 px-2.5 py-1 text-xs text-danger">❌ Fail</span>;
};

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onNavigateHome,
  onSignOut,
  onOpenRecord,
}) => {
  return (
    <div className="min-h-screen">
      <TopNav
        active="history"
        onGoDashboard={onNavigateHome}
        onGoHistory={() => undefined}
        onSignOut={onSignOut}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Evaluation History</h1>
        <p className="text-textMuted mb-6">All recent runs with verdicts, confidence, and quick reopen actions.</p>

        {history.length === 0 ? (
          <div className="glass-panel flex flex-col items-center justify-center py-20 text-center">
            <FolderSearch size={46} className="text-textMuted mb-4" />
            <h2 className="text-2xl font-display font-bold mb-2">No evaluations yet</h2>
            <p className="text-textMuted">Run your first PR check to see records here.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {history.map((record) => (
              <button
                key={record.id}
                onClick={() => onOpenRecord(record)}
                className="glass-panel p-5 text-left transition-transform hover:-translate-y-1 hover:shadow-glow-purple"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-display text-lg font-bold line-clamp-2">{record.ticketTitle}</h3>
                  <VerdictPill verdict={record.overallVerdict} />
                </div>
                <p className="text-sm text-textMuted line-clamp-1 mb-3">{record.prUrl}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2 text-textMuted"><FileSearch size={14} /> Reopen</span>
                  <span className="font-semibold">{record.confidence}%</span>
                </div>
                <div className="mt-3 inline-flex items-center gap-2 text-xs text-textMuted">
                  <CalendarClock size={12} />
                  {new Date(record.timestamp).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

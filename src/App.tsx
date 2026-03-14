import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Login } from './components/Login';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import { PdfView } from './components/PdfView';
import { VerdictData, Preset, presets } from './data/demoData';
import { HistoryPage, HistoryRecord } from './components/HistoryPage';

type ViewState = 'login' | 'landing' | 'dashboard' | 'pdf' | 'history';

const HISTORY_STORAGE_KEY = 'pr_autopilot_history_v1';

function App() {
  const [view, setView] = useState<ViewState>('login');
  const [jiraInput, setJiraInput] = useState('');
  const [prInput, setPrInput] = useState('');
  const [verdict, setVerdict] = useState<VerdictData | null>(null);
  const [ticketTitle, setTicketTitle] = useState('Untitled Ticket');
  const [history, setHistory] = useState<HistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const persistHistory = (records: HistoryRecord[]) => {
    setHistory(records);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(records));
  };

  const handleSelectPreset = (preset: Preset) => {
    setJiraInput(preset.jira);
    setPrInput(preset.pr);
    setVerdict(preset.verdict);
    try {
      const parsed = JSON.parse(preset.jira);
      setTicketTitle(parsed?.title || 'Untitled Ticket');
    } catch {
      setTicketTitle('Untitled Ticket');
    }
  };

  const handleRun = () => {
    let nextVerdict = verdict;
    if (!nextVerdict) {
      nextVerdict = presets.bug.verdict;
      setVerdict(nextVerdict);
    }

    let parsedTitle = 'Untitled Ticket';
    try {
      const parsed = JSON.parse(jiraInput);
      parsedTitle = parsed?.title || 'Untitled Ticket';
    } catch {
      parsedTitle = 'Untitled Ticket';
    }
    setTicketTitle(parsedTitle);

    const timestamp = new Date().toISOString();
    const record: HistoryRecord = {
      id: `${Date.now()}`,
      ticketTitle: parsedTitle,
      prUrl: prInput || 'N/A',
      overallVerdict: nextVerdict.overall_verdict,
      confidence: nextVerdict.confidence,
      timestamp,
      verdict: nextVerdict,
    };

    persistHistory([record, ...history].slice(0, 20));
    setView('dashboard');
  };

  const handleNew = () => {
    setJiraInput('');
    setPrInput('');
    setVerdict(null);
    setView('landing');
  };

  return (
    <div className="relative min-h-screen">
      <div className="ambient-orb ambient-orb-purple" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-blue" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-pink" aria-hidden="true" />

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {view === 'login' && <Login onSuccess={() => setView('landing')} />}
          {view === 'landing' && (
            <Landing 
              jiraInput={jiraInput} 
              setJiraInput={setJiraInput}
              prInput={prInput}
              setPrInput={setPrInput}
              onRun={handleRun}
              onSelectPreset={handleSelectPreset}
              onNavigateHistory={() => setView('history')}
              onSignOut={() => setView('login')}
            />
          )}
          {view === 'dashboard' && verdict && (
            <Dashboard 
              verdict={verdict} 
              onNew={handleNew}
              onExport={() => setView('pdf')}
              onNavigateHome={() => setView('landing')}
              onNavigateHistory={() => setView('history')}
              onSignOut={() => setView('login')}
              ticketTitle={ticketTitle}
            />
          )}
          {view === 'pdf' && verdict && (
            <PdfView verdict={verdict} onBack={() => setView('dashboard')} />
          )}
          {view === 'history' && (
            <HistoryPage
              history={history}
              onNavigateHome={() => setView('landing')}
              onSignOut={() => setView('login')}
              onOpenRecord={(record) => {
                setVerdict(record.verdict);
                setTicketTitle(record.ticketTitle);
                setPrInput(record.prUrl);
                setView('dashboard');
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;

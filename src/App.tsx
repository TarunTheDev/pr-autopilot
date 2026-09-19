import { useCallback, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Landing } from './components/Landing';
import { Loading } from './components/Loading';
import { Dashboard } from './components/Dashboard';
import { ConfigProvider } from './context/ConfigContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toast } from './components/Toast';
import { SettingsModal } from './components/SettingsModal';
import { useAppStore } from './store/useAppStore';
import type { Preset } from './data/demoData';

const PdfView = lazy(() => import('./components/PdfView').then((m) => ({ default: m.PdfView })));

const PdfFallback: React.FC = () => (
  <div className="retro-scope retro-paper-bg retro-grain min-h-screen flex items-center justify-center">
    <div className="retro-card retro-lift p-8 text-center">
      <div className="retro-pixel-tag text-ink mb-4">GENERATING REPORT</div>
      <div className="w-12 h-12 border-4 border-retro-yellow border-r-2 border-ink rounded-full animate-spin mx-auto" />
      <p className="mt-4 font-mono text-sm text-ink-soft">Preparing your PDF...</p>
    </div>
  </div>
);

/** Springy page wipe between app views — the paper shuffles like cards. */
const viewTransition = {
  initial: { opacity: 0, y: 26, rotate: -0.5, scale: 0.995 },
  animate: { opacity: 1, y: 0, rotate: 0, scale: 1 },
  exit: { opacity: 0, y: -22, rotate: 0.5, scale: 0.995 },
  transition: { type: 'spring' as const, stiffness: 120, damping: 20 },
};

function AppContent() {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const jiraInput = useAppStore((s) => s.jiraInput);
  const prInput = useAppStore((s) => s.prInput);
  const verdict = useAppStore((s) => s.verdict);
  const setJiraInput = useAppStore((s) => s.setJiraInput);
  const setPrInput = useAppStore((s) => s.setPrInput);
  const setVerdict = useAppStore((s) => s.setVerdict);
  const resetAnalysis = useAppStore((s) => s.resetAnalysis);
  const settings = useAppStore((s) => s.settings);
  const addToast = useAppStore((s) => s.addToast);

  const handleSelectPreset = useCallback((preset: Preset) => {
    setJiraInput(preset.jira);
    setPrInput(preset.pr);
    setVerdict(preset.verdict);
    if (useAppStore.getState().settings.autoAnalyze) {
      addToast(`Cartridge loaded: ${preset.title.replace(/^[^\w]+/, '')}. Auto-running analysis...`, 'info');
      setView('loading');
    } else {
      addToast('Demo cartridge loaded — scroll up and hit RUN ANALYSIS.', 'success');
    }
  }, [setJiraInput, setPrInput, setVerdict, setView, addToast]);

  const handleRun = useCallback(() => {
    if (!jiraInput || !prInput) {
      addToast('Provide both a Jira ticket and a GitHub PR URL first.', 'warning');
      return;
    }
    setView('loading');
  }, [jiraInput, prInput, setView, addToast]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (view === 'pdf') {
          setView('dashboard');
        } else if (view === 'dashboard') {
          setView('landing');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, setView]);

  return (
    <>
      <Toast />
      <SettingsModal />
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div key="landing" {...viewTransition}>
            <Landing
              jiraInput={jiraInput}
              setJiraInput={setJiraInput}
              prInput={prInput}
              setPrInput={setPrInput}
              onRun={handleRun}
              onSelectPreset={handleSelectPreset}
            />
          </motion.div>
        )}
        {view === 'loading' && (
          <motion.div key="loading" {...viewTransition}>
            <Loading
              onComplete={() => setView(useAppStore.getState().verdict ? 'dashboard' : 'landing')}
              jiraJson={jiraInput}
              prUrl={prInput}
              apiKey={settings.geminiApiKey}
              githubToken={settings.githubToken}
            />
          </motion.div>
        )}
        {view === 'dashboard' && verdict && (
          <motion.div key="dashboard" {...viewTransition}>
            <Dashboard
              verdict={verdict}
              onNew={() => {
                resetAnalysis();
              }}
              onExport={() => setView('pdf')}
            />
          </motion.div>
        )}
        {view === 'pdf' && verdict && (
          <motion.div key="pdf" {...viewTransition}>
            <Suspense fallback={<PdfFallback />}>
              <PdfView verdict={verdict} onBack={() => setView('dashboard')} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <ConfigProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </ConfigProvider>
  );
}

export default App;

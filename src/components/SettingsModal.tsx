import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfig } from '../context/ConfigContext';
import {
  X, Key, Github, Eye, EyeOff, Settings2, Save, Bell, Volume2, Shield, Zap,
  Command, LayoutGrid, Bot, Accessibility,
} from 'lucide-react';

const RETRO_FIELD =
  'w-full bg-[#fffdf6] border-2 border-ink rounded-xl px-4 py-3 pr-12 font-mono text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-4 focus:ring-retro-yellow/40 transition-shadow shadow-retro-sm';

const RetroToggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint: string;
  icon: React.ReactNode;
  color: string;
}> = ({ checked, onChange, label, hint, icon, color }) => (
  <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border-2 border-transparent hover:border-ink/15 hover:bg-paper-dim transition-colors">
    <span className="flex items-center gap-3.5 min-w-0">
      <span
        className="w-10 h-10 shrink-0 border-2 border-ink rounded-xl flex items-center justify-center text-ink shadow-retro-sm"
        style={{ background: color }}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-sm font-bold text-ink">{label}</span>
        <span className="block font-mono text-[11px] text-ink/50 mt-0.5">{hint}</span>
      </span>
    </span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-14 h-8 shrink-0 border-2 border-ink rounded-full transition-colors shadow-retro-sm ${
        checked ? 'bg-retro-green' : 'bg-paper-dark'
      }`}
    >
      <motion.span
        animate={{ x: checked ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 left-0 w-6 h-6 rounded-full bg-[#fffdf6] border-2 border-ink"
      />
    </button>
  </div>
);

export const SettingsModal: React.FC = () => {
  const { settings, updateSettings, showSettings, setShowSettings, showToast } = useConfig();
  const [localSettings, setLocalSettings] = React.useState(settings);
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [showGithubToken, setShowGithubToken] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'api' | 'preferences'>('api');

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings(localSettings);
    showToast('Settings saved successfully', 'success');
    setShowSettings(false);
  };

  const handleClose = () => {
    setLocalSettings(settings);
    setShowSettings(false);
  };

  if (!showSettings) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="retro-scope fixed inset-0 z-[90] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 24, rotate: -1.5 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 24 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="retro-card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Settings"
        >
          <div className="retro-window-bar !py-3">
            <span className="retro-window-dot bg-retro-red" />
            <span className="retro-window-dot bg-retro-yellow" />
            <span className="retro-window-dot bg-retro-green" />
            <span className="ml-3 retro-pixel-tag text-ink/70">control-panel.exe</span>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close settings"
              className="ml-auto w-8 h-8 border-2 border-ink rounded-lg bg-retro-red text-ink flex items-center justify-center shadow-retro-sm hover:-translate-y-0.5 transition-transform"
            >
              <X size={15} strokeWidth={3} />
            </button>
          </div>
          <div className="p-5 sm:p-7 overflow-y-auto custom-scrollbar flex-1 bg-[#fffdf6]">
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                className="w-12 h-12 border-2 border-ink rounded-xl bg-retro-purple text-paper flex items-center justify-center shadow-retro-sm"
              >
                <Settings2 size={22} />
              </motion.div>
              <div>
                <h2 className="font-display-retro text-xl text-ink">SETTINGS</h2>
                <p className="font-mono text-xs text-ink/50">Keys stay in your browser. Always.</p>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              {([
                { id: 'api' as const, icon: <Key size={15} />, label: 'API KEYS' },
                { id: 'preferences' as const, icon: <Zap size={15} />, label: 'PREFERENCES' },
              ]).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`retro-btn px-4 py-2.5 text-xs ${activeTab === tab.id ? 'retro-btn-yellow' : ''}`}
                  aria-pressed={activeTab === tab.id}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'api' && (
                <motion.div
                  key="api"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  className="space-y-5"
                >
                  <div className="border-2 border-ink rounded-xl p-5 space-y-5 bg-[#fffdf6] shadow-retro-sm">
                    <h3 className="retro-pixel-tag text-ink/60 flex items-center gap-2">
                      <Key size={13} /> API CONFIGURATION
                    </h3>

                    <div>
                      <label htmlFor="settings-gemini" className="block font-mono text-xs font-bold text-ink mb-2">
                        GEMINI API KEY
                      </label>
                      <div className="relative">
                        <input
                          id="settings-gemini"
                          type={showApiKey ? 'text' : 'password'}
                          value={localSettings.geminiApiKey}
                          onChange={(e) => setLocalSettings({ ...localSettings, geminiApiKey: e.target.value })}
                          placeholder="Enter your Gemini API key"
                          className={RETRO_FIELD}
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 border-2 border-ink rounded-lg bg-paper flex items-center justify-center hover:bg-retro-yellow transition-colors"
                        >
                          {showApiKey ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      <p className="font-mono text-[11px] text-ink/50 mt-2.5">
                        Get your key from{' '}
                        <a
                          href="https://makersuite.google.com/app/apikey"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-retro-blue underline decoration-2 underline-offset-2 hover:text-ink"
                        >
                          Google AI Studio
                        </a>
                      </p>
                    </div>

                    <div>
                      <label htmlFor="settings-github" className="font-mono text-xs font-bold text-ink mb-2 flex items-center gap-2">
                        <Github size={14} /> GITHUB PERSONAL ACCESS TOKEN
                      </label>
                      <div className="relative">
                        <input
                          id="settings-github"
                          type={showGithubToken ? 'text' : 'password'}
                          value={localSettings.githubToken}
                          onChange={(e) => setLocalSettings({ ...localSettings, githubToken: e.target.value })}
                          placeholder="ghp_xxxxxxxxxxxx (optional)"
                          className={RETRO_FIELD}
                        />
                        <button
                          type="button"
                          onClick={() => setShowGithubToken(!showGithubToken)}
                          aria-label={showGithubToken ? 'Hide GitHub token' : 'Show GitHub token'}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 border-2 border-ink rounded-lg bg-paper flex items-center justify-center hover:bg-retro-yellow transition-colors"
                        >
                          {showGithubToken ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      <p className="font-mono text-[11px] text-ink/50 mt-2.5">
                        Only needed for private repositories. Never leaves your browser.
                      </p>
                    </div>
                  </div>

                  <div className="border-2 border-ink rounded-xl p-4 flex items-center gap-3 bg-retro-green/20 shadow-retro-sm">
                    <Shield size={16} className="text-ink shrink-0" />
                    <p className="font-mono text-[11px] text-ink/70 leading-relaxed">
                      Keys are stored in localStorage on this device only — no Autopilot server ever sees them.
                    </p>
                  </div>
                </motion.div>
              )}
              {activeTab === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="space-y-5"
                >
                  <div className="border-2 border-ink rounded-xl p-2 bg-[#fffdf6] shadow-retro-sm">
                    <h3 className="retro-pixel-tag text-ink/60 px-2.5 pt-2 pb-1 flex items-center gap-2">
                      <LayoutGrid size={13} /> INTERFACE
                    </h3>
                    <RetroToggle
                      checked={localSettings.showAgentLog}
                      onChange={(v) => setLocalSettings({ ...localSettings, showAgentLog: v })}
                      label="Show agent reasoning log"
                      hint="Display analysis steps in the dashboard"
                      icon={<Bot size={17} />}
                      color="#3a86ff"
                    />
                    <RetroToggle
                      checked={localSettings.compactMode}
                      onChange={(v) => setLocalSettings({ ...localSettings, compactMode: v })}
                      label="Compact mode"
                      hint="Tighter spacing across the dashboard"
                      icon={<LayoutGrid size={17} />}
                      color="#ffbe0b"
                    />
                    <RetroToggle
                      checked={localSettings.autoAnalyze}
                      onChange={(v) => setLocalSettings({ ...localSettings, autoAnalyze: v })}
                      label="Auto-analyze on preset load"
                      hint="Skip the run button when a demo cartridge is inserted"
                      icon={<Zap size={17} />}
                      color="#06d6a0"
                    />
                  </div>

                  <div className="border-2 border-ink rounded-xl p-2 bg-[#fffdf6] shadow-retro-sm">
                    <h3 className="retro-pixel-tag text-ink/60 px-2.5 pt-2 pb-1 flex items-center gap-2">
                      <Accessibility size={13} /> COMFORT
                    </h3>
                    <RetroToggle
                      checked={localSettings.reducedMotion}
                      onChange={(v) => setLocalSettings({ ...localSettings, reducedMotion: v })}
                      label="Reduce motion"
                      hint="Calms animations, spinners and parallax"
                      icon={<Accessibility size={17} />}
                      color="#8338ec"
                    />
                    <RetroToggle
                      checked={localSettings.notifications}
                      onChange={(v) => setLocalSettings({ ...localSettings, notifications: v })}
                      label="Toast notifications"
                      hint="Copies, saves and analysis updates"
                      icon={<Bell size={17} />}
                      color="#ff5d8f"
                    />
                    <RetroToggle
                      checked={localSettings.soundEnabled}
                      onChange={(v) => setLocalSettings({ ...localSettings, soundEnabled: v })}
                      label="Interface sounds"
                      hint="Subtle clunks on stamps and buttons"
                      icon={<Volume2 size={17} />}
                      color="#fb5607"
                    />
                  </div>

                  <div className="border-2 border-ink rounded-xl p-4 flex items-center gap-3 bg-[#fffdf6] shadow-retro-sm">
                    <Command size={15} className="text-ink/60 shrink-0" />
                    <p className="font-mono text-[11px] text-ink/60">
                      Shortcuts: <span className="kbd">Esc</span> to go back · <span className="kbd">Ctrl</span> + <span className="kbd">Enter</span> to run
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-end gap-3 px-5 sm:px-7 py-4 border-t-2 border-ink bg-paper-dim">
            <button type="button" onClick={handleClose} className="retro-btn px-5 py-2.5 text-sm">
              Cancel
            </button>
            <button type="button" onClick={handleSave} className="retro-btn retro-btn-yellow px-6 py-2.5 text-sm">
              <Save size={15} /> SAVE CHANGES
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
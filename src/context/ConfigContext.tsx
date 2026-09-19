import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useAppStore, type AppSettings, type ToastMessage } from '../store/useAppStore';

interface ConfigContextType {
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  isApiKeySet: boolean;
  isGithubTokenSet: boolean;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  toast: ToastMessage | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const showSettings = useAppStore((s) => s.showSettings);
  const setShowSettings = useAppStore((s) => s.setShowSettings);
  const toasts = useAppStore((s) => s.toasts);
  const addToast = useAppStore((s) => s.addToast);

  const isApiKeySet = Boolean(settings.geminiApiKey && settings.geminiApiKey !== 'YOUR_API_KEY');
  const isGithubTokenSet = Boolean(settings.githubToken);

  const showToast = useMemo(
    () => (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
      addToast(message, type, 4000);
    },
    [addToast]
  );

  const value = useMemo<ConfigContextType>(
    () => ({
      settings,
      updateSettings,
      isApiKeySet,
      isGithubTokenSet,
      showSettings,
      setShowSettings,
      toast: toasts[toasts.length - 1] ?? null,
      showToast,
    }),
    [settings, updateSettings, isApiKeySet, isGithubTokenSet, showSettings, setShowSettings, toasts, showToast]
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

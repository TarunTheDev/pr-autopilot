import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { VerdictData, Preset } from '../data/demoData';

export type ViewState = 'landing' | 'loading' | 'dashboard' | 'pdf';

export interface AppSettings {
  geminiApiKey: string;
  githubToken: string;
  theme: 'dark' | 'light';
  reducedMotion: boolean;
  autoAnalyze: boolean;
  showAgentLog: boolean;
  notifications: boolean;
  soundEnabled: boolean;
  compactMode: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export interface AgentStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'complete';
  progress: number;
}

const defaultSettings: AppSettings = {
  geminiApiKey: '',
  githubToken: '',
  theme: 'dark',
  reducedMotion: false,
  autoAnalyze: false,
  showAgentLog: true,
  notifications: true,
  soundEnabled: true,
  compactMode: false,
};

const defaultAgentSteps: AgentStep[] = [
  { id: 1, title: 'Parsing Jira Ticket', description: 'Extracting requirements and acceptance criteria', status: 'pending', progress: 0 },
  { id: 2, title: 'Validating PR URL', description: 'Resolving owner/repo/pull from URL', status: 'pending', progress: 0 },
  { id: 3, title: 'Fetching PR Diff', description: 'Pulling metadata, files, and patches from GitHub', status: 'pending', progress: 0 },
  { id: 4, title: 'AI Analysis', description: 'Evaluating requirements using Gemini AI', status: 'pending', progress: 0 },
  { id: 5, title: 'Synthesizing Verdict', description: 'Computing overall confidence and final report', status: 'pending', progress: 0 },
  { id: 6, title: 'Generating Tests', description: 'Creating unit test cases for verification', status: 'pending', progress: 0 },
];

export interface AppState {
  view: ViewState;
  jiraInput: string;
  prInput: string;
  verdict: VerdictData | null;
  chatMessages: ChatMessage[];
  settings: AppSettings;
  showSettings: boolean;
  toasts: ToastMessage[];
  analysisProgress: number;
  isAnalyzing: boolean;
  agentSteps: AgentStep[];
  currentStageTitle: string;
  isDarkMode: boolean;

  setView: (view: ViewState) => void;
  setJiraInput: (input: string) => void;
  setPrInput: (input: string) => void;
  setVerdict: (verdict: VerdictData | null) => void;
  setShowSettings: (show: boolean) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  toggleDarkMode: () => void;

  addToast: (message: string, type?: ToastMessage['type'], duration?: number) => void;
  removeToast: (id: string) => void;

  selectPreset: (preset: Preset) => void;
  resetAnalysis: () => void;

  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;

  setAnalysisProgress: (progress: number) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  updateAgentStep: (id: number, updates: Partial<AgentStep>) => void;
  setAgentSteps: (steps: AgentStep[] | ((prev: AgentStep[]) => AgentStep[])) => void;
  setCurrentStageTitle: (title: string) => void;
  resetAgentSteps: () => void;
}

const getPrefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const initialSettings: AppSettings = {
  ...defaultSettings,
  reducedMotion: getPrefersReducedMotion(),
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      view: 'landing',
      jiraInput: '',
      prInput: '',
      verdict: null,
      chatMessages: [],
      settings: initialSettings,
      showSettings: false,
      toasts: [],
      analysisProgress: 0,
      isAnalyzing: false,
      agentSteps: defaultAgentSteps,
      currentStageTitle: '',
      isDarkMode: true,

      setView: (view) => set({ view }),
      setJiraInput: (jiraInput) => set({ jiraInput }),
      setPrInput: (prInput) => set({ prInput }),
      setVerdict: (verdict) => set({ verdict }),
      setShowSettings: (showSettings) => set({ showSettings }),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      addToast: (message, type = 'info', duration = 4000) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        set((state) => ({
          toasts: [...state.toasts, { id, message, type, duration }]
        }));
        if (duration > 0) {
          setTimeout(() => {
            set((state) => ({
              toasts: state.toasts.filter((t) => t.id !== id)
            }));
          }, duration);
        }
      },

      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      })),

      selectPreset: (preset) => set({
        jiraInput: preset.jira,
        prInput: preset.pr,
        verdict: preset.verdict,
      }),

      resetAnalysis: () => set({
        jiraInput: '',
        prInput: '',
        verdict: null,
        view: 'landing',
        chatMessages: [],
        analysisProgress: 0,
        isAnalyzing: false,
        agentSteps: defaultAgentSteps,
        currentStageTitle: '',
      }),

      addChatMessage: (message) => set((state) => ({
        chatMessages: [...state.chatMessages, {
          ...message,
          id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: new Date(),
        }]
      })),

      clearChat: () => set({ chatMessages: [] }),

      setAnalysisProgress: (analysisProgress) => set({ analysisProgress }),
      setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

      updateAgentStep: (id, updates) => set((state) => ({
        agentSteps: state.agentSteps.map((step) =>
          step.id === id ? { ...step, ...updates } : step
        )
      })),

      setAgentSteps: (steps) => set((state) => ({
        agentSteps: typeof steps === 'function' ? steps(state.agentSteps) : steps,
      })),
      setCurrentStageTitle: (currentStageTitle) => set({ currentStageTitle }),

      resetAgentSteps: () => set({ agentSteps: defaultAgentSteps }),
    }),
    {
      name: 'pr-autopilot-store',
      partialize: (state) => ({
        settings: state.settings,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);

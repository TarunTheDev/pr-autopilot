import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../../store/useAppStore';

const resetStore = () => {
  useAppStore.setState({
    view: 'landing',
    jiraInput: '',
    prInput: '',
    verdict: null,
    chatMessages: [],
    showSettings: false,
    toasts: [],
    analysisProgress: 0,
    isAnalyzing: false,
    agentSteps: useAppStore.getState().agentSteps.map((s) => ({ ...s, status: 'pending', progress: 0 })),
    currentStageTitle: '',
    isDarkMode: true,
  });
};

describe('useAppStore', () => {
  beforeEach(() => {
    resetStore();
  });

  it('has correct defaults', () => {
    const state = useAppStore.getState();
    expect(state.view).toBe('landing');
    expect(state.jiraInput).toBe('');
    expect(state.verdict).toBeNull();
    expect(state.isDarkMode).toBe(true);
  });

  it('updates settings immutably', () => {
    const before = useAppStore.getState().settings;
    useAppStore.getState().updateSettings({ theme: 'light' });
    const after = useAppStore.getState().settings;
    expect(after.theme).toBe('light');
    expect(before).not.toBe(after);
  });

  it('toggles dark mode', () => {
    expect(useAppStore.getState().isDarkMode).toBe(true);
    useAppStore.getState().toggleDarkMode();
    expect(useAppStore.getState().isDarkMode).toBe(false);
    useAppStore.getState().toggleDarkMode();
    expect(useAppStore.getState().isDarkMode).toBe(true);
  });

  it('adds and removes toasts', () => {
    useAppStore.getState().addToast('hello', 'info', 0);
    expect(useAppStore.getState().toasts).toHaveLength(1);
    expect(useAppStore.getState().toasts[0].message).toBe('hello');
    const id = useAppStore.getState().toasts[0].id;
    useAppStore.getState().removeToast(id);
    expect(useAppStore.getState().toasts).toHaveLength(0);
  });

  it('updates a specific agent step', () => {
    useAppStore.getState().updateAgentStep(1, { status: 'active', progress: 50 });
    const updated = useAppStore.getState().agentSteps.find((s) => s.id === 1);
    expect(updated?.status).toBe('active');
    expect(updated?.progress).toBe(50);
  });

  it('appends chat messages with unique ids and timestamps', () => {
    useAppStore.getState().addChatMessage({ role: 'user', content: 'hi' });
    useAppStore.getState().addChatMessage({ role: 'agent', content: 'hello' });
    const messages = useAppStore.getState().chatMessages;
    expect(messages).toHaveLength(2);
    expect(messages[0].id).not.toBe(messages[1].id);
    expect(messages[0].timestamp).toBeInstanceOf(Date);
  });

  it('resets analysis to a clean state', () => {
    useAppStore.getState().setJiraInput('x');
    useAppStore.getState().setPrInput('y');
    useAppStore.getState().setView('dashboard');
    useAppStore.getState().addChatMessage({ role: 'user', content: 'hi' });

    useAppStore.getState().resetAnalysis();

    const state = useAppStore.getState();
    expect(state.jiraInput).toBe('');
    expect(state.prInput).toBe('');
    expect(state.view).toBe('landing');
    expect(state.chatMessages).toHaveLength(0);
  });
});

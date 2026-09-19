import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { analyzePR, askFollowUp } from '../../services/api';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch as unknown as typeof fetch;

const sampleJira = JSON.stringify({
  title: 'Test',
  acceptance_criteria: ['First criterion', 'Second criterion'],
});

const validVerdict = {
  overall_verdict: 'Pass',
  confidence: 88,
  summary: 'Looks good',
  requirements: [
    { id: 1, text: 'First criterion', verdict: 'Pass', confidence: 88, evidence: 'src/a.ts:1', test: 'test()' },
    { id: 2, text: 'Second criterion', verdict: 'Pass', confidence: 88, evidence: 'src/a.ts:2', test: 'test()' },
  ],
};

const geminiResponse = (text: string) => ({
  ok: true,
  status: 200,
  json: async () => ({
    candidates: [{ content: { parts: [{ text }] } }],
  }),
});

describe('analyzePR', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('runs all stages and emits progress events', async () => {
    mockFetch.mockResolvedValue(geminiResponse(JSON.stringify(validVerdict)));

    const progressEvents: { status: string; progress: number }[] = [];
    const result = await analyzePR({
      jiraJson: sampleJira,
      githubUrl: 'not a valid url',
      apiKey: 'fake-key',
      onProgress: (status, progress) => progressEvents.push({ status, progress }),
    });

    expect(result.verdict.overall_verdict).toBe('Pass');
    expect(result.verdict.requirements).toHaveLength(2);
    expect(result.agentLogs.length).toBeGreaterThan(0);
    expect(progressEvents.length).toBeGreaterThan(0);
    expect(progressEvents[progressEvents.length - 1].progress).toBeGreaterThanOrEqual(95);
  });

  it('returns a fallback verdict when no API key is provided', async () => {
    const result = await analyzePR({
      jiraJson: sampleJira,
      githubUrl: 'https://github.com/owner/repo/pull/1',
      apiKey: '',
    });
    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.verdict.requirements).toHaveLength(2);
    expect(result.verdict.requirements.every((r) => r.verdict !== undefined)).toBe(true);
  });

  it('returns a verdict with the failure message when JSON is invalid', async () => {
    const result = await analyzePR({
      jiraJson: 'not json at all',
      githubUrl: 'https://github.com/owner/repo/pull/1',
      apiKey: 'fake-key',
    });
    expect(result.verdict.summary.toLowerCase()).toContain('no acceptance criteria');
  });

  it('retries on invalid JSON output and falls back when all attempts fail', async () => {
    mockFetch.mockResolvedValue(geminiResponse('This is not JSON. Sorry.'));

    const result = await analyzePR({
      jiraJson: sampleJira,
      githubUrl: 'https://github.com/owner/repo/pull/1',
      apiKey: 'fake-key',
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result.verdict.requirements.length).toBeGreaterThan(0);
  });

  it('accepts JSON wrapped in markdown code fences', async () => {
    mockFetch.mockResolvedValue(geminiResponse('```json\n' + JSON.stringify(validVerdict) + '\n```'));
    const result = await analyzePR({
      jiraJson: sampleJira,
      githubUrl: '',
      apiKey: 'fake-key',
    });
    expect(result.verdict.overall_verdict).toBe('Pass');
  });

  it('returns a Fail verdict when the API itself errors out', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500, statusText: 'Server error', json: async () => ({}) });
    const result = await analyzePR({
      jiraJson: sampleJira,
      githubUrl: '',
      apiKey: 'fake-key',
    });
    expect(result.verdict).toBeDefined();
    expect(result.verdict.requirements.length).toBeGreaterThan(0);
  });
});

describe('askFollowUp', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('returns a guidance message when no API key is provided', async () => {
    const reply = await askFollowUp({
      question: 'Why did it fail?',
      verdict: { overall_verdict: 'Fail', confidence: 50, summary: '', requirements: [] as never },
      apiKey: '',
    });
    expect(reply.toLowerCase()).toContain('api key');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns model text on success', async () => {
    mockFetch.mockResolvedValue(geminiResponse('  The token logic is missing in auth.js.  '));
    const reply = await askFollowUp({
      question: 'Why?',
      verdict: { overall_verdict: 'Fail', confidence: 50, summary: '', requirements: [] as never },
      apiKey: 'fake-key',
    });
    expect(reply).toBe('The token logic is missing in auth.js.');
  });

  it('returns a fallback string on fetch failure', async () => {
    mockFetch.mockRejectedValue(new Error('network'));
    const reply = await askFollowUp({
      question: 'Why?',
      verdict: { overall_verdict: 'Fail', confidence: 50, summary: '', requirements: [] as never },
      apiKey: 'fake-key',
    });
    expect(reply.toLowerCase()).toContain('error');
  });
});

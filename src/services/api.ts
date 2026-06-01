import { VerdictSchema, type VerdictData } from './aiSchema';
import { parseJiraJson } from './jira';
import { fetchPullRequest, parseGitHubUrl, summarizePR, type PRData } from './github';
import { isSafeAsPlainText, sanitizePlainText } from '../utils/security';

export interface AnalysisResult {
  verdict: VerdictData;
  agentLogs: string[];
  processingTime: number;
  prData: PRData | null;
}

export interface AnalyzeOptions {
  jiraJson: string;
  githubUrl: string;
  apiKey?: string;
  githubToken?: string;
  onProgress?: (status: string, progress: number) => void;
}

export interface FollowUpOptions {
  question: string;
  verdict: VerdictData;
  apiKey?: string;
}

export interface PipelineStage {
  id: number;
  title: string;
  description: string;
  weight: number;
  run: (ctx: PipelineContext) => Promise<void>;
}

interface PipelineContext {
  jira: ReturnType<typeof parseJiraJson>;
  jiraRaw: string;
  githubUrl: string;
  githubToken?: string;
  apiKey?: string;
  prData: PRData | null;
  verdict: VerdictData | null;
  logs: string[];
  onProgress?: (status: string, progress: number) => void;
}

const log = (logs: string[], message: string): void => {
  const entry = `[${new Date().toLocaleTimeString()}] ${message}`;
  logs.push(entry);
};

function makeErrorVerdict(message: string): VerdictData {
  return {
    overall_verdict: 'Fail',
    confidence: 0,
    summary: message,
    requirements: [
      {
        id: 1,
        text: 'Analysis failed',
        verdict: 'Fail',
        confidence: 100,
        evidence: 'Error during analysis pipeline',
        test: '// Review the error message and try again',
      },
    ],
  };
}

function makeEmptyInputVerdict(): VerdictData {
  return {
    overall_verdict: 'Partial',
    confidence: 0,
    summary: 'No acceptance criteria were provided in the Jira ticket.',
    requirements: [
      {
        id: 1,
        text: 'Provide Jira ticket with acceptance_criteria array',
        verdict: 'Fail',
        confidence: 100,
        evidence: 'No acceptance_criteria found in the provided JSON.',
        test: "test('ticket has criteria', () => { expect(ticket.acceptance_criteria.length).toBeGreaterThan(0); });",
      },
    ],
  };
}

function buildPrompt(
  jira: ReturnType<typeof parseJiraJson>,
  jiraRaw: string,
  prSummary: string,
  prDiff: string
): string {
  return `You are PR Autopilot, a senior staff engineer conducting a thorough pull request review.

# Jira Ticket
${jiraRaw}

# Parsed Ticket
Title: ${jira.title}
Type: ${jira.type}
Priority: ${jira.priority}
Description: ${jira.description}

Acceptance criteria (${jira.acceptanceCriteria.length}):
${jira.acceptanceCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

# Pull Request Summary
${prSummary}

# Pull Request Diff (truncated)
${prDiff || 'No diff available'}

# Your Task
For EACH acceptance criterion, evaluate the PR against the actual code changes.

Return ONLY a JSON object matching this exact schema (no markdown, no commentary):
{
  "overall_verdict": "Pass" | "Partial" | "Fail",
  "confidence": number, // 0-100, your overall confidence
  "summary": "string", // 1-2 sentence overall summary
  "requirements": [
    {
      "id": number, // 1-indexed
      "text": "string", // the original criterion text
      "verdict": "Pass" | "Partial" | "Fail",
      "confidence": number, // 0-100
      "evidence": "string", // MUST cite file:line where applicable, or explain absence
      "test": "string" // A runnable Jest test case (single test, no describe block)
    }
  ]
}

Rules:
- Be strict. Only mark "Pass" if the diff clearly demonstrates the criterion is fully met.
- Use "Partial" when implementation is partial (e.g., wrong location, missing edge case).
- Use "Fail" when no evidence of implementation is found in the diff.
- Confidence should reflect evidence strength, not your opinion of the code.
- If diff is empty, all criteria should be marked "Fail" with confidence 95 and evidence "no diff available".
- Include one test per requirement using Jest-style syntax.`;
}

function safeParseJSON<T>(text: string): T | null {
  if (!text || !isSafeAsPlainText(text)) return null;
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  const candidate = cleaned.slice(start, end + 1);
  try {
    return JSON.parse(candidate) as T;
  } catch {
    return null;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function callGemini(
  prompt: string,
  apiKey: string,
  options: { temperature: number; maxOutputTokens: number }
): Promise<string | null> {
  try {
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: options.temperature,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: options.maxOutputTokens,
        },
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch (error) {
    console.error('Gemini request failed:', error);
    return null;
  }
}

async function runStage(
  stage: PipelineStage,
  ctx: PipelineContext,
  cumulative: { progress: number }
): Promise<void> {
  log(ctx.logs, `${stage.title} — ${stage.description}`);
  ctx.onProgress?.(`${stage.title}…`, cumulative.progress);
  await stage.run(ctx);
  cumulative.progress += stage.weight;
  ctx.onProgress?.(`${stage.title} complete`, cumulative.progress);
}

const STAGES: PipelineStage[] = [
  {
    id: 1,
    title: 'Parsing Jira ticket',
    description: 'Extracting requirements and acceptance criteria',
    weight: 10,
    run: async (ctx) => {
      ctx.jira = parseJiraJson(ctx.jiraRaw);
      if (!ctx.jira.isValid) {
        log(ctx.logs, 'No acceptance_criteria found in ticket.');
      } else {
        log(ctx.logs, `Parsed ${ctx.jira.acceptanceCriteria.length} acceptance criteria.`);
      }
    },
  },
  {
    id: 2,
    title: 'Validating GitHub PR URL',
    description: 'Resolving owner/repo/pull from URL',
    weight: 5,
    run: async (ctx) => {
      const parsed = parseGitHubUrl(ctx.githubUrl);
      if (!parsed.isValid) {
        log(ctx.logs, 'Invalid GitHub PR URL — proceeding with summary-only analysis.');
        return;
      }
      log(ctx.logs, `Resolved ${parsed.owner}/${parsed.repo}#${parsed.pullNumber}`);
    },
  },
  {
    id: 3,
    title: 'Fetching PR diff from GitHub',
    description: 'Pulling metadata, files, and patches',
    weight: 20,
    run: async (ctx) => {
      const parsed = parseGitHubUrl(ctx.githubUrl);
      if (!parsed.isValid) return;
      try {
        const pr = await fetchPullRequest(ctx.githubUrl, ctx.githubToken);
        ctx.prData = pr;
        log(ctx.logs, `Fetched PR: ${pr.info.title} (+${pr.info.additions}/-${pr.info.deletions}, ${pr.info.changedFiles} files)`);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown GitHub error';
        log(ctx.logs, `GitHub fetch failed: ${message}`);
      }
    },
  },
  {
    id: 4,
    title: 'Running AI evaluation',
    description: 'Asking Gemini to evaluate each criterion against the diff',
    weight: 45,
    run: async (ctx) => {
      if (!ctx.jira.isValid) {
        ctx.verdict = makeEmptyInputVerdict();
        return;
      }
      if (!ctx.apiKey) {
        log(ctx.logs, 'No Gemini API key configured — using heuristic fallback.');
        return;
      }

      const prSummary = ctx.prData ? summarizePR(ctx.prData) : 'PR diff could not be fetched (no token or invalid URL).';
      const prDiff = ctx.prData?.diff ?? '';
      const prompt = buildPrompt(ctx.jira, ctx.jiraRaw, prSummary, prDiff);

      const MAX_ATTEMPTS = 2;
      let parsed: VerdictData | null = null;
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        const text = await callGemini(
          prompt,
          ctx.apiKey,
          { temperature: attempt === 1 ? 0.2 : 0.1, maxOutputTokens: 4096 }
        );
        if (!text) continue;

        const candidate = safeParseJSON<unknown>(text);
        if (!candidate) {
          log(ctx.logs, `Attempt ${attempt}: failed to parse JSON from model output.`);
          continue;
        }

        const result = VerdictSchema.safeParse(candidate);
        if (result.success) {
          parsed = result.data;
          log(ctx.logs, `Attempt ${attempt}: schema validation passed.`);
          break;
        }
        log(ctx.logs, `Attempt ${attempt}: schema validation failed — ${result.error.issues.length} issues.`);
      }

      if (parsed) {
        // Enforce safety bounds before persisting any AI-provided text.
        const safeSummary = isSafeAsPlainText(parsed.summary) ? sanitizePlainText(parsed.summary) : '';
        ctx.verdict = {
          ...parsed,
          summary: safeSummary,
          requirements: parsed.requirements.map((r) => ({
            ...r,
            text: isSafeAsPlainText(r.text) ? sanitizePlainText(r.text) : '',
            evidence: isSafeAsPlainText(r.evidence) ? sanitizePlainText(r.evidence) : '',
            test: isSafeAsPlainText(r.test) ? sanitizePlainText(r.test) : '',
          })),
        };
      } else {
        log(ctx.logs, 'All Gemini attempts failed; falling back to heuristic verdict.');
      }
    },
  },
  {
    id: 5,
    title: 'Synthesizing verdict',
    description: 'Computing overall confidence and final report',
    weight: 10,
    run: async (ctx) => {
      if (ctx.verdict) {
        const passCount = ctx.verdict.requirements.filter((r) => r.verdict === 'Pass').length;
        log(ctx.logs, `Final verdict: ${ctx.verdict.overall_verdict} (${passCount}/${ctx.verdict.requirements.length} criteria met)`);
      } else {
        ctx.verdict = {
          overall_verdict: 'Partial',
          confidence: 30,
          summary: 'AI evaluation could not be completed. Configure your Gemini API key in Settings to enable full analysis.',
          requirements: ctx.jira.acceptanceCriteria.map((c, i) => ({
            id: i + 1,
            text: c,
            verdict: 'Partial' as const,
            confidence: 30,
            evidence: 'AI service not configured. Showing heuristic placeholder.',
            test: `test('${c.slice(0, 40).replace(/['"]/g, '')}', () => { expect(true).toBe(true); });`,
          })),
        };
      }
    },
  },
  {
    id: 6,
    title: 'Generating test cases',
    description: 'Preparing runnable Jest test snippets',
    weight: 10,
    run: async (ctx) => {
      if (ctx.verdict) {
        log(ctx.logs, `Generated ${ctx.verdict.requirements.length} test cases.`);
      }
    },
  },
];

export async function analyzePR(options: AnalyzeOptions): Promise<AnalysisResult> {
  const { jiraJson, githubUrl, apiKey, githubToken, onProgress } = options;
  const startTime = Date.now();
  const ctx: PipelineContext = {
    jira: parseJiraJson(jiraJson),
    jiraRaw: jiraJson,
    githubUrl,
    githubToken,
    apiKey,
    prData: null,
    verdict: null,
    logs: [],
    onProgress,
  };
  const cumulative = { progress: 0 };

  try {
    for (const stage of STAGES) {
      await runStage(stage, ctx, cumulative);
    }

    if (!ctx.verdict) {
      ctx.verdict = makeErrorVerdict('Pipeline completed without producing a verdict.');
    }

    log(ctx.logs, `Done in ${Date.now() - startTime}ms.`);

    return {
      verdict: ctx.verdict,
      agentLogs: ctx.logs,
      processingTime: Date.now() - startTime,
      prData: ctx.prData,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    log(ctx.logs, `Error: ${message}`);
    return {
      verdict: makeErrorVerdict(message),
      agentLogs: ctx.logs,
      processingTime: Date.now() - startTime,
      prData: ctx.prData,
    };
  }
}

export async function askFollowUp(options: FollowUpOptions): Promise<string> {
  const { question, verdict, apiKey } = options;

  if (!apiKey) {
    await sleep(400);
    return 'Please configure your Gemini API key in Settings to use the chat feature.';
  }

  try {
    const text = await callGemini(
      `You are PR Autopilot, an expert AI code reviewer.

Evaluation result: ${JSON.stringify(verdict, null, 2)}

Answer the developer's follow-up question in 50-80 words. Be direct, specific, mention file names if relevant. Sound like a senior engineer. If you don't have enough context, say so. Do not include markdown or code fences.

Question: ${question}`,
      apiKey,
      { temperature: 0.6, maxOutputTokens: 256 }
    );
    if (!text) {
      return 'Error connecting to AI service. Please check your API key and try again.';
    }
    const sanitized = sanitizePlainText(text);
    return sanitized || 'Unable to process your question. Please try again.';
  } catch (error) {
    console.error('Follow-up question failed:', error);
    return 'Error connecting to AI service. Please check your API key and try again.';
  }
}

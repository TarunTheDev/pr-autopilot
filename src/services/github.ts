import axios, { AxiosError } from 'axios';

export interface ParsedGitHubUrl {
  owner: string;
  repo: string;
  pullNumber: number;
  isValid: boolean;
}

export interface PRFile {
  filename: string;
  status: 'added' | 'removed' | 'modified' | 'renamed' | 'copied' | 'changed' | 'unchanged';
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
  previous_filename?: string;
}

export interface PRInfo {
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  author: string;
  baseBranch: string;
  headBranch: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  additions: number;
  deletions: number;
  changedFiles: number;
}

export interface PRData {
  info: PRInfo;
  files: PRFile[];
  diff: string;
}

const GITHUB_API = 'https://api.github.com';

export function parseGitHubUrl(url: string): ParsedGitHubUrl {
  const result: ParsedGitHubUrl = { owner: '', repo: '', pullNumber: 0, isValid: false };
  if (!url || typeof url !== 'string') return result;

  const cleaned = url.trim();
  const match = cleaned.match(
    /^https?:\/\/github\.com\/([\w.-]+)\/([\w.-]+)\/pull\/(\d+)(?:\/.*)?$/i
  );

  if (!match) return result;

  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/i, ''),
    pullNumber: Number.parseInt(match[3], 10),
    isValid: true,
  };
}

function buildHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'PR-Autopilot-AI',
  };
  if (token && token.length > 0) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}

function describeError(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;
      if (status === 404) return 'Repository or pull request not found (404). Check the URL and access permissions.';
      if (status === 403) return 'GitHub API rate limit reached or access forbidden (403). Provide a GitHub token in Settings.';
      if (status === 401) return 'GitHub authentication failed (401). Verify your token in Settings.';
      return `GitHub API error: ${status} ${error.response.statusText}`;
    }
    if (error.request) return 'Network error: unable to reach GitHub. Check your connection.';
    return error.message;
  }
  return error instanceof Error ? error.message : 'Unknown error';
}

export async function fetchPullRequest(
  url: string,
  token?: string
): Promise<PRData> {
  const parsed = parseGitHubUrl(url);
  if (!parsed.isValid) {
    throw new Error('Invalid GitHub PR URL. Expected format: https://github.com/owner/repo/pull/123');
  }

  const headers = buildHeaders(token);

  try {
    const [prResponse, filesResponse] = await Promise.all([
      axios.get(`${GITHUB_API}/repos/${parsed.owner}/${parsed.repo}/pulls/${parsed.pullNumber}`, { headers }),
      axios.get(`${GITHUB_API}/repos/${parsed.owner}/${parsed.repo}/pulls/${parsed.pullNumber}/files?per_page=100`, { headers }),
    ]);

    const pr = prResponse.data;
    const files: PRFile[] = Array.isArray(filesResponse.data) ? filesResponse.data : [];

    const info: PRInfo = {
      number: pr.number,
      title: pr.title ?? '',
      body: pr.body ?? null,
      state: pr.state === 'open' || pr.state === 'closed' ? pr.state : 'open',
      author: pr.user?.login ?? 'unknown',
      baseBranch: pr.base?.ref ?? '',
      headBranch: pr.head?.ref ?? '',
      url: pr.html_url ?? url,
      createdAt: pr.created_at ?? '',
      updatedAt: pr.updated_at ?? '',
      additions: typeof pr.additions === 'number' ? pr.additions : 0,
      deletions: typeof pr.deletions === 'number' ? pr.deletions : 0,
      changedFiles: typeof pr.changed_files === 'number' ? pr.changed_files : files.length,
    };

    const truncatedFiles = files.slice(0, 50).map((f) => ({
      filename: f.filename,
      status: f.status,
      additions: f.additions ?? 0,
      deletions: f.deletions ?? 0,
      changes: f.changes ?? 0,
      patch: typeof f.patch === 'string' ? f.patch.slice(0, 4000) : undefined,
      previous_filename: f.previous_filename,
    }));

    const diff = truncatedFiles
      .filter((f) => f.patch)
      .map((f) => `--- ${f.filename}\n+++ ${f.filename}\n${f.patch}`)
      .join('\n\n')
      .slice(0, 60000);

    return { info, files: truncatedFiles, diff };
  } catch (error) {
    throw new Error(describeError(error));
  }
}

export function summarizePR(data: PRData): string {
  const { info, files } = data;
  const fileList = files
    .slice(0, 30)
    .map((f) => `- ${f.filename} (${f.status}, +${f.additions}/-${f.deletions})`)
    .join('\n');
  return [
    `PR #${info.number}: ${info.title}`,
    `Author: ${info.author} | State: ${info.state}`,
    `Branch: ${info.headBranch} -> ${info.baseBranch}`,
    `Stats: +${info.additions}/-${info.deletions} across ${info.changedFiles} files`,
    '',
    'Changed files:',
    fileList,
  ].join('\n');
}

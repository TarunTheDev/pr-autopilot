import { describe, it, expect } from 'vitest';
import { parseGitHubUrl, summarizePR } from '../../services/github';

describe('parseGitHubUrl', () => {
  it('parses a valid pull request URL', () => {
    const result = parseGitHubUrl('https://github.com/facebook/react/pull/12345');
    expect(result).toEqual({
      owner: 'facebook',
      repo: 'react',
      pullNumber: 12345,
      isValid: true,
    });
  });

  it('parses a URL with trailing path segments', () => {
    const result = parseGitHubUrl('https://github.com/vercel/next.js/pull/6789/files');
    expect(result.isValid).toBe(true);
    expect(result.owner).toBe('vercel');
    expect(result.repo).toBe('next.js');
    expect(result.pullNumber).toBe(6789);
  });

  it('supports http (not just https)', () => {
    const result = parseGitHubUrl('http://github.com/owner/repo/pull/1');
    expect(result.isValid).toBe(true);
    expect(result.pullNumber).toBe(1);
  });

  it('strips trailing .git from repo name', () => {
    const result = parseGitHubUrl('https://github.com/owner/some-repo.git/pull/12');
    expect(result.repo).toBe('some-repo');
    expect(result.isValid).toBe(true);
  });

  it('returns isValid: false for non-GitHub URLs', () => {
    expect(parseGitHubUrl('https://gitlab.com/owner/repo/-/merge_requests/1').isValid).toBe(false);
    expect(parseGitHubUrl('https://example.com/foo').isValid).toBe(false);
    expect(parseGitHubUrl('not a url at all').isValid).toBe(false);
  });

  it('returns isValid: false for empty or non-string input', () => {
    expect(parseGitHubUrl('').isValid).toBe(false);
    // @ts-expect-error testing runtime guard
    expect(parseGitHubUrl(undefined).isValid).toBe(false);
    // @ts-expect-error testing runtime guard
    expect(parseGitHubUrl(null).isValid).toBe(false);
  });

  it('returns isValid: false for repository URLs without a pull number', () => {
    expect(parseGitHubUrl('https://github.com/facebook/react').isValid).toBe(false);
    expect(parseGitHubUrl('https://github.com/facebook/react/issues/1').isValid).toBe(false);
  });
});

describe('summarizePR', () => {
  it('produces a readable summary with stats and file list', () => {
    const summary = summarizePR({
      info: {
        number: 7,
        title: 'Test PR',
        body: null,
        state: 'open',
        author: 'octocat',
        baseBranch: 'main',
        headBranch: 'feature',
        url: 'https://github.com/o/r/pull/7',
        createdAt: '',
        updatedAt: '',
        additions: 10,
        deletions: 5,
        changedFiles: 2,
      },
      files: [
        { filename: 'src/a.ts', status: 'modified', additions: 8, deletions: 3, changes: 11 },
        { filename: 'src/b.ts', status: 'added', additions: 2, deletions: 0, changes: 2 },
      ],
      diff: '',
    });
    expect(summary).toContain('PR #7');
    expect(summary).toContain('+10/-5');
    expect(summary).toContain('src/a.ts');
    expect(summary).toContain('src/b.ts');
  });
});

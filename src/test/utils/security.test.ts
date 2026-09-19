import { describe, it, expect } from 'vitest';
import { escapeHtml, sanitizePlainText, isSafeAsPlainText, truncateForDisplay } from '../../utils/security';

describe('escapeHtml', () => {
  it('escapes the most dangerous characters', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;&#x2F;script&gt;');
    expect(escapeHtml('"onclick="x')).toBe('&quot;onclick&#x3D;&quot;x');
    expect(escapeHtml("it's")).toBe('it&#39;s');
    expect(escapeHtml('a & b')).toBe('a &amp; b');
  });

  it('returns empty string for non-string input', () => {
    expect(escapeHtml('')).toBe('');
    // @ts-expect-error testing runtime guard
    expect(escapeHtml(undefined)).toBe('');
    // @ts-expect-error testing runtime guard
    expect(escapeHtml(null)).toBe('');
  });
});

describe('sanitizePlainText', () => {
  it('removes ASCII control characters', () => {
    const dirty = 'hello\u0000\u0007world\u001B[31mred';
    expect(sanitizePlainText(dirty)).toBe('helloworld[31mred');
  });

  it('normalizes line endings and trims', () => {
    expect(sanitizePlainText('  hello\r\nworld  \n')).toBe('hello\nworld');
  });

  it('returns empty string for non-string input', () => {
    // @ts-expect-error testing runtime guard
    expect(sanitizePlainText(null)).toBe('');
  });
});

describe('isSafeAsPlainText', () => {
  it('rejects strings longer than 200k chars', () => {
    expect(isSafeAsPlainText('a'.repeat(200_001))).toBe(false);
  });

  it('accepts reasonable strings', () => {
    expect(isSafeAsPlainText('hello')).toBe(true);
  });
});

describe('truncateForDisplay', () => {
  it('passes through short strings', () => {
    expect(truncateForDisplay('hi', 10)).toBe('hi');
  });

  it('truncates long strings with an ellipsis', () => {
    expect(truncateForDisplay('hello world', 6)).toBe('hello…');
  });
});

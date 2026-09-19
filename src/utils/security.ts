const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

const HTML_ESCAPE_PATTERN = /[&<>"'`=/]/g;

export function escapeHtml(input: string): string {
  if (typeof input !== 'string') return '';
  return input.replace(HTML_ESCAPE_PATTERN, (match) => HTML_ESCAPES[match] ?? match);
}

export function sanitizePlainText(input: string): string {
  if (typeof input !== 'string') return '';
  // eslint-disable-next-line no-control-regex
  const controlCharPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
  return input
    .replace(/\r\n/g, '\n')
    .replace(controlCharPattern, '')
    .trim();
}

export function isSafeAsPlainText(input: string): boolean {
  if (typeof input !== 'string') return false;
  if (input.length > 200_000) return false;
  return true;
}

export function truncateForDisplay(input: string, maxLength: number): string {
  if (typeof input !== 'string') return '';
  if (input.length <= maxLength) return input;
  return `${input.slice(0, maxLength - 1)}…`;
}

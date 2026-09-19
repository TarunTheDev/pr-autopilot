export interface ParsedJiraTicket {
  title: string;
  type: string;
  priority: string;
  description: string;
  acceptanceCriteria: string[];
  isValid: boolean;
  raw: Record<string, unknown> | null;
}

export function parseJiraJson(input: string): ParsedJiraTicket {
  const fallback: ParsedJiraTicket = {
    title: '',
    type: '',
    priority: '',
    description: '',
    acceptanceCriteria: [],
    isValid: false,
    raw: null,
  };

  if (!input || typeof input !== 'string') return fallback;

  let data: unknown;
  try {
    data = JSON.parse(input);
  } catch {
    return fallback;
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return fallback;
  }

  const obj = data as Record<string, unknown>;
  const pickString = (key: string): string => {
    const value = obj[key];
    return typeof value === 'string' ? value : '';
  };

  const criteria: string[] = [];
  const rawCriteria = obj.acceptance_criteria ?? obj.acceptanceCriteria ?? obj.criteria;
  if (Array.isArray(rawCriteria)) {
    for (const item of rawCriteria) {
      if (typeof item === 'string' && item.trim().length > 0) {
        criteria.push(item.trim());
      }
    }
  }

  return {
    title: pickString('title') || pickString('summary'),
    type: pickString('type') || pickString('issueType'),
    priority: pickString('priority'),
    description: pickString('description') || pickString('body'),
    acceptanceCriteria: criteria,
    isValid: criteria.length > 0,
    raw: obj,
  };
}

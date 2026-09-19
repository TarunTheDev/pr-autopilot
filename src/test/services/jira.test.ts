import { describe, it, expect } from 'vitest';
import { parseJiraJson } from '../../services/jira';

describe('parseJiraJson', () => {
  it('parses a typical Jira ticket with acceptance_criteria', () => {
    const ticket = JSON.stringify({
      title: 'Add login',
      type: 'Feature',
      priority: 'High',
      description: 'Implement login flow',
      acceptance_criteria: ['User can log in', 'User can log out'],
    });
    const result = parseJiraJson(ticket);
    expect(result.isValid).toBe(true);
    expect(result.title).toBe('Add login');
    expect(result.type).toBe('Feature');
    expect(result.acceptanceCriteria).toHaveLength(2);
  });

  it('accepts camelCase acceptanceCriteria as an alias', () => {
    const ticket = JSON.stringify({
      summary: 'Add login',
      acceptanceCriteria: ['criterion A'],
    });
    const result = parseJiraJson(ticket);
    expect(result.title).toBe('Add login');
    expect(result.acceptanceCriteria).toEqual(['criterion A']);
    expect(result.isValid).toBe(true);
  });

  it('trims whitespace and filters empty criteria', () => {
    const ticket = JSON.stringify({
      acceptance_criteria: ['  first  ', '', '  ', 'second'],
    });
    const result = parseJiraJson(ticket);
    expect(result.acceptanceCriteria).toEqual(['first', 'second']);
  });

  it('is invalid when criteria is empty', () => {
    const ticket = JSON.stringify({ title: 'no criteria', acceptance_criteria: [] });
    const result = parseJiraJson(ticket);
    expect(result.isValid).toBe(false);
    expect(result.acceptanceCriteria).toEqual([]);
  });

  it('is invalid for non-JSON input', () => {
    expect(parseJiraJson('not json').isValid).toBe(false);
    expect(parseJiraJson('').isValid).toBe(false);
  });

  it('is invalid for JSON that is not an object', () => {
    expect(parseJiraJson('"a string"').isValid).toBe(false);
    expect(parseJiraJson('[1,2,3]').isValid).toBe(false);
  });

  it('ignores non-string criteria', () => {
    const ticket = JSON.stringify({
      acceptance_criteria: ['ok', 42, null, { nested: true }, 'also ok'],
    });
    const result = parseJiraJson(ticket);
    expect(result.acceptanceCriteria).toEqual(['ok', 'also ok']);
  });
});

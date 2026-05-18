import { describe, it, expect } from 'vitest';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildEmailBody(fields) {
  return fields
    .filter(([, value]) => value && value.toString().trim())
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');
}

describe('isValidEmail', () => {
  it('accepts a valid email', () => {
    expect(isValidEmail('hans@example.com')).toBe(true);
  });
  it('rejects email with no @', () => {
    expect(isValidEmail('notanemail')).toBe(false);
  });
  it('rejects email with no domain', () => {
    expect(isValidEmail('hans@')).toBe(false);
  });
  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });
});

describe('buildEmailBody', () => {
  it('includes only non-empty fields', () => {
    const fields = [
      ['Item Type', 'Tree of Life'],
      ['Personalization Text', 'John & Jane 2024'],
      ['Phone', ''],
      ['Notes', null],
    ];
    const body = buildEmailBody(fields);
    expect(body).toContain('Item Type: Tree of Life');
    expect(body).toContain('Personalization Text: John & Jane 2024');
    expect(body).not.toContain('Phone');
    expect(body).not.toContain('Notes');
  });

  it('returns empty string when all fields are empty', () => {
    expect(buildEmailBody([['Name', ''], ['Email', null]])).toBe('');
  });
});

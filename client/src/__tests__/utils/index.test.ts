import { formatCurrency, formatDate, formatDateShort, cn, getInitials } from '../../utils';

describe('formatCurrency()', () => {
  it('formats INR amounts correctly', () => {
    const result = formatCurrency(45000, 'INR');
    expect(result).toContain('45,000');
  });

  it('formats USD amounts correctly', () => {
    const result = formatCurrency(1234.56, 'USD');
    expect(result).toContain('1,234.56');
    expect(result).toContain('$');
  });

  it('handles string amounts', () => {
    const result = formatCurrency('25000', 'INR');
    expect(result).toContain('25,000');
  });

  it('returns "—" for NaN amounts', () => {
    expect(formatCurrency('not-a-number')).toBe('—');
  });

  it('handles zero amounts', () => {
    const result = formatCurrency(0, 'INR');
    expect(result).toContain('0');
  });

  it('defaults to INR when no currency provided', () => {
    const result = formatCurrency(1000);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});

describe('formatDate()', () => {
  it('formats a valid ISO date string', () => {
    const result = formatDate('2026-05-20');
    expect(result).toContain('May');
    expect(result).toContain('2026');
  });

  it('returns "—" for null', () => {
    expect(formatDate(null)).toBe('—');
  });

  it('returns "—" for undefined', () => {
    expect(formatDate(undefined)).toBe('—');
  });

  it('returns "—" for empty string', () => {
    expect(formatDate('')).toBe('—');
  });

  it('returns "—" for an invalid date string', () => {
    expect(formatDate('not-a-date')).toBe('—');
  });
});

describe('formatDateShort()', () => {
  it('formats date without year', () => {
    const result = formatDateShort('2026-05-20');
    expect(result).toContain('May');
    expect(result).not.toContain('2026');
  });

  it('returns "—" for null/undefined', () => {
    expect(formatDateShort(null)).toBe('—');
    expect(formatDateShort(undefined)).toBe('—');
  });
});

describe('cn()', () => {
  it('joins multiple class names', () => {
    expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz');
  });

  it('filters out empty strings and non-strings', () => {
    expect(cn('foo', '', null, undefined, false, 'bar')).toBe('foo bar');
  });

  it('returns empty string when no classes provided', () => {
    expect(cn()).toBe('');
  });

  it('returns single class unchanged', () => {
    expect(cn('single')).toBe('single');
  });
});

describe('getInitials()', () => {
  it('returns first two chars for single-word name', () => {
    expect(getInitials('Rahul')).toBe('RA');
  });

  it('returns first and last initial for two-word name', () => {
    expect(getInitials('Rahul Mehta')).toBe('RM');
  });

  it('uses first and last word for multi-word names', () => {
    expect(getInitials('John Paul Smith')).toBe('JS');
  });

  it('returns empty string for null', () => {
    expect(getInitials(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(getInitials(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(getInitials('')).toBe('');
  });

  it('handles names with extra whitespace', () => {
    expect(getInitials('  John  Doe  ')).toBe('JD');
  });
});

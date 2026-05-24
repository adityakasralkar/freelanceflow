'use strict';

const { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY } = require('../utils/currencies');

describe('currencies', () => {
  it('exports an array of currency codes', () => {
    expect(Array.isArray(SUPPORTED_CURRENCIES)).toBe(true);
    expect(SUPPORTED_CURRENCIES.length).toBeGreaterThan(0);
  });

  it('includes the major currencies', () => {
    expect(SUPPORTED_CURRENCIES).toContain('INR');
    expect(SUPPORTED_CURRENCIES).toContain('USD');
    expect(SUPPORTED_CURRENCIES).toContain('EUR');
    expect(SUPPORTED_CURRENCIES).toContain('GBP');
  });

  it('all codes are 3-character uppercase strings', () => {
    for (const code of SUPPORTED_CURRENCIES) {
      expect(code).toMatch(/^[A-Z]{3}$/);
    }
  });

  it('has no duplicate codes', () => {
    const unique = new Set(SUPPORTED_CURRENCIES);
    expect(unique.size).toBe(SUPPORTED_CURRENCIES.length);
  });

  it('DEFAULT_CURRENCY is INR', () => {
    expect(DEFAULT_CURRENCY).toBe('INR');
  });

  it('DEFAULT_CURRENCY is in SUPPORTED_CURRENCIES', () => {
    expect(SUPPORTED_CURRENCIES).toContain(DEFAULT_CURRENCY);
  });
});

'use strict';

const { generateToken, expiryHours, expiryDays } = require('../utils/tokenGenerator');

describe('generateToken', () => {
  it('returns a hex string', () => {
    const token = generateToken();
    expect(/^[0-9a-f]+$/.test(token)).toBe(true);
  });

  it('returns 64 characters by default (32 bytes hex)', () => {
    expect(generateToken()).toHaveLength(64);
  });

  it('returns different tokens on each call', () => {
    expect(generateToken()).not.toBe(generateToken());
  });

  it('respects custom byte length', () => {
    expect(generateToken(16)).toHaveLength(32);
  });
});

describe('expiryHours', () => {
  it('returns a Date in the future', () => {
    const result = expiryHours(1);
    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBeGreaterThan(Date.now());
  });

  it('is approximately 1 hour from now', () => {
    const before = Date.now();
    const result = expiryHours(1);
    const after = Date.now();
    const oneHour = 60 * 60 * 1000;
    expect(result.getTime()).toBeGreaterThanOrEqual(before + oneHour - 10);
    expect(result.getTime()).toBeLessThanOrEqual(after + oneHour + 10);
  });
});

describe('expiryDays', () => {
  it('returns a Date in the future', () => {
    const result = expiryDays(7);
    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBeGreaterThan(Date.now());
  });

  it('is approximately 7 days from now', () => {
    const before = Date.now();
    const result = expiryDays(7);
    const after = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    expect(result.getTime()).toBeGreaterThanOrEqual(before + sevenDays - 10);
    expect(result.getTime()).toBeLessThanOrEqual(after + sevenDays + 10);
  });
});

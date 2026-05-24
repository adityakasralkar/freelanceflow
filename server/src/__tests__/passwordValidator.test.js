'use strict';

const { passwordSchema } = require('../utils/passwordValidator');

describe('passwordSchema', () => {
  const valid = 'Secure@123';

  it('accepts a valid password', () => {
    expect(passwordSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects password shorter than 8 characters', () => {
    const result = passwordSchema.safeParse('Ab1@');
    expect(result.success).toBe(false);
    const messages = result.error.issues.map((i) => i.message).join(' ');
    expect(messages).toContain('8 characters');
  });

  it('rejects password without uppercase letter', () => {
    const result = passwordSchema.safeParse('secure@123');
    expect(result.success).toBe(false);
    const messages = result.error.issues.map((i) => i.message).join(' ');
    expect(messages).toContain('uppercase');
  });

  it('rejects password without lowercase letter', () => {
    const result = passwordSchema.safeParse('SECURE@123');
    expect(result.success).toBe(false);
    const messages = result.error.issues.map((i) => i.message).join(' ');
    expect(messages).toContain('lowercase');
  });

  it('rejects password without a digit', () => {
    const result = passwordSchema.safeParse('Secure@abc');
    expect(result.success).toBe(false);
    const messages = result.error.issues.map((i) => i.message).join(' ');
    expect(messages).toContain('digit');
  });

  it('rejects password without a special character', () => {
    const result = passwordSchema.safeParse('Secure1234');
    expect(result.success).toBe(false);
    const messages = result.error.issues.map((i) => i.message).join(' ');
    expect(messages).toContain('special');
  });

  it('accepts passwords with various special characters', () => {
    for (const char of ['!', '#', '$', '%', '^', '&', '*', '-', '_', '=', '+']) {
      const pw = `Secure${char}1`;
      expect(passwordSchema.safeParse(pw).success).toBe(true);
    }
  });
});

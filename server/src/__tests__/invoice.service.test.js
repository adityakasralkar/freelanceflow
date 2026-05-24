'use strict';

const { validateInvoiceStatusTransition } = require('../services/invoice.service');

describe('validateInvoiceStatusTransition', () => {
  const validTransitions = [
    ['draft', 'sent'],
    ['sent', 'paid'],
    ['sent', 'overdue'],
    ['overdue', 'paid'],
  ];

  test.each(validTransitions)('allows %s → %s', (from, to) => {
    expect(() => validateInvoiceStatusTransition(from, to)).not.toThrow();
  });

  const invalidTransitions = [
    ['draft', 'paid'],
    ['draft', 'overdue'],
    ['paid', 'sent'],
    ['paid', 'draft'],
    ['paid', 'overdue'],
    ['overdue', 'draft'],
    ['overdue', 'sent'],
    ['sent', 'draft'],
  ];

  test.each(invalidTransitions)('rejects %s → %s', (from, to) => {
    expect(() => validateInvoiceStatusTransition(from, to)).toThrow();
  });

  it('throws an error with status 400 on invalid transition', () => {
    try {
      validateInvoiceStatusTransition('paid', 'draft');
    } catch (err) {
      expect(err.status).toBe(400);
      expect(err.message).toContain('paid');
    }
  });

  it('includes allowed transitions in error message', () => {
    try {
      validateInvoiceStatusTransition('draft', 'paid');
    } catch (err) {
      expect(err.message).toContain('sent');
    }
  });

  it('says "none" in error when no transitions allowed (paid)', () => {
    try {
      validateInvoiceStatusTransition('paid', 'sent');
    } catch (err) {
      expect(err.message).toContain('none');
    }
  });
});

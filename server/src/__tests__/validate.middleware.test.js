'use strict';

const { z } = require('zod');
const validate = require('../middleware/validate');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

const next = jest.fn();

const schema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive(),
});

beforeEach(() => jest.clearAllMocks());

describe('validate middleware', () => {
  it('calls next and sets req.body to parsed data when valid', () => {
    const req = { body: { name: 'Alice', age: 30 } };
    const res = mockRes();
    validate(schema)(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.body).toEqual({ name: 'Alice', age: 30 });
  });

  it('strips extra fields from body (Zod strips unknown keys by default)', () => {
    const req = { body: { name: 'Alice', age: 30, extra: 'stripped' } };
    const res = mockRes();
    validate(schema)(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.body).not.toHaveProperty('extra');
  });

  it('returns 400 when required field is missing', () => {
    const req = { body: { age: 25 } };
    const res = mockRes();
    validate(schema)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, code: 400 })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 when field type is wrong', () => {
    const req = { body: { name: 'Alice', age: 'not-a-number' } };
    const res = mockRes();
    validate(schema)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when body is empty', () => {
    const req = { body: {} };
    const res = mockRes();
    validate(schema)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

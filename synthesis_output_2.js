const Idempotency = require('./idempotency');

describe('Idempotency', () => {
  let idempotency;

  beforeEach(() => {
    idempotency = new Idempotency();
  });

  it('should set and get values correctly', () => {
    idempotency.set('key1', 'value1');
    expect(idempotency.get('key1')).toBe('value1');
  });

  it('should clear all stored values', () => {
    idempotency.set('key1', 'value1');
    idempotency.clear();
    expect(idempotency.get('key1')).toBe(undefined);
  });
});
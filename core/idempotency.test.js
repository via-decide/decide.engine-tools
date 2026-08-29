const StorageAdapter = require('./idempotency').StorageAdapter;

describe('StorageAdapter', () => {
  let adapter;

  beforeEach(() => {
    adapter = new StorageAdapter();
  });

  it('should implement the delete method', () => {
    expect(adapter.delete).toBeDefined();
  });
});
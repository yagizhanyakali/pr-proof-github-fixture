import { afterEach, describe, expect, it } from 'vitest';
import { getAddress, getMode, saveAddress } from '../lib/store.js';

const originalMode = process.env.TESTBED_MODE;

afterEach(() => {
  if (originalMode === undefined) {
    delete process.env.TESTBED_MODE;
  } else {
    process.env.TESTBED_MODE = originalMode;
  }
});

describe('testbed store', () => {
  it('returns snapshots rather than mutable references and persists an address update', () => {
    const original = getAddress();
    const snapshot = getAddress();
    snapshot.city = 'Changed locally';
    expect(getAddress().city).toBe(original.city);

    const saved = saveAddress({ ...original, city: 'Istanbul' });
    saved.city = 'Changed locally';
    expect(getAddress().city).toBe('Istanbul');

    saveAddress(original);
  });

  it('enables only the explicit cancel-bug mode', () => {
    process.env.TESTBED_MODE = 'cancel-bug';
    expect(getMode()).toBe('cancel-bug');

    process.env.TESTBED_MODE = 'anything-else';
    expect(getMode()).toBe('healthy');
  });
});

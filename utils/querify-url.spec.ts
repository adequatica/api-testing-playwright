import { describe, expect, it } from 'vitest';

import { querifyUrl } from './querify-url';

describe('querifyUrl', () => {
  it('should return empty string for empty params', () => {
    expect(querifyUrl({})).toBe('');
  });

  it('should serialize a single key-value pair', () => {
    expect(querifyUrl({ foo: 'bar' })).toBe('foo=bar');
  });

  it('should serialize multiple params', () => {
    const result = querifyUrl({ a: '1', b: '2', c: '3' });
    expect(result).toBe('a=1&b=2&c=3');
  });
});

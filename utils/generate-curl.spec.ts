import { describe, it, expect } from 'vitest';

import { escapeShellArg, buildQueryParamsString, generateCurl } from './generate-curl';

describe('generateCurl', () => {
  it('should generate a simple GET request with just a URL', () => {
    const result = generateCurl('https://api.example.com/endpoint');
    expect(result).toBe("curl -i -X GET 'https://api.example.com/endpoint'");
  });

  it('should generate a simple GET request with just a URL and no options', () => {
    const result = generateCurl('https://api.example.com/data', {});
    expect(result).toBe("curl -i -X GET 'https://api.example.com/data'");
  });

  it('should generate a POST request', () => {
    const result = generateCurl('https://api.example.com/endpoint', {
      method: 'POST',
    });
    expect(result).toBe("curl -i -X POST 'https://api.example.com/endpoint'");
  });

  it('should generate a request with query parameter', () => {
    const result = generateCurl('https://api.example.com/endpoint', {
      params: { foo: 'bar' },
    });
    expect(result).toBe("curl -i -X GET 'https://api.example.com/endpoint?foo=bar'");
  });

  it('should generate a request with headers', () => {
    const result = generateCurl('https://api.example.com/endpoint', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
      },
    });
    expect(result).toContain("-H 'Content-Type: application/json'");
    expect(result).toContain("-H 'Authorization: Bearer token'");
  });

  it('should generate a request with body', () => {
    const result = generateCurl('https://api.example.com/endpoint', {
      data: {
        user: {
          name: 'Igor',
        },
      },
    });
    expect(result).toContain('-d \'{"user":{"name":"Igor"}}\'');
  });

  it('should generate a request with all options', () => {
    const result = generateCurl('https://api.example.com/endpoint', {
      method: 'GET',
      params: { q: 'test', limit: 10 },
      headers: { 'Content-Type': 'application/json' },
      data: { foo: 'bar' },
    });

    expect(result).toContain('curl -i -X GET');
    expect(result).toContain('https://api.example.com/endpoint?q=test&limit=10');
    expect(result).toContain("-H 'Content-Type: application/json'");
    expect(result).toContain('-d \'{"foo":"bar"}\'');
  });
});

describe('escapeShellArg', () => {
  it('should return the same string if no single quotes are present', () => {
    const result = escapeShellArg('hello world');
    expect(result).toBe('hello world');
  });

  it('should escape a single quote', () => {
    const result = escapeShellArg("it's");
    expect(result).toBe("it'\\''s");
  });

  it('should escape single quotes in JSON strings', () => {
    const result = escapeShellArg('{"name":"O\'Brien"}');
    expect(result).toBe('{"name":"O\'\\\'\'Brien"}');
  });

  it('should handle empty string', () => {
    const result = escapeShellArg('');
    expect(result).toBe('');
  });
});

describe('buildQueryParamsString', () => {
  it('should return empty string for empty object', () => {
    const result = buildQueryParamsString({});
    expect(result).toBe('');
  });

  it('should build query string with single parameter', () => {
    const result = buildQueryParamsString({ foo: 'bar' });
    expect(result).toBe('?foo=bar');
  });

  it('should build query string with multiple parameters', () => {
    const result = buildQueryParamsString({ foo: 'bar', limit: 10, offset: 0 });
    expect(result).toBe('?foo=bar&limit=10&offset=0');
  });

  it('should handle array values', () => {
    const result = buildQueryParamsString({ tags: ['foo', 'bar'] });
    expect(result).toBe('?tags=foo&tags=bar');
  });
});

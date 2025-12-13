import { describe, it, expect } from 'vitest';

import { generateCurl } from './genrate-curl';

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

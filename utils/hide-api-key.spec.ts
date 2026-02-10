import { describe, expect, it } from 'vitest';

import { hideApiKey } from './hide-api-key';

describe('hideApiKey', () => {
  it('should hide api_key value from URL', () => {
    const url = 'https://api.example.com/endpoint?api_key=secretFooBar';
    const result = hideApiKey(url);
    expect(result).toBe('https://api.example.com/endpoint?api_key=***');
  });

  it('should hide api_key value from URL when it is in the middle of parameters', () => {
    const url = 'https://api.example.com/endpoint?first=1&api_key=secretFooBar&last=2';
    const result = hideApiKey(url);
    expect(result).toBe('https://api.example.com/endpoint?first=1&api_key=***&last=2');
  });

  it('should not hide DEMO_KEY value from URL', () => {
    const url = 'https://api.example.com/endpoint?api_key=DEMO_KEY';
    const result = hideApiKey(url);
    expect(result).toBe(url);
  });

  it('should return original URL when no api_key parameter', () => {
    const url = 'https://api.example.com/endpoint?foo=bar';
    const result = hideApiKey(url);
    expect(result).toBe(url);
  });

  it('should return original URL when no query parameters', () => {
    const url = 'https://api.example.com/endpoint';
    const result = hideApiKey(url);
    expect(result).toBe(url);
  });
});

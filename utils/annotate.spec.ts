import test from '@playwright/test';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { annotateUrl } from './annotate';

// Mock the default export (test) from @playwright/test
vi.mock('@playwright/test', () => ({
  default: {
    info: vi.fn(),
  },
}));

describe('annotateUrl', () => {
  let mockAnnotations: Array<{ type: string; description: string }>;
  let mockTestInfoFn: Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup mock annotations array
    mockAnnotations = [];

    // Setup mock for test.info().annotations
    mockTestInfoFn = vi.fn(() => ({
      annotations: mockAnnotations,
    }));
    (test.info as Mock) = mockTestInfoFn;
  });

  it('should add URL annotation with simple URL', async () => {
    const testUrl = 'https://api.example.com/endpoint';

    await annotateUrl(testUrl);

    expect(mockTestInfoFn).toHaveBeenCalled();
    expect(mockAnnotations).toHaveLength(1);
    expect(mockAnnotations[0]).toEqual({
      type: 'URL',
      description: testUrl,
    });
  });

  it('should add URL annotation with URL containing query parameters', async () => {
    const testUrl = 'https://api.example.com/endpoint?foo=bar&limit=10';

    await annotateUrl(testUrl);

    expect(mockTestInfoFn).toHaveBeenCalled();
    expect(mockAnnotations).toHaveLength(1);
    expect(mockAnnotations[0]).toEqual({
      type: 'URL',
      description: testUrl,
    });
  });
});

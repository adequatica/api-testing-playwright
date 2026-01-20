import { APIResponse, test } from '@playwright/test';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import { attachCurl, attachResponse } from './attach';
import { generateCurl, RequestOptions } from './generate-curl';

vi.mock('@playwright/test', () => ({
  test: {
    info: vi.fn(),
  },
}));

vi.mock('./generate-curl', () => ({
  generateCurl: vi.fn(),
}));

describe('attachCurl', () => {
  let mockAttach: Mock;
  let mockTestInfo: Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup mock for test.info().attach
    mockAttach = vi.fn();
    mockTestInfo = vi.fn(() => ({
      attach: mockAttach,
    }));
    (test.info as Mock) = mockTestInfo;
  });

  it('should attach cURL command with URL only', async () => {
    const testUrl = 'https://api.example.com/endpoint';
    const mockCurlCommand = 'curl -i -X GET https://api.example.com/endpoint';

    (generateCurl as Mock).mockReturnValue(mockCurlCommand);

    await attachCurl(testUrl);

    expect(generateCurl).toHaveBeenCalledWith(testUrl, undefined);
    expect(mockTestInfo).toHaveBeenCalled();
    expect(mockAttach).toHaveBeenCalledWith(`cURL command ${testUrl}`, {
      body: mockCurlCommand,
      contentType: 'text/plain',
    });
  });

  it('should attach cURL command with URL and request parameters', async () => {
    const testUrl = 'https://api.example.com/endpoint';
    const requestParams: RequestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
      },
      data: {
        key: 'value',
      },
    };
    const mockCurlCommand =
      "curl -i -X POST 'https://api.example.com/endpoint' -H 'Content-Type: application/json' -H 'Authorization: Bearer token' -d '{\"key\":\"value\"}'";

    (generateCurl as Mock).mockReturnValue(mockCurlCommand);

    await attachCurl(testUrl, requestParams);

    expect(generateCurl).toHaveBeenCalledWith(testUrl, requestParams);
    expect(mockTestInfo).toHaveBeenCalled();
    expect(mockAttach).toHaveBeenCalledWith(`cURL command ${testUrl}`, {
      body: mockCurlCommand,
      contentType: 'text/plain',
    });
  });
});

describe('attachResponse', () => {
  let mockAttach: Mock;
  let mockTestInfo: Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup mock for test.info().attach()
    mockAttach = vi.fn();
    mockTestInfo = vi.fn(() => ({
      attach: mockAttach,
    }));
    (test.info as Mock) = mockTestInfo;
  });

  it('should attach response with valid APIResponse', async () => {
    const testUrl = 'https://api.example.com/endpoint';
    const mockResponseBody = JSON.stringify({ success: true, data: 'test' });

    const mockResponse = {
      status: vi.fn().mockReturnValue(200),
      statusText: vi.fn().mockReturnValue('OK'),
      text: vi.fn().mockResolvedValue(mockResponseBody),
    } as unknown as APIResponse;

    await attachResponse(testUrl, mockResponse);

    expect(mockResponse.status).toHaveBeenCalled();
    expect(mockResponse.statusText).toHaveBeenCalled();
    expect(mockResponse.text).toHaveBeenCalled();
    expect(mockTestInfo).toHaveBeenCalled();
    expect(mockAttach).toHaveBeenCalledWith(`Response 200 OK ${testUrl}`, {
      body: mockResponseBody,
      contentType: 'text/plain',
    });
  });

  it('should handle undefined response', async () => {
    const testUrl = 'https://api.example.com/endpoint';

    await attachResponse(testUrl, undefined);

    expect(mockTestInfo).toHaveBeenCalled();
    expect(mockAttach).toHaveBeenCalledWith(`Response N/A ${testUrl}`, {
      body: '',
      contentType: 'text/plain',
    });
  });

  it('should attach response with empty body', async () => {
    const testUrl = 'https://api.example.com/endpoint';

    const mockResponse = {
      status: vi.fn().mockReturnValue(204),
      statusText: vi.fn().mockReturnValue('No Content'),
      text: vi.fn().mockResolvedValue(''),
    } as unknown as APIResponse;

    await attachResponse(testUrl, mockResponse);

    expect(mockAttach).toHaveBeenCalledWith(`Response 204 No Content ${testUrl}`, {
      body: '',
      contentType: 'text/plain',
    });
  });
});

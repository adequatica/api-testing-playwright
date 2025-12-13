import { APIResponse, expect as baseExpect } from '@playwright/test';

export const expect = baseExpect.extend({
  async toHaveStatusCode(receivedResponse: APIResponse, expected: number) {
    const assertionName = 'toHaveStatusCode';
    const statusCode = receivedResponse.status();
    const pass = statusCode === expected;

    let body = '';
    try {
      body = await receivedResponse.json();
    } catch {
      // Response may be empty or not JSON
      body = await receivedResponse.text();
    }

    const message = `
    Expected status code: ${expected}
    Received status code: ${statusCode}
    Requested URL: ${receivedResponse.url()}
    Received body: ${typeof body === 'string' ? body : JSON.stringify(body)}
    `;

    if (pass) {
      return {
        message: () => message,
        pass: true,
        name: assertionName,
      };
    } else {
      return {
        message: () => message,
        pass: false,
        name: assertionName,
      };
    }
  },
});

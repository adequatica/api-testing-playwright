import { defineConfig } from '@playwright/test';

import { PLAYWRIGHT_TIMEOUTS } from './constants/timeouts';
import { BASE_URL, CI } from './utils/env';

export default defineConfig({
  timeout: PLAYWRIGHT_TIMEOUTS.defaultTestTimeout,
  expect: {
    timeout: PLAYWRIGHT_TIMEOUTS.defaultExpectTimeout,
  },
  forbidOnly: !!CI,
  retries: CI ? 3 : 0,
  workers: 1,
  maxFailures: CI ? 10 : 0,
  reporter: [
    ['list'],
    [
      'html',
      {
        open: CI ? 'never' : 'on-failure',
      },
    ],
  ],
  projects: [
    {
      use: {
        trace: 'retain-on-failure',
        ignoreHTTPSErrors: true,
        baseURL: BASE_URL,
      },
      testDir: './tests',
    },
  ],
});

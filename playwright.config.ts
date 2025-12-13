import { defineConfig } from '@playwright/test';

import { ONE_MINUTE } from './constants/timeouts';
import { CI, BASE_URL } from './utils/env';

export default defineConfig({
  timeout: ONE_MINUTE * 2,
  expect: {
    timeout: ONE_MINUTE,
  },
  forbidOnly: !!CI,
  retries: CI ? 3 : 0,
  workers: CI ? 1 : undefined,
  maxFailures: CI ? 10 : undefined,
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
        trace: 'on-first-retry',
        ignoreHTTPSErrors: true,
        baseURL: BASE_URL,
      },
      testDir: './tests',
    },
  ],
});

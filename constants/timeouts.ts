export const ONE_SECOND = 1_000;
export const ONE_MINUTE = 60 * 1_000;

export const PLAYWRIGHT_TIMEOUTS = {
  defaultTestTimeout: ONE_MINUTE * 2,
  defaultExpectTimeout: ONE_MINUTE,
} as const;

export const FIBONACCI = [3_000, 5_000, 8_000, 13_000, 21_000, 34_000];

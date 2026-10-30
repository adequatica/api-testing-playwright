import { BASE_HOST } from '../constants/endpoints';

const CI = process.env.CI;

if (CI && !process.env.API_KEY) {
  console.warn('API_KEY is not set in CI — falling back to DEMO_KEY.');
}

if (CI && !process.env.BASE_URL) {
  console.warn(`BASE_URL is not set in CI — falling back to default host ${BASE_HOST}.`);
}

const API_KEY = process.env.API_KEY || 'DEMO_KEY';

const BASE_URL = process.env.BASE_URL || BASE_HOST;

export { CI, API_KEY, BASE_URL };

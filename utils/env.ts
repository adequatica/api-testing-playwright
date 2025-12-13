import { BASE_HOST } from '../constants/endpoints';

const CI = process.env.CI;

const API_KEY = process.env.API_KEY || 'DEMO_KEY';

const BASE_URL = process.env.BASE_URL || BASE_HOST;

export { CI, API_KEY, BASE_URL };

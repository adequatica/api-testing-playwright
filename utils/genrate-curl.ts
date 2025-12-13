import { hideApiKey } from './hide-api-key';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>;
}

export function generateCurl(url: string, options: RequestOptions = {}): string {
  const { method, params, headers = {}, data } = options;

  // Build method string
  const methodString = method || 'GET';

  // Build query string from params
  const queryString = params
    ? '?' +
      Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join('&')
    : '';

  // Build headers string
  const headerString = Object.entries(headers)
    .map(([key, value]) => `-H '${key}: ${value}'`)
    .join(' ');

  // Build data string if present
  const dataString = data ? `-d '${JSON.stringify(data)}'` : '';

  // Build final cURL command
  // -i option is handy for debugging
  return `curl -i -X ${methodString} '${hideApiKey(`${url}${queryString}`)}' ${headerString} ${dataString}`.trim();
}

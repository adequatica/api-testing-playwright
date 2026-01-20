import { hideApiKey } from './hide-api-key';

type CurlQueryParams = Record<string, string | number | boolean | Array<string | number>>;

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  params?: CurlQueryParams;
  headers?: Record<string, string>;
  data?: unknown;
  pretty?: boolean;
};

export function escapeShellArg(arg: string): string {
  return arg.replace(/'/g, "'\\''");
}

export function buildQueryParamsString(queryParams: CurlQueryParams): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(queryParams)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
    } else {
      searchParams.append(key, String(value));
    }
  }

  const queryString = searchParams.toString();

  return queryString ? '?' + queryString : '';
}

export function generateCurl(url: string, options: RequestOptions = {}): string {
  const { method = 'GET', params, headers = {}, data, pretty = false } = options;

  const parts: string[] = [`curl -i -X ${method}`];
  // Pretty curl may split into new lines
  const newline = pretty ? ' \\\n  ' : ' ';

  const queryParamsString = params ? buildQueryParamsString(params) : '';
  parts.push(`'${hideApiKey(url + queryParamsString)}'`);

  for (const [key, value] of Object.entries(headers)) {
    if (value !== undefined && value !== null && value !== '') {
      parts.push(`-H '${escapeShellArg(key)}: ${escapeShellArg(value)}'`);
    }
  }

  if (data !== undefined && data !== null) {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    parts.push(`-d '${escapeShellArg(dataString)}'`);
  }

  return parts.join(newline);
}

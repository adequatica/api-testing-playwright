/**
 * Masks the `api_key` query parameter value in an absolute URL.
 * Returns the input unchanged if it is not a valid absolute URL.
 */
export function hideApiKey(url: string): string {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    // Not a valid absolute URL — nothing to mask, return as-is
    return url;
  }

  const apiKey = parsedUrl.searchParams.get('api_key');

  // If no api_key parameter exists or it's DEMO_KEY, return original URL
  if (!apiKey || apiKey === 'DEMO_KEY') {
    return url;
  }

  // Replace api_key value with asterisks
  parsedUrl.searchParams.set('api_key', '***');

  return parsedUrl.toString();
}

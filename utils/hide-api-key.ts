export function hideApiKey(url: string): string {
  try {
    const parsedUrl = new URL(url);
    const apiKey = parsedUrl.searchParams.get('api_key');

    // If no api_key parameter exists or it's DEMO_KEY, return original URL
    if (!apiKey || apiKey === 'DEMO_KEY') {
      return url;
    }

    // Replace api_key value with asterisks
    parsedUrl.searchParams.set('api_key', '***');

    return parsedUrl.toString();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // If URL parsing fails, return original string
    return url;
  }
}

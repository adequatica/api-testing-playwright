import { APIResponse, test } from '@playwright/test';

import { generateCurl, RequestOptions } from './generate-curl';
import { hideApiKey } from './hide-api-key';

export const attachCurl = async (fullUrl: string, requestParams?: RequestOptions) => {
  const urlWithHiddenApiKey = hideApiKey(fullUrl);

  await test.info().attach(`cURL command ${urlWithHiddenApiKey}`, {
    body: generateCurl(fullUrl, requestParams),
    contentType: 'text/plain',
  });
};

export const attachResponse = async (fullUrl: string, response?: APIResponse | undefined) => {
  const urlWithHiddenApiKey = hideApiKey(fullUrl);
  const responseStatus = response ? `${response.status()} ${response.statusText()}` : 'N/A';

  let responseData = '';
  if (response) {
    try {
      responseData = await response.text();
    } catch {
      // Body may be unavailable (e.g. stream already consumed or network error)
      responseData = '<unable to read response body>';
    }
  }

  await test.info().attach(`Response ${responseStatus} ${urlWithHiddenApiKey}`, {
    body: responseData,
    contentType: 'text/plain',
  });
};

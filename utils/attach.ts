import { APIResponse, test } from '@playwright/test';

import { RequestOptions, generateCurl } from './generate-curl';
import { hideApiKey } from './hide-api-key';

export const attachCurl = async (fullUrl: string, requestParams?: RequestOptions) => {
  const urlWithHiddedApiKey = hideApiKey(fullUrl);

  await test.info().attach(`cURL command ${urlWithHiddedApiKey}`, {
    body: generateCurl(urlWithHiddedApiKey, requestParams),
    contentType: 'text/plain',
  });
};

export const attachResponse = async (fullUrl: string, response?: APIResponse | undefined) => {
  const urlWithHiddedApiKey = hideApiKey(fullUrl);
  const responseStatus = response ? `${response.status()} ${response.statusText()}` : 'N/A';
  const responseData = response ? await response.text() : '';

  await test.info().attach(`Response ${responseStatus} ${urlWithHiddedApiKey}`, {
    body: responseData,
    contentType: 'text/plain',
  });
};

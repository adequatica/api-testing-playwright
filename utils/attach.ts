import { APIResponse, test } from '@playwright/test';

import { RequestOptions, generateCurl } from './genrate-curl';

export const attachCurl = async (
  fullUrl: string,

  requestParams?: RequestOptions,
) => {
  await test.info().attach(`cURL command ${fullUrl}`, {
    body: generateCurl(fullUrl, requestParams),
    contentType: 'text/plain',
  });
};

export const attachResponse = async (
  fullUrl: string,

  response?: APIResponse | undefined,
) => {
  const responseStatus = response ? `${response.status()} ${response.statusText()}` : 'N/A';
  const responseData = response ? await response.text() : '';

  await test.info().attach(`Response ${responseStatus} ${fullUrl}`, {
    body: responseData,
    contentType: 'text/plain',
  });
};

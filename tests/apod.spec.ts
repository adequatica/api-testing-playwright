import { APIResponse, test } from '@playwright/test';
import dayjs from 'dayjs';

import { ONE_MINUTE, FIBONACCI } from '../constants/timeouts';
import { schema as apodBodySchema } from '../schemas/apod';
import { annotateUrl } from '../utils/annotate';
import { attachCurl, attachResponse } from '../utils/attach';
import { API_KEY, BASE_URL } from '../utils/env';
import { expect } from '../utils/fixtures';

const urlQueryParams = {
  // https://day.js.org/docs/en/display/format
  date: dayjs().format('YYYY-MM-DD'),
  api_key: API_KEY,
};

const urlQuery = new URLSearchParams(urlQueryParams).toString();

test.describe('Astronomy Picture of the Day', () => {
  test(
    'APOD request',
    {
      tag: ['@nasa', '@apod'],
    },
    async ({ request }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let requestBody: any;

      await test.step('Make HTTP request', async () => {
        // Example of polling HTTP request until 200 status code or defined body
        await expect
          .poll(
            async () => {
              const fullUrl = `${BASE_URL}?${urlQuery}`;

              await annotateUrl(fullUrl);
              await attachCurl(fullUrl);

              const response: APIResponse = await request.get(fullUrl);

              // Retry on non 200 status codes
              if (response.status() != 200) {
                await attachResponse(fullUrl, response);
                return undefined;
              }

              await attachResponse(fullUrl, response);
              const responseBodyJson = await response.json();
              expect(responseBodyJson, 'Response body should not be undefined').not.toBeUndefined();

              requestBody = responseBodyJson;
              return requestBody;
            },
            {
              intervals: FIBONACCI,
              timeout: ONE_MINUTE,
            },
          )
          .not.toBeUndefined();
      });

      await test.step('Validate schems', async () => {
        expect(() => apodBodySchema.parse(requestBody), 'Response body should have valid schema').not.toThrowError();
      });
    },
  );
});

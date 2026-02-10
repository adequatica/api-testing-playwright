import { APIResponse, test } from '@playwright/test';

import { ENDPOINTS } from '../constants/endpoints';
import { schemaBrowse as neoBrowseBodySchema, schemaLookup as neoLookupBodySchema } from '../schemas/neo';
import { annotateUrl } from '../utils/annotate';
import { attachCurl, attachResponse } from '../utils/attach';
import { API_KEY, BASE_URL } from '../utils/env';
import { expect } from '../utils/fixtures';
import { querifyUrl } from '../utils/querify-url';

const urlQuery = querifyUrl({
  api_key: API_KEY,
});

test.describe('Near Earth Object Web Service', () => {
  test(
    'NeoWs request',
    {
      tag: ['@nasa', '@neo'],
    },
    async ({ request }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let responseNeoBrowseBody: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let responseNeoLookupBody: any;

      await test.step('Make Neo Browse HTTP request', async () => {
        // https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=DEMO_KEY
        const fullUrl = `${BASE_URL}${ENDPOINTS.neoBrowse}?${urlQuery}`;

        await annotateUrl(fullUrl);
        await attachCurl(fullUrl);

        const response: APIResponse = await request.get(fullUrl);
        await expect(response, 'Should have 200 status code').toHaveStatusCode(200);

        await attachResponse(fullUrl, response);
        const responseBodyJson = await response.json();
        expect(responseBodyJson, 'Response body should not be undefined').not.toBeUndefined();

        responseNeoBrowseBody = responseBodyJson;
      });

      await test.step('Validate Neo Browse schems', () => {
        expect(
          () => neoBrowseBodySchema.parse(responseNeoBrowseBody),
          'Response body should have valid schema',
        ).not.toThrowError();
      });

      await test.step('Make Neo Lookup HTTP request', async () => {
        const firstNearEarthObject = responseNeoBrowseBody.near_earth_objects[0].id;
        // https://api.nasa.gov/neo/rest/v1/neo/2001620?api_key=DEMO_KEY
        const fullUrl = `${BASE_URL}${ENDPOINTS.neo}/${firstNearEarthObject}?${urlQuery}`;

        await annotateUrl(fullUrl);
        await attachCurl(fullUrl);

        const response: APIResponse = await request.get(fullUrl);
        await expect(response, 'Should have 200 status code').toHaveStatusCode(200);

        await attachResponse(fullUrl, response);
        const responseBodyJson = await response.json();
        expect(responseBodyJson, 'Response body should not be undefined').not.toBeUndefined();

        responseNeoLookupBody = responseBodyJson;
      });

      await test.step('Validate Neo Lookup schems', () => {
        expect(
          () => neoLookupBodySchema.parse(responseNeoLookupBody),
          'Response body should have valid schema',
        ).not.toThrowError();
      });
    },
  );
});

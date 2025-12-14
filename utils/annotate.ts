import test from '@playwright/test';

import { hideApiKey } from './hide-api-key';

export const annotateUrl = async (fullUrl: string) => {
  const urlWithHiddedApiKey = hideApiKey(fullUrl);

  test.info().annotations.push({
    type: 'URL',
    description: urlWithHiddedApiKey,
  });
};

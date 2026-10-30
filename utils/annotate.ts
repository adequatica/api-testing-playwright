import test from '@playwright/test';

import { hideApiKey } from './hide-api-key';

export const annotateUrl = (fullUrl: string) => {
  const urlWithHiddenApiKey = hideApiKey(fullUrl);

  test.info().annotations.push({
    type: 'URL',
    description: urlWithHiddenApiKey,
  });
};

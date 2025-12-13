import test from '@playwright/test';

export const annotateUrl = async (fullUrl: string) => {
  test.info().annotations.push({
    type: 'URL',
    description: fullUrl,
  });
};

import { RESPONSE_TIMEOUT } from '@_pw-config';
import { Page, Response } from '@playwright/test';

export async function waitForResponse(
  page: Page,
  endpoint: string,
  requestMethod?: string,
  statusCode?: number,
): Promise<Response> {
  return page.waitForResponse(
    (response) => {
      return (
        response.url().includes(endpoint) &&
        (!requestMethod || response.request().method() == requestMethod) &&
        (!statusCode || response.status() == statusCode)
      );
    },
    {
      timeout: RESPONSE_TIMEOUT,
    },
  );
}

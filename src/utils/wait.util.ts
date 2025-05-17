import { RESPONSE_TIMEOUT } from '@_pw-config';
import { Page, Response } from '@playwright/test';

interface WaitForResponseOptions {
  page: Page;
  endpoint: string;
  requestMethod?: string;
  statusCode?: number;
}

export async function waitForResponse(
  waitForResponseOptions: WaitForResponseOptions,
): Promise<Response> {
  return waitForResponseOptions.page.waitForResponse(
    (response) => {
      return (
        response.url().includes(waitForResponseOptions.endpoint) &&
        (!waitForResponseOptions.requestMethod ||
          response.request().method() ===
            waitForResponseOptions.requestMethod) && // porównanie wartości a nie referencji
        (!waitForResponseOptions.statusCode ||
          response.status() === waitForResponseOptions.statusCode)
      );
    },
    {
      timeout: RESPONSE_TIMEOUT,
    },
  );
}

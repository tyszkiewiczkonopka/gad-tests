import { RESPONSE_TIMEOUT } from '@_pw-config';
import { Page, Response } from '@playwright/test';

export async function waitForResponse(
  page: Page,
  endpoint: string,
): Promise<Response> {
  return page.waitForResponse(endpoint, {
    timeout: RESPONSE_TIMEOUT,
  });
}

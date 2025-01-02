import { Page } from '@playwright/test';

export class BasePage {
  url: string;

  constructor(protected page: Page) {
    this.url = '';
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }

  async getTitle(): Promise<string> {
    await this.page.waitForLoadState();
    return await this.page.title();
  }

  async waitForPageToLoadURL(): Promise<void> {
    await this.page.waitForURL(this.url);
  }
}

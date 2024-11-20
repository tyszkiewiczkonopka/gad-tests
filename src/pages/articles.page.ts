import { Page } from '@playwright/test';
import { url } from 'inspector';

export class ArticlesPage {
  url = '/articles.html';
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }

  async title(): Promise<string>{
    return await this.page.title();
  }
}

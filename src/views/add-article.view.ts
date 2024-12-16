import { Page } from '@playwright/test';

export class AddArticleView {
  titleInput;
  bodyInput;
  saveButton;
  header;

  constructor(private page: Page) {
    this.titleInput = this.page.getByTestId('title-input');
    this.bodyInput = this.page.getByTestId('body-text');
    this.saveButton = this.page.getByTestId('save');
    this.header = this.page.getByRole('heading', { name: 'Add New Entry' });
  }
}

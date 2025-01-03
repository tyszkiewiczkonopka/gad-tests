import { Page } from '@playwright/test';

export class AddCommentView {
  bodyInput;
  saveButton;
  addNewHeader;

  constructor(private page: Page) {
    this.bodyInput = this.page.locator('#body');
    this.saveButton = this.page.getByRole('button', { name: 'Save' });
    this.addNewHeader = this.page.getByRole('heading', {
      name: 'Add New Comment',
    });
  }
}

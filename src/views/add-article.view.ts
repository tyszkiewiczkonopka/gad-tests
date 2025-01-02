import { AddArticleModel } from '../models/article.model';
import { Page } from '@playwright/test';

export class AddArticleView {
  titleInput;
  bodyInput;
  saveButton;
  addNewHeader;
  alertPopup;

  constructor(private page: Page) {
    this.titleInput = this.page.getByTestId('title-input');
    this.bodyInput = this.page.getByTestId('body-text');
    this.saveButton = this.page.getByTestId('save');
    this.addNewHeader = this.page.getByRole('heading', {
      name: 'Add New Entry',
    });
    this.alertPopup = this.page.getByTestId('alert-popup');
  }

  async createArticle(addArticle: AddArticleModel): Promise<void> {
    await this.titleInput.fill(addArticle.title);
    await this.bodyInput.fill(addArticle.body);
    await this.saveButton.click();
  }
}

import { AddCommentModel } from '../models/comment.model';
import { Page } from '@playwright/test';

export class EditCommentView {
  bodyInput;
  updateButton;

  constructor(private page: Page) {
    this.bodyInput = this.page.locator('#body');
    this.updateButton = this.page.getByTestId('update-button');
  }

  async editComment(commentData: AddCommentModel): Promise<void> {
    //comment should have the structure of this model
    await this.bodyInput.fill(commentData.body);
    await this.updateButton.click();
  }
}

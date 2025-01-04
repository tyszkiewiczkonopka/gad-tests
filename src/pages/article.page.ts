//import { MainMenuComponent } from '../components/main-menu.components';
import { AddCommentModel } from '../models/comment.model';
import { AddCommentView } from '../views/add-comment.view';
import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

interface ArticleComment {
  body: Locator;
  link: Locator;
} //specific to this page object, therefore not saved as a separate model

export class ArticlePage extends BasePage {
  url = '/articles.html';
  //mainMenu = new MainMenuComponent(this.page);
  addCommentView = new AddCommentView(this.page);

  articleTitle = this.page.getByTestId('article-title');
  articleBody = this.page.getByTestId('article-body');
  deleteIcon = this.page.getByTestId('delete');
  addCommentButton = this.page.locator('#add-new');
  alertPopup = this.page.getByTestId('alert-popup');

  constructor(page: Page) {
    super(page);
  }

  async deleteArticle(): Promise<void> {
    this.page.on('dialog', async (dialog) => {
      await dialog.accept();
    }); //handles dialog window (pop-up)
    await this.deleteIcon.click();
  }

  getArticleComment(body: string): ArticleComment {
    const commentContainer = this.page
      .locator('.comment-container')
      .filter({ hasText: body });

    return {
      body: commentContainer.locator(':text("comment:") + span'),
      link: commentContainer.locator("[id^='gotoComment']"),
    }; //return an object
  }

  async addNewComment(newCommentData: AddCommentModel): Promise<void> {
    await this.addCommentButton.click();
    await this.addCommentView.createComment(newCommentData);
  }
}

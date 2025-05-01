import { BasePage } from './base.page';
import { MainMenuComponent } from '@_src/components/main-menu.components';
import { Page } from '@playwright/test';

export class CommentsPage extends BasePage {
  url = '/comments.html';
  mainMenu: MainMenuComponent;

  constructor(page: Page) {
    super(page);
    this.mainMenu = new MainMenuComponent(this.page);
  }
}

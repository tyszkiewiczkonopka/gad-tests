import { ArticlePage } from '../src/pages/article.page';
import { ArticlesPage } from '../src/pages/articles.page';
import { LoginPage } from '../src/pages/login.page';
import { testUser1 } from '../src/test-data/user.data';
import { AddArticleView } from '../src/views/add-article.view';
import test, { expect } from '@playwright/test';

test.describe('Verify articles', () => {
  test('create new article @GAD_R04_01', async ({ page }) => {
    //Arrange
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUser1);

    const articlesPage = new ArticlesPage(page);
    await articlesPage.goto();

    //Act
    await articlesPage.addArticleButtonLogged.click();

    const addArticleView = new AddArticleView(page);
    await expect.soft(addArticleView.header).toBeVisible();

    const newArticleTitle = 'New article title';
    const newArticleBody = 'New article body';

    await addArticleView.titleInput.fill(newArticleTitle);
    await addArticleView.bodyInput.fill(newArticleBody);
    await addArticleView.saveButton.click();

    //Assert
    const articlePage = new ArticlePage(page);
    await expect.soft(articlePage.articleTitle).toHaveText(newArticleTitle);
    await expect.soft(articlePage.articleBody).toHaveText(newArticleBody);
  });
});

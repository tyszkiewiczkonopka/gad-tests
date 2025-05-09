import { prepareRandomNewArticle } from '@_src/factories/article.factory';
import { ArticlesPage } from '@_src/pages/articles.page';
import { AddArticleView } from '@_src/views/add-article.view';
import { expect, test } from '@playwright/test';
import * as fs from 'fs';

test.describe('Verify articles', () => {
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);

    // Restore the session by setting the cookies and storage data
    const sessionData = JSON.parse(
      fs.readFileSync('tmp/session.json', 'utf-8'),
    );
    await page.context().addCookies(sessionData.cookies);
    await page.context().storageState(sessionData.localStorage);

    await articlesPage.goto();
    addArticleView = await articlesPage.clickAddArticleButtonLogged();

    await expect.soft(addArticleView.addNewHeader).toBeVisible();
  });

  test('reject creating article without title @GAD-R04-01 @logged', async () => {
    // Arrange
    const expectedErrorMessage = 'Article was not created';
    const articleData = prepareRandomNewArticle();
    articleData.title = '';

    // Act
    await addArticleView.createArticle(articleData);

    // Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
  });

  test('reject creating article without body @GAD-R04-01 @logged', async () => {
    // Arrange
    const expectedErrorMessage = 'Article was not created';
    const articleData = prepareRandomNewArticle();
    articleData.body = '';

    // Act
    await addArticleView.createArticle(articleData);

    // Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
  });

  test.describe('title length', () => {
    test('reject creating article with title exceeding 128 signs @GAD-R04-02 @logged', async () => {
      // Arrange
      const expectedErrorMessage = 'Article was not created';
      const articleData = prepareRandomNewArticle(129);

      // Act
      await addArticleView.createArticle(articleData);

      // Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
    });

    test('create article with title with 128 signs @GAD-R04-02 @logged', async () => {
      // Arrange
      const articleData = prepareRandomNewArticle(128);

      // Act
      const articlePage = await addArticleView.createArticle(articleData);

      // Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    });
  });
});

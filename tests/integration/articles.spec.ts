import { prepareRandomNewArticle } from '@_src/factories/article.factory';
import { ArticlePage } from '@_src/pages/article.page';
import { ArticlesPage } from '@_src/pages/articles.page';
import { AddArticleView } from '@_src/views/add-article.view';
import test, { expect } from '@playwright/test';
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

    const addArticleView = await articlesPage.clickAddArticleButtonLogged();
    await expect.soft(addArticleView.addNewHeader).toBeVisible();
  });

  test('new article not created - missing title @GAD_R04_01 @negative @logged', async () => {
    //Arrange
    const expectedErrorMessage = 'Article was not created';

    const articleData = prepareRandomNewArticle();
    articleData.title = '';

    //Act
    await addArticleView.createArticle(articleData);

    //Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
  });

  test('new article not created - missing body @GAD_R04_01 @negative @logged', async () => {
    //Arrange
    const expectedErrorMessage = 'Article was not created';

    const articleData = prepareRandomNewArticle();
    articleData.body = '';

    //Act
    await addArticleView.createArticle(articleData);

    //Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
  });
  test.describe('Title length', () => {
    test('new article not created - title 128 characters @GAD_R04_01 @positive @logged', async ({
      page,
    }) => {
      //Arrange
      const articlePage = new ArticlePage(page);
      const articleData = prepareRandomNewArticle(128);

      //Act
      await addArticleView.createArticle(articleData);

      //Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
      await expect
        .soft(articlePage.articleBody)
        .toHaveText(articleData.body, { useInnerText: true });
    });

    test('new article not created - title over 128 characters @GAD_R04_01 @negative @logged', async () => {
      //Arrange
      const expectedErrorMessage = 'Article was not created';
      const articleData = prepareRandomNewArticle(129);

      //Act
      await addArticleView.createArticle(articleData);

      //Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
    });
  });
});

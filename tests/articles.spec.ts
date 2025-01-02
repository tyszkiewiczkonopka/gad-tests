import { randomNewArticle } from '../src/factories/article.factory';
import { ArticlePage } from '../src/pages/article.page';
import { ArticlesPage } from '../src/pages/articles.page';
import { LoginPage } from '../src/pages/login.page';
import { testUser1 } from '../src/test-data/user.data';
import { AddArticleView } from '../src/views/add-article.view';
import test, { expect } from '@playwright/test';

test.describe('Verify articles', () => {
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();

    await articlesPage.addArticleButtonLogged.click();
    await expect.soft(addArticleView.addNewHeader).toBeVisible();
  });

  test('new article not created - missing title @GAD_R04_01 @negative', async () => {
    //Arrange
    const expectedErrorMessage = 'Article was not created';

    const articleData = randomNewArticle();
    articleData.title = '';

    //Act
    await addArticleView.createArticle(articleData);

    //Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
  });

  test('new article not created - missing body @GAD_R04_01 @negative', async () => {
    //Arrange
    const expectedErrorMessage = 'Article was not created';

    const articleData = randomNewArticle();
    articleData.body = '';

    //Act
    await addArticleView.createArticle(articleData);

    //Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
  });
  test.describe('Title length', () => {
    test('new article not created - title 128 characters @GAD_R04_01 @positive', async ({
      page,
    }) => {
      //Arrange
      const articlePage = new ArticlePage(page);
      const articleData = randomNewArticle(128);

      //Act
      await addArticleView.createArticle(articleData);

      //Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
      await expect
        .soft(articlePage.articleBody)
        .toHaveText(articleData.body, { useInnerText: true });
    });

    test('new article not created - title over 128 characters @GAD_R04_01 @negative', async () => {
      //Arrange
      const expectedErrorMessage = 'Article was not created';
      const articleData = randomNewArticle(129);

      //Act
      await addArticleView.createArticle(articleData);

      //Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
    });
  });
});

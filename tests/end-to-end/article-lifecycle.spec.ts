import { prepareRandomNewArticle } from '../../src/factories/article.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser1 } from '../../src/test-data/user.data';
import { AddArticleView } from '../../src/views/add-article.view';
import test, { expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.describe('Create, verify and delete article', () => {
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;
  let loginPage: LoginPage;
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);
    articlePage = new ArticlePage(page);

    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();
  });

  test('create new article @GAD_R04_01 @positive', async () => {
    //Arrange
    articleData = prepareRandomNewArticle();

    //Act
    await articlesPage.addArticleButtonLogged.click();
    await expect.soft(addArticleView.addNewHeader).toBeVisible();
    await addArticleView.createArticle(articleData);

    //Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    await expect
      .soft(articlePage.articleBody)
      .toHaveText(articleData.body, { useInnerText: true }); //useInnerText: true - sprawdza tekst wewnątrz elementu, a nie atrybutu (np. uwzględnia <br>)
  });

  test('user can access single article @GAD_R04_03 @positive', async () => {
    //Act
    await articlesPage.gotoArticle(articleData.title);

    //Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    await expect
      .soft(articlePage.articleBody)
      .toHaveText(articleData.body, { useInnerText: true }); //useInnerText: true - sprawdza tekst wewnątrz elementu, a nie atrybutu (np. uwzględnia <br>)
  });
  test('user can delete his own article @GAD_R04_04 @positive', async () => {
    //Arrange
    await articlesPage.gotoArticle(articleData.title);
    const expectedArticlesTitle = 'Articles';
    const expectedNoResultText = 'No data';

    //Act
    await articlePage.deleteArticle();

    //Assert - check if you are redirected to articles page
    await articlesPage.waitForPageToLoadURL();
    const title = await articlesPage.getTitle();
    expect(title).toContain(expectedArticlesTitle);

    //Assert - check if article can be found in search
    await articlesPage.searchArticle(articleData.title);
    await expect(articlesPage.noResultsText).toHaveText(expectedNoResultText);
  });
});

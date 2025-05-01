import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentsPage } from '@_src/pages/comments.page';
import { HomePage } from '@_src/pages/home.page';
import { expect, test } from '@playwright/test';

test.describe('Verify service main pages', () => {
  test('home page title @GAD-R01-01', async ({ page }) => {
    //Arrange
    const homePage = new HomePage(page);
    const expectedHomePageTitle = 'GAD';

    //Act
    await homePage.goto();

    //Assert
    const title = await homePage.getTitle();
    expect(title).toContain(expectedHomePageTitle);
  });

  test('articles page title @GAD-R01-02', async ({ page }) => {
    //Arrange
    const articlesPage = new ArticlesPage(page);
    const expectedArticlesTitle = 'Articles';

    //Act
    await articlesPage.goto();

    //Assert
    const title = await articlesPage.getTitle();
    expect(title).toContain(expectedArticlesTitle);
  });

  test('comments page title @GAD-R01-02', async ({ page }) => {
    //Arrange
    const commentsPage = new CommentsPage(page);
    const expectedCommentsTitle = 'Comments';

    //Act
    await commentsPage.goto();

    //Assert
    const title = await commentsPage.getTitle();
    expect(title).toContain(expectedCommentsTitle);
  });

  // test('home page title simple', async ({page}) => {
  //   await page.goto('');
  //   await expect(page.toHaveTitle);
  // });
});

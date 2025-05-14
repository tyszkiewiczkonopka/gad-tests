import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify menu main buttons', () => {
  test('comments button navigates to comments page @GAD-R01-03', async ({
    articlesPage,
    commentsPage,
  }) => {
    //Arrange
    const expectedCommentsTitle = 'Comments';

    //Act
    await articlesPage.mainMenu.clickCommentsButton();
    const title = await commentsPage.getTitle();

    //Assert
    expect(title).toContain(expectedCommentsTitle);
  });

  // eslint-disable-next-line playwright/no-skipped-test
  test.skip('articles button navigates to articles page @GAD-R01-03', async ({
    commentsPage,
  }) => {
    // Arrange
    const expectedArticlesTitle = 'Articles';

    // Act
    const articlesPage = await commentsPage.mainMenu.clickArticlesButton();
    const title = await articlesPage.getTitle();

    // Assert
    expect(title).toContain(expectedArticlesTitle);
  });

  test('home page button navigates to main page @GAD-R01-03', async ({
    articlesPage,
  }) => {
    //Arrange
    const expectedHomePageTitle = 'GAD';

    //Act
    const homePage = await articlesPage.mainMenu.clickHomePageLink();
    const title = await homePage.getTitle();

    //Assert
    expect(title).toContain(expectedHomePageTitle);
  });
});

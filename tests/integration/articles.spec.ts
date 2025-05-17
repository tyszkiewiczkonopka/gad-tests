import { prepareRandomNewArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { waitForResponse } from '@_src/utils/wait.util';

test.describe('Verify articles', () => {
  test('reject creating article without title @GAD-R04-01 @logged', async ({
    addArticleView,
    page,
  }) => {
    // Arrange
    const expectedErrorMessage = 'Article was not created';
    const expectedErrorCode = 422;

    const articleData = prepareRandomNewArticle();
    articleData.title = '';

    // Act
    await addArticleView.createArticle(articleData);
    const waitForResponseOptions = {
      page,
      endpoint: '/api/articles',
    };
    const response = await waitForResponse(waitForResponseOptions);

    // Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
    expect(response.status()).toBe(expectedErrorCode);
  });

  test('reject creating article without body @GAD-R04-01 @logged', async ({
    addArticleView,
  }) => {
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
    test('reject creating article with title exceeding 128 signs @GAD-R04-02 @logged', async ({
      addArticleView,
    }) => {
      // Arrange
      const expectedErrorMessage = 'Article was not created';
      const articleData = prepareRandomNewArticle(129);

      // Act
      await addArticleView.createArticle(articleData);

      // Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorMessage);
    });

    test('create article with title with 128 signs @GAD-R04-02 @logged', async ({
      addArticleView,
    }) => {
      // Arrange
      const articleData = prepareRandomNewArticle(128);

      // Act
      const articlePage = await addArticleView.createArticle(articleData);

      // Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    });
    test('should return created article from api @GAD-R07-04 @logged', async ({
      addArticleView,
      page,
    }) => {
      // Arrange
      const articleData = prepareRandomNewArticle();

      const waitForResponseOptions = {
        page,
        method: 'GET',
        endpoint: '/api/articles',
      };

      const responsePromise = waitForResponse(waitForResponseOptions);
      // Act
      const articlePage = await addArticleView.createArticle(articleData);
      const response = responsePromise;

      // Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
      expect((await response).ok()).toBeTruthy();
    });
  });
});

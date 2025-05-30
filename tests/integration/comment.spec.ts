import { prepareRandomNewComment } from '@_src/factories/comment.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { waitForResponse } from '@_src/utils/wait.util';

test.describe('Verify comment', () => {
  test('should return created comment @GAD-R07-06 @logged', async ({
    createRandomArticle,
    page,
  }) => {
    // Arrange
    const expectedCommentCreatedPopup = 'Comment was created';

    const newCommentData = prepareRandomNewComment();
    let articlePage = createRandomArticle.articlePage;
    const addCommentView = await articlePage.clickAddCommentButton();

    const waitForResponseOptions = {
      page,
      method: 'GET',
      endpoint: '/api/comments',
    };
    const responsePromise = waitForResponse(waitForResponseOptions);

    // Act
    articlePage = await addCommentView.createComment(newCommentData);
    const response = await responsePromise;

    // Assert
    await expect
      .soft(articlePage.alertPopup)
      .toHaveText(expectedCommentCreatedPopup);

    expect(response.ok()).toBeTruthy();
  });
});

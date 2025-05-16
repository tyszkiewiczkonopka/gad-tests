import { prepareRandomNewComment } from '@_src/factories/comment.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { AddCommentModel } from '@_src/models/comment.model';

test.describe('Create, verify and delete comment', () => {
  test('operate on comments @GAD-R05-01 @GAD-R05-02 @logged', async ({
    createRandomArticle,
  }) => {
    const newCommentData = prepareRandomNewComment();
    let articlePage = createRandomArticle.articlePage;

    await test.step('create new comment', async () => {
      // Arrange
      const expectedCommentCreatedPopup = 'Comment was created';
      const expectedAddCommentHeader = 'Add New Comment';

      // Act
      const addCommentView = await articlePage.clickAddCommentButton();
      await expect
        .soft(addCommentView.addNewHeader)
        .toHaveText(expectedAddCommentHeader);

      articlePage = await addCommentView.createComment(newCommentData);

      // Assert
      await expect
        .soft(articlePage.alertPopup)
        .toHaveText(expectedCommentCreatedPopup);
    });

    let commentPage = await test.step('verify comment', async () => {
      // Act
      const articleComment = articlePage.getArticleComment(newCommentData.body);
      await expect(articleComment.body).toHaveText(newCommentData.body);

      const commentPage = await articlePage.clickCommentLink(articleComment);

      // Assert
      await expect(commentPage.commentBody).toHaveText(newCommentData.body);

      return commentPage;
    });

    let editCommentData: AddCommentModel;
    await test.step('update comment', async () => {
      // Arrange
      const expectedCommentUpdatePopup = 'Comment was updated';

      editCommentData = prepareRandomNewComment();

      // Act
      const editCommentView = await commentPage.clickEditButton();
      commentPage = await editCommentView.updateComment(editCommentData);

      // Assert
      await expect
        .soft(commentPage.alertPopup)
        .toHaveText(expectedCommentUpdatePopup);
      await expect(commentPage.commentBody).toHaveText(editCommentData.body);
    });

    await test.step('verify updated comment in article page', async () => {
      // Act
      const articlePage = await commentPage.clickReturnLink();
      const updatedArticleComment = articlePage.getArticleComment(
        editCommentData.body,
      );

      // Assert
      await expect(updatedArticleComment.body).toHaveText(editCommentData.body);
    });
  });

  test('user can add more than one comment to article @GAD-R05-03 @logged', async ({
    createRandomArticle,
  }) => {
    let articlePage = createRandomArticle.articlePage;

    await test.step('create first comment', async () => {
      // Arrange
      const expectedCommentCreatedPopup = 'Comment was created';
      const newCommentData = prepareRandomNewComment();

      // Act
      const addCommentView = await articlePage.clickAddCommentButton();
      articlePage = await addCommentView.createComment(newCommentData);

      // Assert
      await expect
        .soft(articlePage.alertPopup)
        .toHaveText(expectedCommentCreatedPopup);
    });

    await test.step('create and verify second comment', async () => {
      const secondCommentBody = await test.step('create comment', async () => {
        const secondCommentData = prepareRandomNewComment();
        const addCommentView = await articlePage.clickAddCommentButton();
        articlePage = await addCommentView.createComment(secondCommentData);
        return secondCommentData.body;
      });

      await test.step('verify comment', async () => {
        const articleComment = articlePage.getArticleComment(secondCommentBody);
        await expect(articleComment.body).toHaveText(secondCommentBody);
        const commentPage = await articlePage.clickCommentLink(articleComment);
        await expect(commentPage.commentBody).toHaveText(secondCommentBody);
      });
    });
  });
});

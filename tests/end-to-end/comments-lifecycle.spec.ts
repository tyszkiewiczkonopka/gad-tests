import { prepareRandomNewArticle } from '../../src/factories/article.factory';
import { prepareRandomNewComment } from '../../src/factories/comment.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { AddCommentModel } from '../../src/models/comment.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentPage } from '../../src/pages/comment.page';
import { AddArticleView } from '../../src/views/add-article.view';
import { EditCommentView } from '../../src/views/edit-comment.view';
import test, { expect } from '@playwright/test';

test.describe('Create, verify and delete comment', () => {
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;
  let commentPage: CommentPage;
  let editCommentView: EditCommentView;
  let editedCommentData: AddCommentModel;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);
    articlePage = new ArticlePage(page);
    commentPage = new CommentPage(page);
    editCommentView = new EditCommentView(page);

    articleData = prepareRandomNewArticle();

    //create article before testing comments
    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();
    await addArticleView.createArticle(articleData);
  });

  test('operate on comments @GAD_R05_01 @logged', async () => {
    const firstCommentData = prepareRandomNewComment();
    const secondCommentData = prepareRandomNewComment();

    const expectedCommentCreatedPopup = 'Comment was created';

    await test.step('create first comment', async () => {
      //Act
      await articlePage.addNewComment(firstCommentData);

      //Assert
      await expect
        .soft(articlePage.alertPopup)
        .toHaveText(expectedCommentCreatedPopup);
    });

    await test.step('verify first comment', async () => {
      //Act
      const firstArticleComment = articlePage.getArticleComment(
        firstCommentData.body,
      );
      await expect(firstArticleComment.body).toHaveText(firstCommentData.body);
      await firstArticleComment.link.click();

      //Assert
      await expect(commentPage.commentBody).toHaveText(firstCommentData.body);
    });

    await test.step('edit first comment', async () => {
      //Arrange
      editedCommentData = prepareRandomNewComment();
      const expectedCommentEditedPopup = 'Comment was updated';

      //Act
      await commentPage.editButton.click();
      await editCommentView.editComment(editedCommentData);

      //Assert
      await expect
        .soft(commentPage.alertPopup)
        .toHaveText(expectedCommentEditedPopup);
      await expect(commentPage.commentBody).toHaveText(editedCommentData.body);
    });

    await test.step('verify edited comment in article page', async () => {
      //Act
      await commentPage.returnLink.click();
      const editedArticleComment = articlePage.getArticleComment(
        editedCommentData.body,
      );

      //Assert
      await expect(editedArticleComment.body).toHaveText(
        editedCommentData.body,
      );
    });

    await test.step('create and verify second comment', async () => {
      //Act
      await articlePage.addNewComment(secondCommentData);

      //Assert
      const secondArticleComment = articlePage.getArticleComment(
        secondCommentData.body,
      );
      await expect(secondArticleComment.body).toHaveText(
        secondCommentData.body,
      );
      await secondArticleComment.link.click();
      await expect(commentPage.commentBody).toHaveText(secondCommentData.body);
    });
  });
});

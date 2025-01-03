import { prepareRandomNewArticle } from '../../src/factories/article.factory';
import { prepareRandomNewComment } from '../../src/factories/comment.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { AddCommentModel } from '../../src/models/comment.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentPage } from '../../src/pages/comment.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser1 } from '../../src/test-data/user.data';
import { AddArticleView } from '../../src/views/add-article.view';
import { AddCommentView } from '../../src/views/add-comment.view';
import { EditCommentView } from '../../src/views/edit-comment.view';
import test, { expect } from '@playwright/test';

test.describe('Create, verify and delete comment', () => {
  let articlesPage: ArticlesPage;
  let addArticleView: AddArticleView;
  let loginPage: LoginPage;
  let articleData: AddArticleModel;
  let articlePage: ArticlePage;
  let addCommentView: AddCommentView;
  let commentPage: CommentPage;
  let editCommentView: EditCommentView;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);
    articlePage = new ArticlePage(page);
    addCommentView = new AddCommentView(page);
    commentPage = new CommentPage(page);
    editCommentView = new EditCommentView(page);

    articleData = prepareRandomNewArticle();

    //create article before testing comments
    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();
    await addArticleView.createArticle(articleData);
  });

  test('operate on comments @GAD_R05_01 @positive', async () => {
    const newCommentData = prepareRandomNewComment();

    await test.step('create new comment', async () => {
      //Arrange
      const expectedAddCommentHeader = 'Add New Comment';
      const expectedCommentCreatedPopup = 'Comment was created';

      //Act
      await articlePage.addCommentButton.click();
      await expect(addCommentView.addNewHeader).toHaveText(
        expectedAddCommentHeader,
      );

      await addCommentView.createComment(newCommentData);

      //Assert
      await expect
        .soft(articlePage.alertPopup)
        .toHaveText(expectedCommentCreatedPopup);
    });

    await test.step('verify comment', async () => {
      //Act
      const articleComment = articlePage.getArticleComment(newCommentData.body);
      await expect(articleComment.body).toHaveText(newCommentData.body);
      await articleComment.link.click();

      //Assert
      await expect(commentPage.commentBody).toHaveText(newCommentData.body);
    });

    let editedCommentData: AddCommentModel;

    await test.step('edit comment', async () => {
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
  });
});

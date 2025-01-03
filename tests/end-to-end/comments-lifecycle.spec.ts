import { prepareRandomNewArticle } from '../../src/factories/article.factory';
import { prepareRandomNewComment } from '../../src/factories/comment.factory';
import { AddArticleModel } from '../../src/models/article.model';
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

  test('create new comment @GAD_R05_01 @positive', async () => {
    //Create new comment
    //Arrange
    const expectedAddCommentHeader = 'Add New Comment';
    const expectedCommentCreatedPopup = 'Comment was created';
    const expectedCommentEditedPopup = 'Comment was updated';

    const newCommentData = prepareRandomNewComment();

    //Act
    await articlePage.addCommentButton.click();
    await expect(addCommentView.addNewHeader).toHaveText(
      expectedAddCommentHeader,
    );

    await addCommentView.createComment(newCommentData);
    // await addCommentView.bodyInput.fill(newCommentData.body);
    // await addCommentView.saveButton.click();

    //Assert - if comment created
    await expect(articlePage.alertPopup).toHaveText(
      expectedCommentCreatedPopup,
    );

    //Verify comment
    //Act
    const articleComment = articlePage.getArticleComment(newCommentData.body);
    await expect(articleComment.body).toHaveText(newCommentData.body);
    await articleComment.link.click();

    //Assert - comment body as expected
    await expect(commentPage.commentBody).toHaveText(newCommentData.body);

    //Edit comment
    //Arrange
    const editedCommentData = prepareRandomNewComment();

    //Act
    await commentPage.editButton.click();
    await editCommentView.editComment(editedCommentData);

    //Assert - updated comment as expected
    await expect(commentPage.commentBody).toHaveText(editedCommentData.body);
    await expect(commentPage.alertPopup).toHaveText(expectedCommentEditedPopup);

    await commentPage.returnLink.click();
    const editedArticleComment = articlePage.getArticleComment(
      editedCommentData.body,
    );
    await expect(editedArticleComment.body).toHaveText(editedCommentData.body);
  });
});

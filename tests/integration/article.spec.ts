import { ArticlePage } from '@_src/pages/article.page';
import { expect, test } from '@playwright/test';

test.describe('Verify article', () => {
  test('Non logged user can access created article @GAD-R06-01 @predefined_data', async ({
    page,
  }) => {
    const expectedArticleTitle = 'How to write effective test cases';

    const articlePage = new ArticlePage(page);
    await articlePage.goto('?id=1');

    await expect(articlePage.articleTitle).toHaveText(expectedArticleTitle);
  });
});

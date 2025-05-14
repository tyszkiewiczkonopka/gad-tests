import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify article', () => {
  test('Non logged user can access created article @GAD-R06-01 @predefined_data', async ({
    articlePage,
  }) => {
    const expectedArticleTitle = 'How to write effective test cases';

    await articlePage.goto('?id=1'); // nieprzeniesione do fixture, bo jest tylko w tym specu

    await expect(articlePage.articleTitle).toHaveText(expectedArticleTitle);
  });
});

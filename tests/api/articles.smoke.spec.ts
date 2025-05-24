import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify articles API endpoint @GAD-R08-01 @api', () => {
  test('GET articles returns status code 200', async ({ request }) => {
    // Arrange
    const expectedStatusCode = 201;
    const articlesEndpoint = '/api/articles';

    // Act
    const response = await request.get(articlesEndpoint);

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });

  test('GET articles should return at least one article @predefined_data', async ({
    request,
  }) => {
    // Arrange
    const expectedArticlesMinimumNumber = 1;
    const articlesEndpoint = '/api/articles';

    // Act\
    const response = await request.get(articlesEndpoint);
    const responseBody = await response.json();

    // Assert
    expect(responseBody.length).toBeGreaterThanOrEqual(
      expectedArticlesMinimumNumber,
    );
  });

  test('GET articles should return articleobject @predefined_data', async ({
    request,
  }) => {
    // Arrange
    const expectedArticleFields = [
      'id',
      'user_id',
      'title',
      'body',
      'date',
      'image',
    ];
    const articlesEndpoint = '/api/articles';

    // Act
    const response = await request.get(articlesEndpoint);
    const responseBody = await response.json();
    const article = responseBody[0]; // retrieve the first article

    // Assert
    expectedArticleFields.forEach((field) => {
      expect.soft(article).toHaveProperty(field);
      // eslint-disable-next-line no-console
      console.log(`Article field "${field}" exists: ${article[field]}`);
    });
  });
});

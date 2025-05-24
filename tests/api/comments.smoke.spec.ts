import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify comments API endpoint @GAD-R08-02 @api', () => {
  test.describe('verify each condition in separate test', () => {
    test('GET comments returns status code 200', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 200;
      const commentsEndpoint = '/api/comments';

      // Act
      const response = await request.get(commentsEndpoint);

      // Assert
      expect(response.status()).toBe(expectedStatusCode);
    });
  });

  test('GET comments should return at least one comment @predefined_data', async ({
    request,
  }) => {
    // Arrange
    const expectedMinCommentCount = 1;
    const commentsEndpoint = '/api/comments';

    // Act
    const response = await request.get(commentsEndpoint);
    const responseJson = await response.json();

    // Assert
    expect(responseJson.length).toBeGreaterThanOrEqual(expectedMinCommentCount);
  });

  test('GET comments return comment object @predefined_data', async ({
    request,
  }) => {
    // Arrange
    const expectedRequiredFields = [
      'id',
      'article_id',
      'user_id',
      'body',
      'date',
    ];

    const commentsEndpoint = '/api/comments';

    // Act
    const response = await request.get(commentsEndpoint);
    const responseJson = await response.json();
    const comment = responseJson[0];

    // Assert
    expectedRequiredFields.forEach((key) => {
      expect
        .soft(comment, `response object contains required field: ${key}`)
        .toHaveProperty(key);
    });
  });
});

test('GET comments should return an object with required fields @predefined_data', async ({
  request,
}) => {
  // Arrange
  const commentsEndpoint = '/api/articles';
  const response = await request.get(commentsEndpoint);

  await test.step('GET comments returns status code 200', async () => {
    const expectedStatusCode = 200;

    expect(response.status()).toBe(expectedStatusCode);
  });

  const responseJson = await response.json();
  await test.step('GET comments should return at least one comment', async () => {
    const expectedMinCommentCount = 1;

    expect(responseJson.length).toBeGreaterThanOrEqual(expectedMinCommentCount);
  });

  const expectedRequiredFields = [
    'id',
    'user_id',
    'title',
    'body',
    'date',
    'image',
  ];

  const comment = responseJson[0];

  expectedRequiredFields.forEach(async (key) => {
    await test.step(`response object contains required field: ${key}`, async () => {
      expect.soft(comment).toHaveProperty(key);
    });
  });
});

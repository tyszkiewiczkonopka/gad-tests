import { STORAGE_STATE } from '@_pw-config';
import { expect, test as setup } from '@_src/fixtures/merge.fixture';
import { testUser1 } from '@_src/test-data/user.data';

setup('login and save session', async ({ page, loginPage }) => {
  //Arrange
  const expectedWelcomeTitle = 'Welcome';

  //Act
  const welcomePage = await loginPage.login(testUser1);
  const title = await welcomePage.getTitle();

  //Assert
  expect(title).toContain(expectedWelcomeTitle);

  await page.context().storageState({ path: STORAGE_STATE });
});

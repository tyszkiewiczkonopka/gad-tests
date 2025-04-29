import { LoginUserModel } from '../../src/models/user.model';
import { LoginPage } from '../../src/pages/login.page';
import { WelcomePage } from '../../src/pages/welcome.page';
import { testUser1 } from '../../src/test-data/user.data';
import test, { expect } from '@playwright/test';

test.describe('Verify login', () => {
  test('login with correct credentials @GAD_R02_01', async ({ page }) => {
    //Arrange
    const expectedWelcomeTitle = 'Welcome';

    const loginPage = new LoginPage(page);
    const welcomePage = new WelcomePage(page);

    //Act
    await loginPage.goto();
    await loginPage.login(testUser1);

    const title = await welcomePage.getTitle();

    //Assert
    expect(title).toContain(expectedWelcomeTitle);
  });

  test('reject login with incorrect password @GAD_R02_01', async ({ page }) => {
    //Arrange
    const expectedLoginTitle = 'Login';
    const expectedErrorMessage = 'Invalid username or password';
    const loginPage = new LoginPage(page);

    const incorrectPassword = 'incorrectPassword';
    const loginUserData: LoginUserModel = {
      userEmail: testUser1.userEmail,
      userPassword: incorrectPassword,
    };

    //Act
    await loginPage.goto();
    await loginPage.login(loginUserData);

    //Assert
    const errorMessage = loginPage.loginError;
    await expect.soft(errorMessage).toContainText(expectedErrorMessage);

    const title = await loginPage.getTitle();
    expect.soft(title).toContain(expectedLoginTitle);
  });
});

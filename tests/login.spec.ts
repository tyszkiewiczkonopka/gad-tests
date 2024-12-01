import { LoginPage } from '../src/pages/login.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { testUser1 } from '../src/test-data/user.data';
import test, { expect } from '@playwright/test';

test.describe('Verify login', () => {
  test('login with correct credentials @GAD_R02_01', async ({ page }) => {
    //Arrange
    const userEmail = testUser1.userEmail;
    const userPassword = testUser1.userPassword;
    const loginPage = new LoginPage(page);

    //Act
    await loginPage.goto();
    await loginPage.login(userEmail, userPassword);

    const welcomePage = new WelcomePage(page);
    const title = await welcomePage.title();

    //Assert
    expect(title).toContain('Login');
  });

  test('reject login with incorrect password @GAD_R02_01', async ({ page }) => {
    //Arrange
    const userEmail = testUser1.userEmail;
    const userPassword = 'incorrectPassword';
    const loginPage = new LoginPage(page);

    //Act
    await loginPage.goto();
    await loginPage.login(userEmail, userPassword);

    //Assert
    const errorMessage = loginPage.loginError;
    await expect
      .soft(errorMessage)
      .toContainText('Invalid username or password');

    const title = await loginPage.title();
    expect.soft(title).toContain('Login');
  });
});

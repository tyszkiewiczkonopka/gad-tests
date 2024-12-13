import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { faker } from '@faker-js/faker';
import test, { expect } from '@playwright/test';

test.describe('Verify register', () => {
  test('register with correct data and login @GAD_R03_01 @GAD_R03_02 @GAD_R03_03', async ({
    page,
  }) => {
    //Arrange
    const userFirstName = faker.person.firstName().replace(/[^A-Za-z]/g, '');
    const userLastName = faker.person.lastName().replace(/[^A-Za-z]/g, '');
    const userEmail = faker.internet.email({
      firstName: userFirstName,
      lastName: userLastName,
    });
    const userPassword = faker.internet.password();

    const registerPage = new RegisterPage(page);

    //Act
    await registerPage.goto();
    await registerPage.register(
      userFirstName,
      userLastName,
      userEmail,
      userPassword,
    );

    const expectedAlertPopupText = 'User created';

    //Assert - check if alert popup is displayed
    await expect(registerPage.alertPopup).toHaveText(expectedAlertPopupText);

    const loginPage = new LoginPage(page);
    await loginPage.waitForPageToLoadURL();
    const titleLogin = await loginPage.title();

    expect.soft(titleLogin).toContain('Login');

    //Assert - check if user can login
    await loginPage.login(userEmail, userPassword);

    const welcomePage = new WelcomePage(page);
    const titleWelcome = await welcomePage.title();

    expect(titleWelcome).toContain('Welcome');
  });
});

import { randomUserData } from '../src/factories/user.factory';
import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import test, { expect } from '@playwright/test';

test.describe('Verify register', () => {
  test('register with correct data and login @GAD_R03_01 @GAD_R03_02 @GAD_R03_03', async ({
    page,
  }) => {
    //Arrange
    const registerUserData = randomUserData();
    const registerPage = new RegisterPage(page);

    //Act
    await registerPage.goto();
    await registerPage.register(registerUserData);

    const expectedAlertPopupText = 'User created';

    //Assert - check if alert popup is displayed
    await expect(registerPage.alertPopup).toHaveText(expectedAlertPopupText);

    const loginPage = new LoginPage(page);
    await loginPage.waitForPageToLoadURL();
    const titleLogin = await loginPage.title();

    expect.soft(titleLogin).toContain('Login');

    //Assert - check if user can login
    await loginPage.login({
      //anonymous object
      userEmail: registerUserData.userEmail,
      userPassword: registerUserData.userPassword,
    });

    const welcomePage = new WelcomePage(page);
    const titleWelcome = await welcomePage.title();

    expect(titleWelcome).toContain('Welcome');
  });

  test('not register with incorrect data - not valid email @GAD_R03_04', async ({
    page,
  }) => {
    //Arrange

    const registerUserData = randomUserData();
    registerUserData.userEmail = 'notvalidemail.com';

    const registerPage = new RegisterPage(page);

    //Act
    await registerPage.goto();
    await registerPage.register(registerUserData);

    const expectedErrorText = 'Please provide a valid email address';

    //Assert - check if alert popup is displayed
    await expect(registerPage.emailErrorTest).toHaveText(expectedErrorText);
  });

  test('not register with incorrect data - email not provided @GAD_R03_04', async ({
    page,
  }) => {
    //Arrange
    const registerUserData = randomUserData();
    const registerPage = new RegisterPage(page);
    const expectedErrorText = 'This field is required';

    //Act
    await registerPage.goto();
    registerPage.userFistNameInput.fill(registerUserData.userFirstName);
    registerPage.userLastNameInput.fill(registerUserData.userLastName);
    registerPage.userPasswordInput.fill(registerUserData.userPassword);
    registerPage.registerButton.click();

    //Assert - check if alert popup is displayed
    await expect(registerPage.emailErrorTest).toHaveText(expectedErrorText);
  });
});

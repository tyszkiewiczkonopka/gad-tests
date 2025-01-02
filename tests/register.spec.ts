import { prepareRandomUserData } from '../src/factories/user.factory';
import { RegisterUserModel } from '../src/models/user.model';
import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import test, { expect } from '@playwright/test';

test.describe('Verify register', () => {
  let registerPage: RegisterPage;
  let registerUserData: RegisterUserModel;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    registerUserData = prepareRandomUserData();
    await registerPage.goto();
  });

  test('register with correct data and login @GAD_R03_01 @GAD_R03_02 @GAD_R03_03', async ({
    page,
  }) => {
    //Arrange
    const expectedAlertPopupText = 'User created';

    const loginPage = new LoginPage(page);
    const welcomePage = new WelcomePage(page);

    //Act
    await registerPage.register(registerUserData);

    //Assert - check if alert popup is displayed
    await expect(registerPage.alertPopup).toHaveText(expectedAlertPopupText);

    await loginPage.waitForPageToLoadURL();
    const titleLogin = await loginPage.getTitle();
    expect.soft(titleLogin).toContain('Login');

    //Assert - check if user can login
    await loginPage.login({
      //anonymous object
      userEmail: registerUserData.userEmail,
      userPassword: registerUserData.userPassword,
    });

    const titleWelcome = await welcomePage.getTitle();
    expect(titleWelcome).toContain('Welcome');
  });

  test('not register with incorrect data - not valid email @GAD_R03_04', async () => {
    //Arrange
    const expectedErrorText = 'Please provide a valid email address';
    registerUserData.userEmail = 'notvalidemail.com';

    //Act
    await registerPage.register(registerUserData);

    //Assert - check if alert popup is displayed
    await expect(registerPage.emailErrorTest).toHaveText(expectedErrorText);
  });

  test('not register with incorrect data - email not provided @GAD_R03_04', async () => {
    //Arrange
    const expectedErrorText = 'This field is required';

    //Act
    registerPage.userFistNameInput.fill(registerUserData.userFirstName);
    registerPage.userLastNameInput.fill(registerUserData.userLastName);
    registerPage.userPasswordInput.fill(registerUserData.userPassword);
    registerPage.registerButton.click();

    //Assert - check if alert popup is displayed
    await expect(registerPage.emailErrorTest).toHaveText(expectedErrorText);
  });
});

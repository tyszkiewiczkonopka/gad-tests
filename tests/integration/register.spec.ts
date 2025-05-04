import { prepareRandomUserData } from '@_src/factories/user.factory';
import { RegisterUserModel } from '@_src/models/user.model';
import { LoginPage } from '@_src/pages/login.page';
import { RegisterPage } from '@_src/pages/register.page';
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
    const expectedLoginTitle = 'Login';
    const expectedWelcomeTitle = 'Welcome';

    const loginPage = new LoginPage(page);

    //Act
    await registerPage.register(registerUserData);

    //Assert - check if alert popup is displayed
    await expect(registerPage.alertPopup).toHaveText(expectedAlertPopupText);

    await loginPage.waitForPageToLoadURL();
    const titleLogin = await loginPage.getTitle();
    expect.soft(titleLogin).toContain(expectedLoginTitle);

    //Assert - check if user can login
    const welcomePage = await loginPage.login({
      //anonymous object
      userEmail: registerUserData.userEmail,
      userPassword: registerUserData.userPassword,
    });

    const titleWelcome = await welcomePage.getTitle();
    expect(titleWelcome).toContain(expectedWelcomeTitle);
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

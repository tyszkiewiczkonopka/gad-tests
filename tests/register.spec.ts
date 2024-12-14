import { RegisterUser } from '../src/models/user.model';
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

    const registerUserData: RegisterUser = {
      // Remove non-alphabetic characters from first and last name
      userFirstName: faker.person.firstName().replace(/[^A-Za-z]/g, ''),
      userLastName: faker.person.lastName().replace(/[^A-Za-z]/g, ''),
      userEmail: '', // Temporary placeholder
      userPassword: faker.internet.password(),
    };

    // Generate email after firstName and lastName are set
    registerUserData.userEmail = faker.internet.email({
      firstName: registerUserData.userFirstName,
      lastName: registerUserData.userLastName,
    });

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

    const registerUserData: RegisterUser = {
      // Remove non-alphabetic characters from first and last name
      userFirstName: faker.person.firstName().replace(/[^A-Za-z]/g, ''),
      userLastName: faker.person.lastName().replace(/[^A-Za-z]/g, ''),
      userEmail: '%r#8',
      userPassword: faker.internet.password(),
    };

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
    const registerPage = new RegisterPage(page);

    //Act
    await registerPage.goto();
    registerPage.userFistNameInput.fill(
      faker.person.firstName().replace(/[^A-Za-z]/g, ''),
    );
    registerPage.userLastNameInput.fill(
      faker.person.lastName().replace(/[^A-Za-z]/g, ''),
    );
    registerPage.userPasswordInput.fill(faker.internet.password());

    registerPage.registerButton.click();

    const expectedErrorText = 'This field is required';

    //Assert - check if alert popup is displayed
    await expect(registerPage.emailErrorTest).toHaveText(expectedErrorText);
  });
});

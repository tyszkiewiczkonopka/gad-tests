import { RegisterUserModel } from '../models/user.model';
import { faker } from '@faker-js/faker';

export function randomUserData(): RegisterUserModel {
  const registerUserData: RegisterUserModel = {
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
  return registerUserData;
}

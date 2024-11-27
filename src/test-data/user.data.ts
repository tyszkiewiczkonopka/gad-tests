export const testUser1 = {
  userEmail: process.env.USER_EMAIL ?? '[NOT SET]',
  userPassword: process.env.USER_PASSWORD ?? '[NOT SET]',
};

// export const getTestUser = () => {
//   const userEmail = process.env.USER_EMAIL;
//   const userPassword = process.env.USER_PASSWORD;

//   if (!userEmail || !userPassword) {
//     throw new Error('Missing user login data');
//   }

//   return { userEmail, userPassword };
// };

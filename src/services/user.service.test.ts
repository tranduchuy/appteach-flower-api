import { UserService } from './user.service';
// import { General } from '../constant/generals';
import bcrypt from 'bcrypt';
// import UserTypes = General.UserTypes;
// import RegisterByTypes = General.RegisterByTypes;

let userService: UserService;

describe('UserService', () => {
  beforeEach(() => {
    userService = new UserService();
  });

  it('Init service', () => {
    expect(userService).toBeTruthy();
  });

  describe('isValidHashPassword function', () => {
    it('isValid should be false if bcrypt.compareSync return false', () => {
      const spy = jest.spyOn(bcrypt, 'compareSync')
        .mockReturnValue(false);

      const isValid = userService.isValidHashPassword('asdasd', '123456');
      expect(spy).toHaveBeenCalled();
      expect(isValid).toBe(false);
      // spy.mockRestore();
    });

    it('isValid should be true if bcrypt.compareSync return true', () => {
      const spy = jest.spyOn(bcrypt, 'compareSync')
        .mockReturnValue(true);

      const isValid = userService.isValidHashPassword('asdasd', '123456');
      console.log('=========');
      console.log(isValid);

      expect(spy).toHaveBeenCalledWith('123456', 'asdasd');
      expect(isValid).toBe(true);
      // spy.mockRestore();
    });
  });
});


//
// describe('createUser function', () => {
//     it('newUser should return data of user when user was created successfully', async () => {
//         const newUserData = {
//             email: 'tuevo@gmail.com',
//             name: 'tue vo',
//             password: 'asdasd',
//             type: UserTypes.TYPE_CUSTOMER,
//             role: null,
//             phone: '093659211',
//             gender: 1,
//             city: null,
//             district: null,
//             ward: null,
//             registerBy: RegisterByTypes.NORMAL,
//             address: 'vietnam',
//             otpCode: null,
//           };
//         const newUser = await userService.createUser(newUserData);
//
//         expect(newUser).not.toBeNull();
//     });
// });










import { UserService } from './user.service';
import UserModel from '../models/user';
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
    });

    it('isValid should be true if bcrypt.compareSync return true', () => {
      const spy = jest.spyOn(bcrypt, 'compareSync')
        .mockReturnValue(true);

      const isValid = userService.isValidHashPassword('asdasd', '123456');

      expect(spy).toHaveBeenCalledWith('123456', 'asdasd');
      expect(isValid).toBe(true);
    });
  });

  describe('findById', () => {

    const user = {
      id: 1
    };

    it('Should return null when id not found', async () => {
      const spy = jest.spyOn(UserModel, 'findById')
        .mockReturnValue(null);

      const result = await userService.findById('1');
      expect(spy).toHaveBeenCalledWith('1');
      expect(result).toBeNull();
    });

    it('Should return object of user when id found', async () => {
      const spy = jest.spyOn(UserModel, 'findById')
        .mockReturnValue(user);

      const result = await userService.findById('1');
      expect(spy).toHaveBeenCalledWith('1');
      expect(result).toEqual(user);
    });
  });
});






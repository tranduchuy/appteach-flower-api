import { UserService } from '../services/user.service';
import { General } from '../constant/generals';
import UserTypes = General.UserTypes;
import RegisterByTypes = General.RegisterByTypes;

const userService: UserService = new UserService();

describe('isValidHashPassword function', () => {
    it('isValid should be false if hashed string does not match hashed password', () => {
        const isValid = userService.isValidHashPassword('asdasd', '123456');

        expect(isValid).toBe(false);
    });
})

describe('createUser function', () => {
    it('newUser should return data of user when user was created successfully', async () => {
        const newUserData = {
            email: 'tuevo@gmail.com',
            name: 'tue vo',
            password: 'asdasd',
            type: UserTypes.TYPE_CUSTOMER,
            role: null,
            phone: '093659211',
            gender: 1,
            city: null,
            district: null,
            ward: null,
            registerBy: RegisterByTypes.NORMAL,
            address: 'vietnam',
            otpCode: null,
          };
        const newUser = await userService.createUser(newUserData);

        expect(newUser).not.toBeNull();
    });
});










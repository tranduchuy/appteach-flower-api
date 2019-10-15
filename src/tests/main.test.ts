import { UserService } from '../services/user.service';
import container from '../config/ioc_config';
import TYPES from '../constant/types';
import { User } from '../models/user.model';

const UserServiceMock: UserService = container.getNamed(TYPES.UserService, 'UserService');

it('should return false if hashed plaintext is different to hashed string', () => {
    expect(UserServiceMock.isValidHashPassword('asdsad', '123456')).toBe(false);
});

it('data should be an user if email exists', async () => {
    const data = await UserServiceMock.findByEmail('tuevo.it@gmail.com');
    expect(data).toBeInstanceOf(User);
});


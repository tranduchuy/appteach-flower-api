import {
  controller, httpGet
} from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../constant/types';
import UserModel, { User } from '../models/user';
import { UserService } from '../services/user.service';

interface IRes<T> {
  status: Number;
  messages: string[];
  data: T;
}

@controller('/user')
export class UserController {
  constructor(
    @inject(TYPES.UserService) private userService: UserService
  ) {
    this.userService.demo();
  }

  @httpGet('/')
  public getUsers(request: Request, response: Response): Promise<IRes<User[]>> {
    return new Promise<IRes<User[]>>(async (resolve, reject) => {

      const result: IRes<User[]> = {
        status: 1,
        messages: ['Success'],
        data: await UserModel.find()
      };

      resolve(result);
    });
  }
}
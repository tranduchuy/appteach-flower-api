import {
  controller, httpGet
} from "inversify-express-utils";
import { inject } from "inversify";
import TYPES from "../constant/types";
import { UserService } from "../services/user.service";
import UserModel, { User } from "../models/user";

@controller("/user")
export class UserController {
  constructor(
    @inject(TYPES.UserService) private userService: UserService
  ) {
    this.userService.sayHello();
  }

  @httpGet("/")
  public getUsers(request: Request, response: Response): Promise<User[]> {
    return new Promise<User[]>(async (resolve, reject) => {
      resolve(<User[]>await UserModel.find());
    });
  }
}
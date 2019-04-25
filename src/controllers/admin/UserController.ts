import { inject } from 'inversify';
import { controller, httpGet, httpPost, httpPut } from 'inversify-express-utils';
import * as HttpStatus from 'http-status-codes';
import { Request } from 'express';
import { General } from '../../constant/generals';
import { ResponseMessages } from '../../constant/messages';
import { Status } from '../../constant/status';
import TYPES from '../../constant/types';
import { IRes } from '../../interfaces/i-res';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import Joi from '@hapi/joi';

// schemas
import loginSchema from '../../validation-schemas/user/login.schema';

interface IResUserLogin {
  meta: {
    token: string,
  };
  userInfo: User;
}

interface IUsers {
  meta: {
    totalItems: number;
  };
  users: User[];
}

interface IResUserAcceptedTobeShop {

}

interface IResUserUpdateStatus {

}

@controller('/admin/user')
export class UserController {
  constructor(@inject(TYPES.Admin.UserController) private userService: UserService) {

  }

  @httpPost('/login')
  public login(request: Request): Promise<IRes<IResUserLogin>> {
    return new Promise<IRes<IResUserLogin>>(async (resolve) => {
      try {
        const {error} = Joi.validate(request.body, loginSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<IResUserLogin> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages
          };

          return resolve(result);
        }

        const {email, username, password} = request.body;
        const user = await this.userService.findByEmailOrUsername(email, username);

        if (!user) {
          const result: IRes<IResUserLogin> = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.User.Login.USER_NOT_FOUND]
          };

          return resolve(result);
        }

        if (!this.userService.isValidHashPassword(user.passwordHash, password)) {
          const result: IRes<IResUserLogin> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.User.Login.WRONG_PASSWORD]
          };

          return resolve(result);
        }

        if (user.status !== Status.ACTIVE) {
          const result: IRes<IResUserLogin> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.User.Login.INACTIVE_USER]
          };

          return resolve(result);
        }

        if (!this.userService.isRoleAdmin(user.role)) {
          const result: IRes<IResUserLogin> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.User.Login.PERMISSION_DENIED]
          };

          return resolve(result);
        }

        const userInfoResponse = {
            id: user.id,
            role: user.role,
            email: user.email,
            username: user.username,
            name: user.name,
            phone: user.phone,
            address: user.address,
            type: user.type,
            status: user.status,
            avatar: user.avatar,
            gender: user.gender,
            city: user.city,
            district: user.district,
            ward: user.ward,
            registerBy: user.registerBy
          }
        ;
        const token = this.userService.generateToken({email: user.email});

        const result: IRes<any> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.User.Login.LOGIN_SUCCESS],
          data: {
            meta: {
              token
            },
            userInfo: userInfoResponse
          }
        };

        resolve(result);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<IResUserLogin> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages
        };

        resolve(result);
      }
    });
  }

  @httpPost('/accept-shop')
  public acceptToBeShop(req: Request): Promise<IRes<IResUserAcceptedTobeShop>> {
    return new Promise<IRes<IResUserAcceptedTobeShop>>((resolve) => {
      // TODO: accept user to be shop
    });
  }

  @httpGet('/waiting-confirm-shop')
  public getListUserWaitingToBeShop(req: Request): Promise<IRes<IUsers>> {
    return new Promise<IRes<IUsers>>((resolve) => {
      // TODO: list user waiting to be shop
    });
  }

  @httpGet('/')
  public getListUser(req: Request): Promise<IRes<IUsers>> {
    return new Promise<IRes<IUsers>>((resolve) => {
      // TODO: list user
    });
  }

  @httpPut('/status')
  public updateStatusUser(req: Request): Promise<IRes<IResUserUpdateStatus>> {
    return new Promise<IRes<IResUserUpdateStatus>>((resolve) => {
      // TODO: Update status of user
    });
  }
}
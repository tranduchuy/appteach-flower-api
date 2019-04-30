import { inject } from 'inversify';
import { controller, httpGet, httpPost, httpPut } from 'inversify-express-utils';
import * as HttpStatus from 'http-status-codes';
import { Request } from 'express';
import { General } from '../../constant/generals';
import { HttpCodes } from '../../constant/http-codes';
import { ResponseMessages } from '../../constant/messages';
import { Status } from '../../constant/status';
import TYPES from '../../constant/types';
import { IRes } from '../../interfaces/i-res';
import UserModel, { User } from '../../models/user';
import { ShopService } from '../../services/shop.service';
import { UserService } from '../../services/user.service';
import ShopModel from '../../models/shop';
import Joi from '@hapi/joi';

// schemas
import loginSchema from '../../validation-schemas/user/login.schema';
import ShopWaitingConfirmSchema from '../../validation-schemas/user/admin-shop-waiting.schema';
import AcceptShopSchema from '../../validation-schemas/user/admin-accept-shop.schema';
import ListUserSchema from '../../validation-schemas/user/admin-list-user.schema';
import UserTypes = General.UserTypes;

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

interface IResShops {
  meta: {
    totalItems: number;
  };
  shops: {
    name: string,
    user: any,
    images: string[],
    createdAt: Date,
  }[];
}

interface IResUserAcceptedTobeShop {

}

interface IResUserUpdateStatus {

}

@controller('/admin/user')
export class AdminUserController {
  constructor(@inject(TYPES.UserService) private userService: UserService,
              @inject(TYPES.ShopService) private shopService: ShopService) {

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
            messages: [ResponseMessages.User.USER_NOT_FOUND]
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

  @httpPost('/accept-shop', TYPES.CheckTokenMiddleware, TYPES.CheckAdminMiddleware)
  public acceptToBeShop(req: Request): Promise<IRes<IResUserAcceptedTobeShop>> {
    return new Promise<IRes<IResUserAcceptedTobeShop>>(async (resolve) => {
      const {error} = Joi.validate(req.query, AcceptShopSchema);
      if (error) {
        const messages = error.details.map(detail => {
          return detail.message;
        });

        const result: IRes<IResUserAcceptedTobeShop> = {
          status: HttpCodes.ERROR,
          messages: messages
        };

        return resolve(result);
      }

      const shop = await ShopModel.findOne({_id: req.body.shopId});
      if (!shop) {
        const result: IRes<IResUserAcceptedTobeShop> = {
          status: HttpStatus.NOT_FOUND,
          messages: [ResponseMessages.Shop.SHOP_NOT_FOUND]
        };

        return resolve(result);
      }

      const user = await UserModel.findById(shop.user.toString());
      if (!user) {
        const result: IRes<IResUserAcceptedTobeShop> = {
          status: HttpStatus.NOT_FOUND,
          messages: [ResponseMessages.User.USER_NOT_FOUND]
        };

        return resolve(result);
      }

      // change type of user
      user.type = UserTypes.TYPE_SELLER;
      await user.save();

      // status from PENDING_OR_WAIT_CONFIRM to be ACTIVE
      shop.status = Status.ACTIVE;
      await shop.save();

      return resolve({
        status: HttpStatus.OK,
        messages: [ResponseMessages.SUCCESS]
      });
    });
  }

  @httpGet('/waiting-confirm-shop', TYPES.CheckTokenMiddleware, TYPES.CheckAdminMiddleware)
  public getListUserWaitingToBeShop(req: Request): Promise<IRes<IResShops>> {
    return new Promise<IRes<IResShops>>(async (resolve) => {
      const {error} = Joi.validate(req.query, ShopWaitingConfirmSchema);
      if (error) {
        const messages = error.details.map(detail => {
          return detail.message;
        });

        const result: IRes<IResShops> = {
          status: HttpStatus.BAD_REQUEST,
          messages: messages
        };

        return resolve(result);
      }

      const {limit, page, sb, sd, user_id} = req.query;
      const stages: any[] = this.shopService.buildStageQueryShopWaiting({
        limit: parseInt((limit || 10).toString()),
        page: parseInt((page || 1).toString()),
        sortBy: sb || null,
        sortDirection: sd || null,
        userId: user_id || null
      });

      const result: any = await ShopModel.aggregate(stages);
      const response: IRes<IResShops> = {
        status: HttpStatus.OK,
        messages: [ResponseMessages.SUCCESS],
        data: {
          meta: {
            totalItems: result.meta[0] ? result.meta[0].totalItems : 0
          },
          shops: result.entries
        }
      };

      resolve(response);
    });
  }

  @httpGet('/', TYPES.CheckTokenMiddleware, TYPES.CheckAdminMiddleware)
  public getListUser(req: Request): Promise<IRes<IUsers>> {
    return new Promise<IRes<IUsers>>(async (resolve) => {
      const {error} = Joi.validate(req.query, ListUserSchema);
      if (error) {
        const messages = error.details.map(detail => {
          return detail.message;
        });

        const result: IRes<IUsers> = {
          status: HttpStatus.BAD_REQUEST,
          messages: messages
        };

        return resolve(result);
      }

      const {limit, page, sb, sd, user_id, email, username, facebook_id, google_id, gender, status, role} = req.query;
      const stages: any[] = this.userService.buildStageGetListUser({
        limit: parseInt((limit || 10).toString()),
        page: parseInt((page || 1).toString()),
        sortBy: sb,
        sortDirection: sd,
        userId: user_id,
        email: email,
        username: username,
        facebookId: facebook_id,
        googleId: google_id,
        role: role ? parseInt(role) : null,
        status: status ? parseInt(status) : null,
        gender: gender ? parseInt(gender) : null
      });
      const result: any = await UserModel.aggregate(stages);
      const response: IRes<IUsers> = {
        status: HttpStatus.OK,
        messages: [ResponseMessages.SUCCESS],
        data: {
          meta: {
            totalItems: result[0].meta[0] ? result[0].meta[0].totalItems : 0
          },
          users: result[0].entries
        }
      };

      resolve(response);
    });
  }

  @httpPut('/status')
  public updateStatusUser(req: Request): Promise<IRes<IResUserUpdateStatus>> {
    return new Promise<IRes<IResUserUpdateStatus>>((resolve) => {
      // TODO: Update status of user
    });
  }
}
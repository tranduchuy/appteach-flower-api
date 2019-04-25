import { controller, httpGet, httpPost, httpPut } from 'inversify-express-utils';
import * as HttpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import { IRes } from '../../interfaces/i-res';
import { User } from '../../models/user';

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
  @httpPost('/login')
  public login(req: Request): Promise<IRes<IResUserLogin>> {
    return new Promise<IRes<IResUserLogin>>((resolve) => {
      // TODO: api login
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
import { NextFunction, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { BaseMiddleware } from 'inversify-express-utils';
import { General } from '../constant/generals';
import UserRoles = General.UserRoles;

export class CheckAdminMiddleware extends BaseMiddleware {
  responseAccessDenied = {
    status: HttpStatus.UNAUTHORIZED,
    messages: ['Access denied'],
    data: {
      meta: {},
      entries: []
    }
  };

  public async handler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (req.user.role !== UserRoles.USER_ROLE_ADMIN && req.user.role !== UserRoles.USER_ROLE_MASTER) {
      return res.json(this.responseAccessDenied);
    }

    return next();
  }
}
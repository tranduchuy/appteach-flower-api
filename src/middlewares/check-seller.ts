import { BaseMiddleware } from 'inversify-express-utils';
import { injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { General } from '../constant/generals';
import * as HttpStatus from 'http-status-codes';
import UserTypes = General.UserTypes;

@injectable()
export class CheckSellerMiddleware extends BaseMiddleware {
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

    if (req.user.type !== UserTypes.TYPE_SELLER) {
      return res.json(this.responseAccessDenied);
    }

    return next();
  }
}
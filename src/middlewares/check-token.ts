import { BaseMiddleware } from 'inversify-express-utils';
import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { General } from '../constant/generals';
import { Status } from '../constant/status';
import UserModel from '../models/user';
import UserModel2 from '../models/user.model';
import * as HttpStatus from 'http-status-codes';
const WhiteList = require('./user-white-list');

@injectable()
export class CheckTokenMiddleware extends BaseMiddleware {
  responseAccessDenied = {
    status: HttpStatus.UNAUTHORIZED,
    messages: ['Access denied'],
    data: {
      meta: {},
      entries: []
    }
  };

  checkExistInWhiteList = (path) => {
    return WhiteList.some(p => {
      return path.indexOf(p) !== -1;
    });
  };

  public async handler(
    req: Request,
    res: Response,
    next: NextFunction
  ) {

    const token = req.get(General.ApiTokenName);
    if (this.checkExistInWhiteList(req.path) && !token) {
      return next();
    }

    if (!token) {
      return res.json(this.responseAccessDenied);
    }

    try {
      const userInfo = jwt.verify(token, General.jwtSecret);
      const user = await UserModel2.findOne({
        where: {
          id: userInfo._id
        }
      });

      if (!user || user.status !== Status.ACTIVE) {
        return res.json(this.responseAccessDenied);
      }

      req.user = user;
      return next();
    } catch (err) {
      return res.json(this.responseAccessDenied);
    }
  }
}
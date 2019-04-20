import {BaseMiddleware} from "inversify-express-utils";
import {injectable} from 'inversify';
import {HttpCodes} from "../constant/http-codes";
import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from "express";
import {General} from "../constant/generals";
import {Status} from "../constant/status";
import UserModel from "../models/user";

const WhiteList = require('./user-white-list');

@injectable()
export class CheckTokenMiddleware extends BaseMiddleware {

  responseAccessDenied = {
    status: HttpCodes.ERROR,
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
      //logger.info('CheckUserLogin::error::token is required');
      return res.json(this.responseAccessDenied);
    }

    try {
      let userInfo = jwt.verify(token, General.jwtSecret);
      const user = await UserModel.findOne({
        email: userInfo.email
      });

      if (!user || user.status !== Status.ACTIVE) {
        //logger.error('CheckUserLogin::error. Access denied. User not found or status not active', JSON.stringify(userInfo));
        return res.json(this.responseAccessDenied);
      }

      req.user = user;
      return next();
    } catch (err) {
      //logger.error('CheckUserLogin::error. Cannot verify access token', err);

      return res.json(this.responseAccessDenied);
    }
  }
}
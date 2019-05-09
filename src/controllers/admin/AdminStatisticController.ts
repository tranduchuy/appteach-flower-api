import { Request } from 'express';
import * as HttpStatus from 'http-status-codes';
import { controller, httpGet } from 'inversify-express-utils';
import { ResponseMessages } from '../../constant/messages';
import TYPES from '../../constant/types';
import { IRes } from '../../interfaces/i-res';
import AddressModel from '../../models/address';
import ProductModel from '../../models/product';
import UserModel from '../../models/user';
import ShopModel from '../../models/shop';

// schemas

interface IResStatisticDashboard {
  productCount: number;
  userCount: number;
  shopCount: number;
  addressCount: number;
}

@controller('/admin/statistic')
export class AdminStatisticController {
  constructor() {
  }

  @httpGet('/', TYPES.CheckTokenMiddleware, TYPES.CheckAdminMiddleware)
  public getStatisticDashboard(req: Request): Promise<IRes<IResStatisticDashboard>> {
    return new Promise<IRes<IResStatisticDashboard>>(async (resolve) => {
      try {
        const productCount = await ProductModel.count({});
        const userCount = await UserModel.count({});
        const shopCount = await ShopModel.count({});
        const addressCount = await AddressModel.count({});


        const response: IRes<IResStatisticDashboard> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {
            productCount: productCount,
            userCount: userCount,
            shopCount: shopCount,
            addressCount: addressCount,
          }
        };

        resolve(response);
      }
      catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<IResStatisticDashboard> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages
        };
        resolve(result);
      }
    });
  }
}
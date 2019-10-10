import { Request } from 'express';
import * as HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import { controller, httpGet, httpPut } from 'inversify-express-utils';
import { General } from '../../constant/generals';
import { HttpCodes } from '../../constant/http-codes';
import { ResponseMessages } from '../../constant/messages';
import TYPES from '../../constant/types';
import { IRes } from '../../interfaces/i-res';
import ShopModel, { Shop } from '../../models/shop';
import ShopModel2 from '../../models/shop.model';
import { ShopService } from '../../services/shop.service';
import Joi from '@hapi/joi';
import { UserService } from '../../services/user.service';

// schemas
import ListShopSchema from '../../validation-schemas/user/admin-list-shop.schema';
import AdminShopChangeStatus from '../../validation-schemas/user/admin-shop-change-status.schema';
import UserTypes = General.UserTypes;

interface IResShops {
  meta: {
    totalItems: number
  };
  shops: Shop[];
}

interface IResShopUpdateStatus {
  shop?: Shop;
}

@controller('/admin/shop')
export class AdminShopController {
  constructor(@inject(TYPES.ShopService) private shopService: ShopService,
              @inject(TYPES.UserService) private userService: UserService) {

  }

  @httpGet('/', TYPES.CheckTokenMiddleware, TYPES.CheckAdminMiddleware)
  public getList(req: Request): Promise<IRes<IResShops>> {
    return new Promise<IRes<IResShops>>(async (resolve) => {
      try {
        const {error} = Joi.validate(req.query, ListShopSchema);
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

        const {name, limit, page, status, sb, sd} = req.query;

        const queryObj = this.shopService.buildQueryGetListShop({
          name: name ? name : null,
          limit: parseInt((limit || 10).toString()),
          page: parseInt((page || 1).toString()),
          status: status ? parseInt(status) : null,
          sb: sb,
          sd: sd,
        });

        ShopModel2.findAndCountAll(queryObj)
          .then(result => {
            const response: IRes<any> = {
              status: HttpStatus.OK,
              messages: [ResponseMessages.SUCCESS],
              data: {
                meta: {
                  totalItems: result.count
                },
                shops: result.rows
              }
            };

            return resolve(response);
          });
      } catch (e) {
        console.error(e);
        const result: IRes<IResShops> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: [JSON.stringify(e)]
        };
        return resolve(result);
      }
    });
  }

  @httpPut('/status', TYPES.CheckTokenMiddleware, TYPES.CheckAdminMiddleware)
  public updateStatusShop(req: Request): Promise<IRes<IResShopUpdateStatus>> {
    return new Promise<IRes<IResShopUpdateStatus>>(async (resolve) => {
      try {
        const {error} = Joi.validate(req.body, AdminShopChangeStatus);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<IResShopUpdateStatus> = {
            status: HttpCodes.ERROR,
            messages: messages
          };

          return resolve(result);
        }

        const {shopId, status} = req.body;

        const shop = await ShopModel.findOne({where: {id: shopId}});
        if (!shop) {
          const result: IRes<IResShopUpdateStatus> = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.Shop.SHOP_NOT_FOUND]
          };

          return resolve(result);
        }

        // change status of shop
        shop.status = status;
        await shop.save();

        const user: any = await this.userService.findById(shop.user.toString());
        user.type = UserTypes.TYPE_SELLER;
        await user.save();

        return resolve({
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {
            shop: shop
          }
        });
      } catch (e) {
        console.error(e);
        const result: IRes<IResShopUpdateStatus> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: [JSON.stringify(e)]
        };
        return resolve(result);
      }
    });
  }
}

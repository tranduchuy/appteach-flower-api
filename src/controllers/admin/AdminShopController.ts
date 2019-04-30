import { Request } from 'express';
import * as HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { ResponseMessages } from '../../constant/messages';
import TYPES from '../../constant/types';
import { IRes } from '../../interfaces/i-res';
import ShopModel, { Shop } from '../../models/shop';
import { ShopService } from '../../services/shop.service';
import Joi from '@hapi/joi';

// schemas
import ListShopSchema from '../../validation-schemas/user/admin-list-shop.schema';

interface IResShops {
  meta: {
    totalItems: number
  };
  shops: Shop[];
}

@controller('/admin/shop')
export class AdminShopController {
  constructor(@inject(TYPES.ShopService) private shopService: ShopService){

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
        const stages: any[] = this.shopService.buildStageGetListShop({
          name: name ? name : null,
          limit: parseInt((limit || 10).toString()),
          page: parseInt((page || 1).toString()),
          status: status ? parseInt(status) : null,
          sb: sb,
          sd: sd,
        });

        const result: any = await ShopModel.aggregate(stages);
        const response: IRes<IResShops> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {
            meta: {
              totalItems: result[0].meta[0] ? result[0].meta[0].totalItems : 0
            },
            shops: result[0].entries
          }
        };

        resolve(response);
      }
      catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<IResShops> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages
        };
        resolve(result);
      }
    });
  }
}
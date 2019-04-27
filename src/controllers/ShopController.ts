import { inject } from 'inversify';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { ResponseMessages } from '../constant/messages';
import TYPES from '../constant/types';
import { Request } from 'express';
import { IRes } from '../interfaces/i-res';
import { ShopService } from '../services/shop.service';
import * as HttpStatus from 'http-status-codes';
import registerShopSchema from '../validation-schemas/shop/shop-register.schema';
import Joi from '@hapi/joi';
import ShopModel from '../models/shop';

interface IResRegisterShop {

}

interface IResCheckValidSlug {

}

@controller('/shop')
export class ShopController {
  constructor(@inject(TYPES.ShopService) private shopService: ShopService) {

  }

  @httpPost('/', TYPES.CheckTokenMiddleware)
  public registerShop(req: Request): Promise<IRes<IResRegisterShop>> {
    return new Promise<IRes<any>>(resolve => {
      const {error} = Joi.validate(req.body, registerShopSchema);
      if (error) {
        const messages = error.details.map(detail => {
          return detail.message;
        });

        const result: IRes<IResRegisterShop> = {
          status: HttpStatus.BAD_REQUEST,
          messages: messages
        };

        return resolve(result);
      }

      const {name, slug, images, availableShipCountry, availableShipAddresses} = req.body;

    });
  }

  @httpGet('/check-shop-slug', TYPES.CheckTokenMiddleware)
  public checkShopSlug(req: Request): Promise<IRes<IResCheckValidSlug>> {
    return new Promise<IRes<IResCheckValidSlug>>(async (resolve) => {
      const shop = await ShopModel.findOne({slug: req.query.slug});
      if (shop) {
        return resolve({
          status: HttpStatus.BAD_REQUEST,
          messages: [ResponseMessages.Shop.DUPLICATE_SLUG]
        });
      }

      return resolve({
        status: HttpStatus.OK,
        messages: [ResponseMessages.SUCCESS]
      });
    });
  }
}
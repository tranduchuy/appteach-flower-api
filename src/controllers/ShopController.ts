import { inject } from 'inversify';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { ResponseMessages } from '../constant/messages';
import TYPES from '../constant/types';
import { Request } from 'express';
import { IRes } from '../interfaces/i-res';
import { AddressService } from '../services/address.service';
import { ShopService } from '../services/shop.service';
import * as HttpStatus from 'http-status-codes';
import registerShopSchema from '../validation-schemas/shop/shop-register.schema';
import Joi from '@hapi/joi';
import ShopModel, { Shop } from '../models/shop';

interface IResRegisterShop {
  shop: Shop;
}

interface IResCheckValidSlug {

}

@controller('/shop')
export class ShopController {
  constructor(@inject(TYPES.ShopService) private shopService: ShopService,
              @inject(TYPES.AddressService) private addressService: AddressService) {

  }

  @httpPost('/', TYPES.CheckTokenMiddleware)
  public registerShop(req: Request): Promise<IRes<IResRegisterShop>> {
    return new Promise<IRes<any>>(async resolve => {
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
      const shop: any = await this.shopService.createNewShop(req.user._id.toString(), name, slug, images, availableShipCountry);

      await Promise.all(availableShipAddresses.map(async (addressData: { city: string, district?: number }) => {
        await this.addressService.createPossibleDeliveryAddress({
          district: addressData.district,
          city: addressData.city,
          shopId: shop._id.toString()
        });
      }));

      const result: IRes<IResRegisterShop> = {
        status: HttpStatus.OK,
        messages: [ResponseMessages.SUCCESS],
        data: {
          shop
        }
      };

      return resolve(result);
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
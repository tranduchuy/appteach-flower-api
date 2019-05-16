import { inject } from 'inversify';
import { controller, httpGet, httpPost } from 'inversify-express-utils';
import { ResponseMessages } from '../constant/messages';
import TYPES from '../constant/types';
import { Request } from 'express';
import { IRes } from '../interfaces/i-res';
import { AddressService } from '../services/address.service';
import { ProductService } from '../services/product.service';
import { IQueryProductsOfShop, ShopService } from '../services/shop.service';
import * as HttpStatus from 'http-status-codes';
import registerShopSchema from '../validation-schemas/shop/shop-register.schema';
import checkShopSlugSchema from '../validation-schemas/shop/check-shop-slug.schema';
import listProductsOfShopSchema from '../validation-schemas/shop/list-product-of-shop.schema';
import checkUpdateStatusProducts from '../validation-schemas/shop/check-update-status-products.schema';
import Joi from '@hapi/joi';
import ShopModel, { Shop } from '../models/shop';
import ProductModel, { Product } from '../models/product';
import ListShopSchema from '../validation-schemas/user/admin-list-shop.schema';
import { OrderItemService } from '../services/order-item.service';
import OrderItemModel from '../models/order-item';

interface IResRegisterShop {
  shop: Shop;
}

interface IResCheckValidSlug {

}

interface IResProductOfShop {
  meta: {
    totalItems: number;
    limit: number;
    item: number;
    page: number;
  };
  products: Product[];
}

interface IResUpdateStatusMultipleProduct {

}

@controller('/shop')
export class ShopController {
  constructor(@inject(TYPES.ShopService) private shopService: ShopService,
              @inject(TYPES.ProductService) private productService: ProductService,
              @inject(TYPES.OrderItemService) private orderItemService: OrderItemService,
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

      // 1 user only have 1 shop
      const existShop = await this.shopService.findShopOfUser(req.user._id.toString());
      if (existShop) {
        const result: IRes<IResRegisterShop> = {
          status: HttpStatus.BAD_REQUEST,
          messages: [ResponseMessages.Shop.EXIST_SHOP_OF_USER]
        };

        return resolve(result);
      }

      const {name, slug, images, availableShipCountry, availableShipAddresses} = req.body;
      const duplicateShopSlug: any = await this.shopService.findShopBySlug(slug);
      if (duplicateShopSlug) {
        const result: IRes<IResRegisterShop> = {
          status: HttpStatus.BAD_REQUEST,
          messages: [ResponseMessages.Shop.DUPLICATE_SLUG]
        };

        return resolve(result);
      }

      const shop: any = await this.shopService.createNewShop(req.user._id.toString(), name, slug, images, availableShipCountry);

      await Promise.all((availableShipAddresses || []).map(async (addressData: { city: string, district?: number }) => {
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
      const {error} = Joi.validate(req.query, checkShopSlugSchema);
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

  @httpGet('/products', TYPES.CheckTokenMiddleware, TYPES.CheckUserTypeSellerMiddleware)
  public getShopProductsForControlling(req: Request): Promise<IRes<IResProductOfShop>> {
    return new Promise<IRes<IResProductOfShop>>(async resolve => {
      const {error} = Joi.validate(req.body, listProductsOfShopSchema);

      if (error) {
        const messages = error.details.map(detail => {
          return detail.message;
        });

        const result: IRes<IResProductOfShop> = {
          status: HttpStatus.BAD_REQUEST,
          messages: messages
        };

        return resolve(result);
      }

      const shop: any = await this.shopService.findShopOfUser(req.user._id.toString());
      if (!shop) {
        return resolve({
          status: HttpStatus.BAD_REQUEST,
          messages: [ResponseMessages.Shop.SHOP_OF_USER_NOT_FOUND]
        });
      }

      const {limit, page, title, status, sb, sd} = req.query;
      const queryCondition: IQueryProductsOfShop = {
        limit: parseInt((limit || 10).toString()),
        page: parseInt((page || 1).toString()),
        shopId: shop._id.toString(),
        title: title || null,
        status: status ? parseInt(status.toString()) : null,
        sortBy: sb || null,
        sortDirection: sd || null
      };
      const stages: any[] = this.shopService.buildStageQueryProductOfShop(queryCondition);
      console.log('stages query search', JSON.stringify(stages));
      const result: any = await ProductModel.aggregate(stages);

      return resolve({
        status: HttpStatus.OK,
        messages: [ResponseMessages.SUCCESS],
        data: {
          meta: {
            totalItems: result[0].meta[0] ? result[0].meta[0].totalItems : 0,
            item: result[0].entries.length,
            limit: queryCondition.limit,
            page: queryCondition.page,
          },
          products: result[0].entries
        }
      });
    });
  }

  @httpPost('/products/update-status', TYPES.CheckTokenMiddleware, TYPES.CheckUserTypeSellerMiddleware)
  public updateStatusMultipleProduct(req: Request): Promise<IRes<IResUpdateStatusMultipleProduct>> {
    return new Promise<IRes<IResUpdateStatusMultipleProduct>>(async resolve => {
      const {error} = Joi.validate(req.body, checkUpdateStatusProducts);

      if (error) {
        const messages = error.details.map(detail => {
          return detail.message;
        });

        const result: IRes<IResProductOfShop> = {
          status: HttpStatus.BAD_REQUEST,
          messages: messages
        };

        return resolve(result);
      }

      const shop: any = await this.shopService.findShopOfUser(req.user._id.toString());
      if (!shop) {
        return resolve({
          status: HttpStatus.BAD_REQUEST,
          messages: [ResponseMessages.Shop.SHOP_OF_USER_NOT_FOUND]
        });
      }

      const {productIds, status} = req.body;
      const result: any = await this.productService.updateMultipleProducts(shop._id, productIds, status);

      return resolve({
        status: HttpStatus.OK,
        messages: [`Cập nhật trạng thái thành công cho ${result.modifiedCount} sản phẩm`]
      });
    });
  }

  @httpGet('/order', TYPES.CheckTokenMiddleware, TYPES.CheckUserTypeSellerMiddleware)
  public getOrderItemList(req: Request): Promise<IRes<any>> {
    return new Promise<IRes<any>>(async (resolve) => {
      try {
        const {error} = Joi.validate(req.query, ListShopSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<any> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages
          };
          return resolve(result);
        }

        const shop: any = await this.shopService.findShopOfUser(req.user._id.toString());

        if (!shop) {
          return resolve({
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.Shop.SHOP_OF_USER_NOT_FOUND]
          });
        }

        const {limit, page, status} = req.query;
        const stages: any[] = this.orderItemService.buildStageGetListOrderItem({
          shop: shop._id ? shop._id : null,
          limit: parseInt((limit || 10).toString()),
          page: parseInt((page || 1).toString()),
          status: status ? parseInt(status) : null,
        });

        console.log(JSON.stringify(stages));
        const result: any = await OrderItemModel.aggregate(stages);
        const response: IRes<any> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {
            meta: {
              totalItems: result[0].meta[0] ? result[0].meta[0].totalItems : 0
            },
            orderItems: result[0].entries
          }
        };

        resolve(response);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<any> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages
        };
        resolve(result);
      }
    });
  }
}
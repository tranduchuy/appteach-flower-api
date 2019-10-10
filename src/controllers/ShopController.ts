import { inject } from 'inversify';
import { controller, httpGet, httpPost, httpPut } from 'inversify-express-utils';
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
import ProductModel, { Product } from '../models/product';
import ListShopSchema from '../validation-schemas/user/admin-list-shop.schema';
import { OrderItemService } from '../services/order-item.service';
import OrderItemModel from '../models/order-item';
import UpdateShopSchema from '../validation-schemas/shop/update-shop.schema';
import { UserService } from '../services/user.service';
import { General } from '../constant/generals';
import RegisterByTypes = General.RegisterByTypes;
import UserTypes = General.UserTypes;
import UserModel2, { User2 } from '../models/user.model';
import { SmsService } from '../services/sms.service';
import ShopModel2, { Shop2 } from '../models/shop.model';

interface IResRegisterShop {
  shop: Shop2;
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
    @inject(TYPES.AddressService) private addressService: AddressService,
    @inject(TYPES.UserService) private userService: UserService,
    @inject(TYPES.SmsService) private smsService: SmsService, ) {

  }

  @httpPost('/')
  public registerShop(req: Request): Promise<IRes<IResRegisterShop>> {
    return new Promise<IRes<any>>(async resolve => {
      try {
        const { error } = Joi.validate(req.body, registerShopSchema);
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

        const {
          email, password, confirmedPassword,
          name, username, phone, address, gender, longitude, latitude,
          shopName, slug, images, availableShipCountry, availableShipAddresses
        } = req.body;

        const duplicatedPhones = await UserModel2.findAll({ where: { phone } });
        if (duplicatedPhones.length !== 0) {
          const result: IRes<{}> = {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            messages: [ResponseMessages.User.Register.PHONE_DUPLICATED],
            data: {}
          };
          return resolve(result);
        }

        const duplicateShopSlug: any = await this.shopService.findShopBySlug(slug);
        if (duplicateShopSlug) {
          const result: IRes<any> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.Shop.DUPLICATE_SLUG]
          };

          return resolve(result);
        }

        if (password !== confirmedPassword) {
          const result: IRes<{}> = {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            messages: [ResponseMessages.User.Register.PASSWORD_DONT_MATCH],
            data: {}
          };
          return resolve(result);
        }

        const duplicatedUsers = await UserModel2.findAll({ where: { email } });
        if (duplicatedUsers.length !== 0) {
          const result: IRes<{}> = {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            messages: [ResponseMessages.User.Register.EMAIL_DUPLICATED],
            data: {}
          };
          return resolve(result);
        }

        const otpCode = this.userService.generateOTPCode();

        const newUserData = {
          email,
          name,
          password,
          type: UserTypes.TYPE_CUSTOMER,
          role: null,
          phone: phone,
          gender,
          city: null,
          district: null,
          ward: null,
          registerBy: RegisterByTypes.NORMAL,
          address: null,
          otpCode
        };

        const newUser = await this.userService.createUser(newUserData);
        const newShop: any = await this.shopService.createNewShop(newUser.id, shopName, slug, images, availableShipCountry);

        await this.addressService.createShopAddress({
          name,
          email,
          phone,
          address,
          longitude,
          latitude,
          usersId: newUser.id,
          shopsId: newShop.id,
          citiesId: null,
          districtsId: null
        });

        if (availableShipAddresses.length > 0) {
          await this.addressService.deleteOldPossibleDeliveryAddress(newShop.id);
        }

        await Promise.all((availableShipAddresses || [])
          .map(async (addressData: { city: string, district?: number }) => {

            const addressCity = await this.addressService.getCityByCode(addressData.city);
            const addressDistrict = await this.addressService.getDistrictByCode(addressData.district);

            await this.addressService.createPossibleDeliveryAddress({
              name,
              email,
              phone,
              address,
              longitude,
              latitude,
              usersId: newUser.id,
              shopsId: newShop.id,
              districtsId: addressDistrict.id,
              citiesId: addressCity.id,
            });
          }));

        this.smsService.sendSMS([phone], `Mã xác thực tài khoản: ${otpCode}`, '');

        const result: IRes<{}> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.User.Register.REGISTER_SUCCESS],
          data: {
            meta: {},
            entries: [{ email, name, username, phone, address, gender, longitude, latitude }]
          }
        };

        return resolve(result);
      } catch (e) {
        console.error(e);
        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: [JSON.stringify(e)],
        };
        return resolve(result);
      }
    });
  }

  @httpPut('/', TYPES.CheckTokenMiddleware)
  public updateShop(req: Request): Promise<IRes<IResRegisterShop>> {
    return new Promise<IRes<any>>(async resolve => {
      try {
        const { error } = Joi.validate(req.body, UpdateShopSchema);
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

        let shop = await this.shopService.findShopOfUser(req.user.id);
        if (!shop) {
          const result: IRes<IResRegisterShop> = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.Shop.SHOP_NOT_FOUND]
          };

          return resolve(result);
        }

        const shopUser = await this.userService.findById(req.user.id);

        const { availableShipCountry, availableShipAddresses, address, longitude, latitude } = req.body;
        await this.addressService.updateShopAddress(shop.id, { address, longitude, latitude });
        shop = await this.shopService.updateShop(shop, availableShipCountry);

        if (availableShipAddresses.length > 0) {
          // delete old possibaleDeliveryAddress
          await this.addressService.deleteOldPossibleDeliveryAddress(shop.id);
        }

        await Promise.all((availableShipAddresses || [])
          .map(async (addressData: { city: string, district?: number }) => {

            const addressCity = await this.addressService.getCityByCode(addressData.city);
            const addressDistrict = await this.addressService.getDistrictByCode(addressData.district);

            await this.addressService.createPossibleDeliveryAddress({
              name: shopUser.name,
              email: shopUser.email,
              phone: shopUser.phone,
              address,
              longitude,
              latitude,
              usersId: shopUser.id,
              shopsId: shop.id,
              districtsId: addressDistrict.id,
              citiesId: addressCity.id,
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
      } catch (e) {
        console.error(e);
        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: [JSON.stringify(e)],
        };
        return resolve(result);
      }
    });
  }

  @httpGet('/detail', TYPES.CheckTokenMiddleware)
  public getDetailShop(req: Request): Promise<IRes<IResCheckValidSlug>> {
    return new Promise<IRes<IResCheckValidSlug>>(async (resolve) => {
      try {
        const shop = await this.shopService.findShopOfUser(req.user._id.toString());
        if (!shop) {
          return resolve({
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.Shop.SHOP_NOT_FOUND]
          });
        }

        const shopAddress = await this.addressService.getShopAddress(shop._id);
        const possibleDeliveryAddress = await this.addressService.getShopPossibleDeliveryAddress(shop._id);
        possibleDeliveryAddress.map(address => {
          return {
            district: address.district,
            city: address.city
          };
        });
        const result = {
          availableShipCountry: shop.availableShipCountry,
          availableShipAddresses: possibleDeliveryAddress,
          address: shopAddress
        };

        return resolve({
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: result
        });
      } catch (e) {
        console.error(e);
        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: [JSON.stringify(e)],
        };
        return resolve(result);
      }
    });
  }


  @httpGet('/check-shop-slug')
  public checkShopSlug(req: Request): Promise<IRes<IResCheckValidSlug>> {
    return new Promise<IRes<IResCheckValidSlug>>(async (resolve) => {
      try {
        const { error } = Joi.validate(req.query, checkShopSlugSchema);
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

        const shop = await ShopModel2.findOne({ where: { slug: req.query.slug } });
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
      } catch (e) {
        console.error(e);
        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: [JSON.stringify(e)],
        };
        return resolve(result);
      }
    });
  }

  @httpGet('/products', TYPES.CheckTokenMiddleware, TYPES.CheckUserTypeSellerMiddleware)
  public getShopProductsForControlling(req: Request): Promise<IRes<IResProductOfShop>> {
    return new Promise<IRes<IResProductOfShop>>(async resolve => {
      try {
        const { error } = Joi.validate(req.body, listProductsOfShopSchema);

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

        const { limit, page, title, status, approvedStatus, sb, sd } = req.query;
        const queryCondition: IQueryProductsOfShop = {
          limit: parseInt((limit || 10).toString()),
          page: parseInt((page || 1).toString()),
          shopId: shop._id.toString(),
          title: title || null,
          status: status ? parseInt(status.toString()) : null,
          approvedStatus: approvedStatus ? parseInt(approvedStatus) : null,
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
      } catch (e) {
        console.error(e);
        const result: IRes<IResProductOfShop> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: [JSON.stringify(e)],
        };
        return resolve(result);
      }
    });
  }

  @httpPost('/products/update-status', TYPES.CheckTokenMiddleware, TYPES.CheckUserTypeSellerMiddleware)
  public updateStatusMultipleProduct(req: Request): Promise<IRes<IResUpdateStatusMultipleProduct>> {
    return new Promise<IRes<IResUpdateStatusMultipleProduct>>(async resolve => {
      try {
        const { error } = Joi.validate(req.body, checkUpdateStatusProducts);

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

        const { productIds, status } = req.body;
        const result: any = await this.productService.updateMultipleProducts(shop._id, productIds, status);

        return resolve({
          status: HttpStatus.OK,
          messages: [`Cập nhật trạng thái thành công cho ${result.modifiedCount} sản phẩm`]
        });

      } catch (e) {
        console.error(e);
        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: [JSON.stringify(e)],
        };
        return resolve(result);
      }
    });
  }

  @httpGet('/order', TYPES.CheckTokenMiddleware, TYPES.CheckUserTypeSellerMiddleware)
  public getOrderItemList(req: Request): Promise<IRes<any>> {
    return new Promise<IRes<any>>(async (resolve) => {
      try {
        const { error } = Joi.validate(req.query, ListShopSchema);
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

        const { limit, sb, sd, page, status, startDate, endDate } = req.query;
        const stages: any[] = this.orderItemService.buildStageGetListOrderItem({
          shop: shop._id ? shop._id : null,
          limit: parseInt((limit || 10).toString()),
          page: parseInt((page || 1).toString()),
          status: status ? parseInt(status) : null,
          sb: sb,
          sd: sd,
          startDate,
          endDate
        });

        console.log('stages: ', JSON.stringify(stages));
        const result: any = await OrderItemModel.aggregate(stages);

        // const orderItems = await Promise.all(result[0].entries.map(async oi => {
        //   if (!oi.orderInfo.buyerInfo || oi.orderInfo.buyerInfo === null) {
        //     const buyer = await UserModel.findOne({_id: oi.orderInfo.fromUser});
        //     oi.buyerInfo = {
        //       name: buyer.name,
        //       phone: buyer.phone
        //     };
        //   } else {
        //     oi.buyerInfo = oi.orderInfo.buyerInfo;
        //   }
        //
        //   oi.submitAt = oi.orderInfo.submitAt;
        //   delete oi.orderInfo.buyerInfo;
        //   oi.receiverInfo = await AddressModel.findOne({_id: oi.orderInfo.address});
        //   return oi;
        // }));


        const response: IRes<any> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {
            meta: {
              totalItems: result[0].meta[0] ? result[0].meta[0].totalItems : 0
            },
            orders: result[0].entries
          }
        };

        return resolve(response);
      } catch (e) {
        console.error(e);
        const result: IRes<{}> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: [JSON.stringify(e)],
        };
        return resolve(result);
      }
    });
  }
}

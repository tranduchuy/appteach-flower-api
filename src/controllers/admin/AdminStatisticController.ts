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
import OrderItemModel from '../../models/order-item';
import Joi from '@hapi/joi';
import AdminOrderStatisticSchema from '../../validation-schemas/statistic/admin-order-statistic.schema';

import CheckDateSchema from '../../validation-schemas/statistic/check-date.schema';
import { Status } from '../../constant/status';
import OrderModel from '../../models/order';

// schemas

interface IResStatisticDashboard {
  productCount: number;
  userCount: number;
  shopCount: number;
  addressCount: number;
}

@controller('/admin/statistic')
export class AdminStatisticController {
  listProductFields = ['_id', 'code', 'status', 'title', 'images', 'originalPrice', 'saleOff', 'slug', 'view', 'sold'];

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


  @httpGet('/shop/order', TYPES.CheckTokenMiddleware, TYPES.CheckAdminMiddleware)
  public getStatisticOrder(req: Request): Promise<IRes<IResStatisticDashboard>> {
    return new Promise<IRes<IResStatisticDashboard>>(async (resolve) => {
      try {
        const {error} = Joi.validate(req.query, AdminOrderStatisticSchema);

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


        const {startDate, endDate, shopId} = req.query;

        const shop: any = await ShopModel.findById(shopId);

        if (!shop) {
          const result = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.OrderItem.ORDER_ITEM_NOT_FOUND]
          };

          return resolve(result);
        }


        const objectFilterByDate: any = {};
        if (startDate) {
          objectFilterByDate.createdAt = {
            $gte: new Date(startDate)
          };
        }

        if (endDate) {
          objectFilterByDate.createdAt = objectFilterByDate.createdAt || {};
          objectFilterByDate.createdAt['$lt'] = new Date(endDate);
        }

        const orderItemCount = await OrderItemModel.count({
          shop: shop._id,
          ...objectFilterByDate,
          status: {
            $ne: Status.ORDER_ITEM_NEW
          }
        });

        const processingOrderItemCount = await OrderItemModel.count({
          shop: shop._id,
          status: Status.ORDER_ITEM_PROCESSING,
          ...objectFilterByDate
        });

        const onDeliveryOrderItemCount = await OrderItemModel.count({
          shop: shop._id,
          status: Status.ORDER_ITEM_ON_DELIVERY,
          ...objectFilterByDate
        });

        const finishedOrderItemCount = await OrderItemModel.count({
          shop: shop._id,
          status: Status.ORDER_ITEM_FINISHED,
          ...objectFilterByDate
        });

        const cancelledOrderItemCount = await OrderItemModel.count({
          shop: shop._id,
          status: Status.ORDER_ITEM_CANCEL,
          ...objectFilterByDate
        });

        let revenue = 0;
        let shippingCost = 0;
        let discountCost = 0;
        const finishedOrderItems = await OrderItemModel.find({
          shop: shop._id,
          status: Status.ORDER_ITEM_FINISHED,
          ...objectFilterByDate
        });
        finishedOrderItems.map(async item => {
          revenue += (item.total || 0);
          shippingCost += (item.shippingCost || 0);
          discountCost += (item.discount || 0);
        });

        const shopOrderIds = await OrderItemModel.find({
          shop: shop._id,
          ...objectFilterByDate
        }).distinct('order');

        const orderUsers = await OrderModel.find({
          _id: {'$in': shopOrderIds},
          ...objectFilterByDate
        }).distinct('fromUser');


        const response: IRes<any> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {
            orderItemCount,
            finishedOrderItemCount,
            processingOrderItemCount,
            onDeliveryOrderItemCount,
            cancelledOrderItemCount,
            revenue,
            shippingCost,
            discountCost,
            numberOfUser: orderUsers.length
          }
        };

        return resolve(response);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<IResStatisticDashboard> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages
        };
        return resolve(result);
      }
    });
  }

  @httpGet('/order', TYPES.CheckTokenMiddleware, TYPES.CheckAdminMiddleware)
  public getStatisticAllOrder(req: Request): Promise<IRes<IResStatisticDashboard>> {
    return new Promise<IRes<IResStatisticDashboard>>(async (resolve) => {
      try {
        const {startDate, endDate} = req.query;


        const objectFilterByDate: any = {};
        if (startDate) {
          objectFilterByDate.createdAt = {
            $gte: new Date(startDate)
          };
        }

        if (endDate) {
          objectFilterByDate.createdAt = objectFilterByDate.createdAt || {};
          objectFilterByDate.createdAt['$lt'] = new Date(endDate);
        }

        const orderItemCount = await OrderItemModel.count({
          ...objectFilterByDate,
          status: {
            $ne: Status.ORDER_ITEM_NEW
          }
        });

        const processingOrderItemCount = await OrderItemModel.count({
          status: Status.ORDER_ITEM_PROCESSING,
          ...objectFilterByDate
        });

        const onDeliveryOrderItemCount = await OrderItemModel.count({
          status: Status.ORDER_ITEM_ON_DELIVERY,
          ...objectFilterByDate
        });

        const finishedOrderItemCount = await OrderItemModel.count({
          status: Status.ORDER_ITEM_FINISHED,
          ...objectFilterByDate
        });

        const cancelledOrderItemCount = await OrderItemModel.count({
          status: Status.ORDER_ITEM_CANCEL,
          ...objectFilterByDate
        });

        let revenue = 0;
        let shippingCost = 0;
        let discountCost = 0;
        const finishedOrderItems = await OrderItemModel.find({
          status: Status.ORDER_ITEM_FINISHED,
          ...objectFilterByDate
        });
        finishedOrderItems.map(async item => {
          revenue += (item.total || 0);
          shippingCost += (item.shippingCost || 0);
          discountCost += (item.discount || 0);
        });

        const OrderIds = await OrderItemModel.find({
          ...objectFilterByDate
        }).distinct('order');

        const orderUsers = await OrderModel.find({
          _id: {'$in': OrderIds},
          ...objectFilterByDate
        }).distinct('fromUser');

        const orderShops = await OrderItemModel.find({
          ...objectFilterByDate
        }).distinct('shop');


        const response: IRes<any> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {
            orderItemCount,
            finishedOrderItemCount,
            processingOrderItemCount,
            onDeliveryOrderItemCount,
            cancelledOrderItemCount,
            revenue,
            shippingCost,
            discountCost,
            numberOfUser: orderUsers.length,
            numberOfShop: orderShops.length
          }
        };

        return resolve(response);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<IResStatisticDashboard> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages
        };
        return resolve(result);
      }
    });
  }

  @httpGet('/product', TYPES.CheckTokenMiddleware, TYPES.CheckAdminMiddleware)
  public getStatisticProduct(req: Request): Promise<IRes<IResStatisticDashboard>> {
    return new Promise<IRes<IResStatisticDashboard>>(async (resolve) => {
      try {
        const {error} = Joi.validate(req.query, CheckDateSchema);

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

        const {startDate, endDate} = req.query;


        const objectFilterByDate: any = {};
        if (startDate) {
          objectFilterByDate.createdAt = {
            $gte: new Date(startDate)
          };
        }

        if (endDate) {
          objectFilterByDate.createdAt = objectFilterByDate.createdAt || {};
          objectFilterByDate.createdAt['$lt'] = new Date(endDate);
        }

        const topBestSellerProducts = await ProductModel.find({
          ...objectFilterByDate
        }, this.listProductFields).sort({sold: -1}).limit(10);

        const topViewProducts = await ProductModel.find({
          ...objectFilterByDate
        }, this.listProductFields).sort({view: -1}).limit(10);


        const response: IRes<any> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {
            topBestSellerProducts,
            topViewProducts
          }
        };

        return resolve(response);
      } catch (e) {
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<IResStatisticDashboard> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages
        };
        return resolve(result);
      }
    });
  }
}
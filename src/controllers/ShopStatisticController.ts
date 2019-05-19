import { Request } from 'express';
import * as HttpStatus from 'http-status-codes';
import { controller, httpGet } from 'inversify-express-utils';
import { ResponseMessages } from '../constant/messages';
import TYPES from '../constant/types';
import { IRes } from '../interfaces/i-res';
// import OrderModel from '../models/order';
import OrderItemModel from '../models/order-item';
import Joi from '@hapi/joi';
import CheckDateValidationSchema from '../validation-schemas/statistic/check-date.schema';
import { ShopService } from '../services/shop.service';
import { inject } from 'inversify';
import { Status } from '../constant/status';

// schemas

interface IResStatisticDashboard {
  productCount: number;
  userCount: number;
  shopCount: number;
  addressCount: number;
}

@controller('/shop/statistic')
export class ShopStatisticController {
  constructor(
    @inject(TYPES.ShopService) private shopService: ShopService
  ) {
  }

  @httpGet('/order', TYPES.CheckTokenMiddleware, TYPES.CheckUserTypeSellerMiddleware)
  public getStatisticOrder(req: Request): Promise<IRes<IResStatisticDashboard>> {
    return new Promise<IRes<IResStatisticDashboard>>(async (resolve) => {
      try {
        const {error} = Joi.validate(req.query, CheckDateValidationSchema);

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

        const shop: any = await this.shopService.findShopOfUser(req.user._id);

        if (!shop) {
          const result = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.OrderItem.ORDER_ITEM_NOT_FOUND]
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

        const response: IRes<any> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {
            orderItemCount,
            finishedOrderItemCount,
            processingOrderItemCount,
            onDeliveryOrderItemCount
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

  @httpGet('/money', TYPES.CheckTokenMiddleware, TYPES.CheckUserTypeSellerMiddleware)
  public getStatisticMoney(req: Request): Promise<IRes<IResStatisticDashboard>> {
    return new Promise<IRes<IResStatisticDashboard>>(async (resolve) => {
      try {
        const {error} = Joi.validate(req.query, CheckDateValidationSchema);

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

        const shop: any = await this.shopService.findShopOfUser(req.user._id);

        if (!shop) {
          const result = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.OrderItem.ORDER_ITEM_NOT_FOUND]
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

        const finishedOrderItems = await OrderItemModel.find({
          shop: shop._id,
          status: Status.ORDER_ITEM_FINISHED,
          ...objectFilterByDate
        });

        let revenue = 0;
        let shippingCost = 0;
        let discountCost = 0;
        finishedOrderItems.map(async item => {
          revenue += (item.total || 0);
          shippingCost += (item.shippingCost || 0);
          discountCost += (item.discount || 0);
        });

        const response: IRes<any> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: {
            revenue,
            shippingCost,
            discountCost
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
import * as HttpStatus from 'http-status-codes';
import { controller, httpPut } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request } from 'express';
import Joi from '@hapi/joi';
import { Status } from '../constant/status';
import TYPES from '../constant/types';
import { IRes } from '../interfaces/i-res';
import { OrderItemRoute } from '../constant/routeMap';
import { Order } from '../models/order';
import { ResponseMessages } from '../constant/messages';
import { OrderItemService } from '../services/order-item.service';
import UpdateOrderItemQuantityValidationSchema
  from '../validation-schemas/order-item/update-order-item-quantity.schema';
import { ObjectID } from 'bson';
import { ShopService } from '../services/shop.service';
import UpdateOrderItemStatusValidationSchema from '../validation-schemas/order-item/update-order-item-status.schema';
import { NotifyService } from '../services/notify.service';

@controller(OrderItemRoute.Name)
export class OrderItemController {
  constructor(
    @inject(TYPES.OrderItemService) private orderItemService: OrderItemService,
    @inject(TYPES.ShopService) private shopService: ShopService,
    @inject(TYPES.NotifyService) private notifyService: NotifyService
  ) {
  }

  @httpPut(OrderItemRoute.UpdateOrderItem, TYPES.CheckTokenMiddleware)
  public updateOrderItem(request: Request): Promise<IRes<Order>> {
    return new Promise<IRes<any>>(async (resolve) => {
      try {
        const {error} = Joi.validate(request.body, UpdateOrderItemQuantityValidationSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<{ Order }> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages
          };

          return resolve(result);
        }

        const id = request.params.id;
        if (!ObjectID.isValid(id)) {
          const result = {
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.INVALID_ID]
          };
          return resolve(result);
        }

        const orderItem = await this.orderItemService.findNewOrderItemById(id);
        if (!orderItem) {
          const result = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.OrderItem.ORDER_ITEM_NOT_FOUND]
          };

          return resolve(result);
        }

        if (orderItem.status !== Status.ORDER_ITEM_NEW) {
          return resolve({
            status: HttpStatus.BAD_REQUEST,
            messages: [ResponseMessages.OrderItem.ORDER_SUBMITTED]
          });
        }

        const {quantity} = request.body;
        const newOrderItem = {
          quantity
        };

        const orderItemResult = await this.orderItemService.updateOrderItem(orderItem, newOrderItem);
        const result: IRes<Order> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: orderItemResult
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

  @httpPut(OrderItemRoute.UpdateOrderItemStatus, TYPES.CheckTokenMiddleware, TYPES.CheckUserTypeSellerMiddleware)
  public updateOrderItemStatus(request: Request): Promise<IRes<Order>> {
    return new Promise<IRes<any>>(async (resolve) => {
      try {
        const {error} = Joi.validate(request.body, UpdateOrderItemStatusValidationSchema);
        if (error) {
          const messages = error.details.map(detail => {
            return detail.message;
          });

          const result: IRes<{ Order }> = {
            status: HttpStatus.BAD_REQUEST,
            messages: messages
          };

          return resolve(result);
        }

        const {status, orderItemIds} = request.body;

        const shop: any = await this.shopService.findShopOfUser(request.user._id);
        if (!shop) {
          const result = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.OrderItem.ORDER_ITEM_NOT_FOUND]
          };

          return resolve(result);
        }

        if (!shop) {
          const result = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.OrderItem.ORDER_ITEM_NOT_FOUND]
          };

          return resolve(result);
        }

        await Promise.all((orderItemIds || []).map(async orderItemId => {
          const orderItem = await this.orderItemService.findOrderItemById(orderItemId);

          if (shop._id.toString() !== orderItem.shop.toString()) {
            throw new Error(ResponseMessages.OrderItem.ORDER_ITEM_NOT_FOUND);
          }

          if (orderItem.status === Status.ORDER_ITEM_NEW) {
            throw new Error(ResponseMessages.OrderItem.WRONG_STATUS_FLOW);
          }

          if (status <= orderItem.status) {
            throw new Error(ResponseMessages.OrderItem.WRONG_STATUS_FLOW);
          }

          await this.orderItemService.updateStatus(orderItem._id, status);
          await this.notifyService.notifyUpdateOrderItemStatusToUser(orderItem._id);
        }));

        const result: IRes<Order> = {
          status: HttpStatus.OK,
          messages: [ResponseMessages.SUCCESS],
          data: null
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
}

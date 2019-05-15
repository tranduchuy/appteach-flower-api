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
import UpdateOrderItemValidationSchema from '../validation-schemas/order-item/update-delivery-address.schema';
import { ObjectID } from 'bson';

@controller(OrderItemRoute.Name)
export class OrderItemController {
  constructor(
    @inject(TYPES.OrderItemService) private orderItemService: OrderItemService
  ) {
  }

  @httpPut(OrderItemRoute.UpdateOrderItem, TYPES.CheckTokenMiddleware)
  public updateOrderItem(request: Request): Promise<IRes<Order>> {
    return new Promise<IRes<any>>(async (resolve) => {
      try {
        const {error} = Joi.validate(request.body, UpdateOrderItemValidationSchema);
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
        const messages = Object.keys(e.errors).map(key => {
          return e.errors[key].message;
        });

        const result: IRes<Order> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: messages
        };
        return resolve(result);
      }
    });
  }
}
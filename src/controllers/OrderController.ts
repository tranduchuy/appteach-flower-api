import * as HttpStatus from 'http-status-codes';
import { controller, httpPost, httpGet, httpDelete, httpPut } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';

import TYPES from '../constant/types';
import { IRes } from '../interfaces/i-res';
import { OrderService } from '../services/order.service';
import { OrderRoute } from '../constant/routeMap';
import { Order } from '../models/order';
import { ResponseMessages } from '../constant/messages';
import { ProductService } from '../services/product.service';
import { HttpCodes } from '../constant/http-codes';
import { OrderItem } from '../models/order-item';

@controller(OrderRoute.Name)
export class OrderController {
  constructor(
    @inject(TYPES.ProductService) private productService: ProductService,
    @inject(TYPES.OrderService) private orderService: OrderService
  ) {
  }

  @httpGet(OrderRoute.GetOrder, TYPES.CheckTokenMiddleware)
  public getOrder(request: Request, response: Response): Promise<IRes<Order[]>> {
    return new Promise<IRes<Order[]>>(async (resolve, reject) => {
      const user = request.user;
      const status = request.query.status;

      let order = null;
      if (status) order = await this.orderService.findPendingOrder(user.id);
      else order = await this.orderService.findOrder(user.id);

      if (!order) {
        const result = {
          status: HttpStatus.NOT_FOUND,
          messages: [ResponseMessages.Order.ORDER_NOT_FOUND],
          data: null
        };
        resolve(result);
      }

      const result: IRes<Order[]> = {
        status: HttpCodes.SUCCESS,
        messages: [ResponseMessages.SUCCESS],
        data: order
      };
      resolve(result);
    });
  }

  @httpGet(OrderRoute.GetOrderItem, TYPES.CheckTokenMiddleware)
  public getOrderItem(request: Request, response: Response): Promise<IRes<OrderItem[]>> {
    return new Promise<IRes<OrderItem[]>>(async (resolve, reject) => {
      try {
        const orderId = request.params.orderId;

        let orderItem = null;
        if (orderId) orderItem = await this.orderService.findItemInOrder(orderId);

        if (!orderItem) {
          const result = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.Order.ORDER_NOT_FOUND],
            data: null
          };
          resolve(result);
        }

        const result: IRes<OrderItem[]> = {
          status: HttpCodes.SUCCESS,
          messages: [ResponseMessages.SUCCESS],
          data: orderItem
        };
        resolve(result);
      } catch (error) {
        console.log(error);

        const result: IRes<OrderItem[]> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: error.messages,
          data: null
        };
        resolve(result);
      }
    });
  }

  @httpPost(OrderRoute.AddItem, TYPES.CheckTokenMiddleware)
  public addOne(request: Request, response: Response): Promise<IRes<Order>> {
    return new Promise<IRes<Order>>(async (resolve, reject) => {
      try {
        const { productId, quantity } = request.body;
        const user = request.user;

        let order = await this.orderService.findPendingOrder(user.id);
        if (!order) order = await this.orderService.createOrder(user);

        const product = await this.productService.findProductById(productId);
        if (!product) throw ('Product not found');

        const orderItem = await this.orderService.findOrderItem(order, product);
        if (!orderItem) await this.orderService.addItem(order, product, quantity);
        else await this.orderService.updateItem(orderItem, quantity);

        const result: IRes<Order> = {
          status: HttpCodes.SUCCESS,
          messages: [ResponseMessages.SUCCESS],
          data: order
        };
        resolve(result);
      } catch (error) {
        console.log(error);
        let result: IRes<Order> = null;

        if (error == 'Product not found') {
          result = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.Order.ORDER_NOT_FOUND],
            data: null
          };
        } else {
          result = {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            messages: error.messages,
            data: null
          };
        }
        resolve(result);
      }
    });
  }

  @httpPut(OrderRoute.SubmitOrder, TYPES.CheckTokenMiddleware)
  public submitOrder(request: Request, response: Response): Promise<IRes<Order>> {
    return new Promise<IRes<Order>>(async (resolve, reject) => {
      try {
        const user = request.user;

        const order = await this.orderService.findPendingOrder(user.id);
        if (!order) throw ('Order not found');

        await this.orderService.submitOrder(order);

        const result: IRes<Order> = {
          status: HttpCodes.SUCCESS,
          messages: [ResponseMessages.SUCCESS],
          data: order
        };
        resolve(result);
      } catch (error) {
        console.log(error);
        let result: IRes<Order> = null;

        if (error == 'Order not found') {
          result = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.Order.ORDER_NOT_FOUND],
            data: null
          };
        } else {
          result = {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            messages: error.messages,
            data: null
          };
        }
        resolve(result);
      }
    });
  }

  @httpDelete(OrderRoute.DeleteItem, TYPES.CheckTokenMiddleware)
  public deleteItem(request: Request, response: Response): Promise<IRes<OrderItem>> {
    return new Promise<IRes<OrderItem>>(async (resolve, reject) => {
      try {
        const itemId = request.params.itemId;

        await this.orderService.deleteItem(itemId);

        const result: IRes<OrderItem> = {
          status: HttpCodes.SUCCESS,
          messages: [ResponseMessages.SUCCESS],
          data: null
        };
        resolve(result);
      } catch (error) {
        console.log(error);

        const result: IRes<OrderItem> = {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          messages: error.messages,
          data: null
        };
        resolve(result);
      }
    });
  }
}
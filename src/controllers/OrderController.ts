import * as HttpStatus from 'http-status-codes';
import * as _ from 'lodash';
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
import { AddressService } from '../services/address.service';
import { HttpCodes } from '../constant/http-codes';
import { OrderItem } from '../models/order-item';
import logger from '../utils/logger';
import { Product } from '../models/product';
import { OrderItemService } from "../services/order-item.service";
import { Status } from "../constant/status";

@controller(OrderRoute.Name)
export class OrderController {
  constructor(
    @inject(TYPES.ProductService) private productService: ProductService,
    @inject(TYPES.OrderService) private orderService: OrderService,
    @inject(TYPES.OrderItemService) private orderItemService: OrderItemService,
    @inject(TYPES.AddressService) private addressService: AddressService
  ) {
  }

  @httpGet(OrderRoute.GetOrder, TYPES.CheckTokenMiddleware)
  public getOrder(request: Request, response: Response): Promise<IRes<Order>> {
    return new Promise<IRes<Order>>(async (resolve, reject) => {
      const user = request.user;
      const status = request.query.status;

      let orders = null;
      if (status) orders = await this.orderService.findOrders(user.id, status);
      else orders = await this.orderService.findOrders(user.id, null);

      if (!orders) {
        const result = {
          status: HttpStatus.NOT_FOUND,
          messages: [ResponseMessages.Order.ORDER_NOT_FOUND],
          data: null
        };
        logger.debug(result);
        resolve(result);
      }

      const result: IRes<Order> = {
        status: HttpCodes.SUCCESS,
        messages: [ResponseMessages.SUCCESS],
        data: orders
      };
      logger.debug(result);
      resolve(result);
    });
  }

  @httpGet(OrderRoute.GetOrderItem, TYPES.CheckTokenMiddleware)
  public getOrderItem(request: Request, response: Response): Promise<IRes<any>> {
    return new Promise<IRes<any>>(async (resolve, reject) => {
      try {
        const orderId = request.params.orderId;

        let orderItems: OrderItem[] = null;
        if (orderId) orderItems = await this.orderService.findItemInOrder(orderId);

        if (!orderItems) {
          const result = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.Order.ORDER_NOT_FOUND],
            data: null
          };
          resolve(result);
        }

        const productIds = orderItems.map(($) => $.product);
        const products = await this.productService.findListProductByIds(productIds) as Product[];

        const orderItemsResult = orderItems.map((orderItem) => {
          const product = _.find(products, { id: _.get(orderItem.product, '_id').toString() }) as Product;
          if (!product) return orderItem;

          orderItem.title = product.title;
          orderItem.images = product.images;
          orderItem.originalPrice = product.originalPrice;
          orderItem.saleOff = product.saleOff;
          orderItem.price = product.saleOff.active ? product.saleOff.price : product.originalPrice;
          return orderItem;
        });

        const result: IRes<any> = {
          status: HttpCodes.SUCCESS,
          messages: [ResponseMessages.SUCCESS],
          data: orderItemsResult
        };
        resolve(result);
      } catch (error) {
        logger.debug(error);

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
        if (!order) {
          const addressList = await this.addressService.getDelieveryAddress(user);
          order = await this.orderService.createOrder(user, addressList[0]);
        }

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
        logger.debug(error);
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
        const orderId = _.get(order, '_id').toString();

        let orderItems: OrderItem[] = null;
        if (orderId) orderItems = await this.orderService.findItemInOrder(orderId);

        if (!orderItems) {
          const result = {
            status: HttpStatus.NOT_FOUND,
            messages: [ResponseMessages.Order.ORDER_NOT_FOUND],
            data: null
          };
          resolve(result);
        }

        const productIds = orderItems.map(($) => $.product);
        const products = await this.productService.findListProductByIds(productIds) as Product[];

        await Promise.all(
          orderItems.map(async (orderItem) => {
            const product = _.find(products, { id: _.get(orderItem.product, '_id').toString() }) as Product;
            if (!product) return orderItem;
            const finalPrice = product.saleOff.active ? product.saleOff.price : product.originalPrice;
            await this.orderService.updateItem(orderItem, orderItem.quantity, finalPrice);
            return orderItem;
          })
        );
        //update order items status: new => pending
        await this.orderItemService.updateItemsStatus(orderItems, Status.ORDER_ITEM_PROCESSING);
        await this.orderService.submitOrder(order);

        const result: IRes<Order> = {
          status: HttpCodes.SUCCESS,
          messages: [ResponseMessages.SUCCESS],
          data: order
        };
        resolve(result);
      } catch (error) {
        logger.debug(error);
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
        logger.debug(error);

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
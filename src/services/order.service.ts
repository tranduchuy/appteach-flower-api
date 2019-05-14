import { injectable } from 'inversify';

import OrderModel, { Order } from '../models/order';
import OrderItemModel, { OrderItem } from '../models/order-item';
import ProductModel, { Product } from '../models/product';
import ShopModel from '../models/shop';
import { User } from '../models/user';
import { Address } from '../models/address';
import { Status } from '../constant/status';

@injectable()
export class OrderService {
  productInfoFields = ['id', 'status', 'title', 'images', 'originalPrice', 'shop', 'saleOff', 'slug'];
  shopInfoFields = ['id', 'name', 'slug'];

  createOrder = async (user: User, address: Address): Promise<Order> => {
    const newOrder = new OrderModel({fromUser: user, address});
    return await newOrder.save();
  };

  submitOrder = async (order): Promise<Order> => {
    order.status = Status.ORDER_NOT_YET_PAID;
    return await order.save();
  };

  findOrder = async (userId: string): Promise<Order[]> => OrderModel.find({fromUser: userId});

  findOrders = async (userId: string, status: number): Promise<Array<Order>> => {
    try {
      const query = {
        fromUser: userId, status: status || null
      };

      Object.keys(query).map(key => {
        if (query[key] === null) {
          delete query[key];
        }
      });

      return await OrderModel.find(query);
    } catch (e) {
      console.log(e);
    }
  };


  findPendingOrder = async (userId: string): Promise<Order> => OrderModel.findOne({
    fromUser: userId,
    status: Status.ORDER_PENDING
  });


  findItemInOrder = async (orderId: string): Promise<Array<any>> => {
    try {
      const orderItems = await OrderItemModel.find({order: orderId});
      return await Promise.all(orderItems.map(async item => {
        // get product info.
        const productInfo = await ProductModel.findOne({_id: item.product}, this.productInfoFields);
        item.product = productInfo;
        // get shop info.
        const shopInfo = await ShopModel.findOne({_id: productInfo.shop}, this.shopInfoFields);
        item.shop = shopInfo;
        return item;
      }));
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  findOrderItem = async (order: Order, product: Product): Promise<OrderItem> => OrderItemModel.findOne({
    order: order,
    product: product
  });


  addItem = async (order: Order, product: Product, quantity: number): Promise<OrderItem> => {
    const newOrderItem = new OrderItemModel({
      order,
      shop: product.shop,
      product,
      quantity,
    });

    return newOrderItem.save();
  };

  updateItem = async (orderItem, quantity: number, price?: number): Promise<OrderItem> => {
    if (quantity == 0) this.deleteItem(orderItem.id);
    if (price) orderItem.price = price;
    orderItem.quantity = quantity;
    return orderItem.save();
  };

  deleteItem = async (id: string) => OrderItemModel.findByIdAndRemove(id);

  checkAndUpdateSuccessStatus = async (orderId: string) => {
    const orderItems = await OrderItemModel.find({order: orderId});
    const finishedItems = orderItems.filter(item => {
      return item.status === Status.ORDER_ITEM_FINISHED;
    });

    if (orderItems.length === finishedItems.length) {
      return await OrderModel.findByIdAndUpdate(orderId, {status: Status.ORDER_SUCCESS});
    } else {
      return null;
    }
  }
}

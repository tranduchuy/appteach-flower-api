import { injectable } from 'inversify';

import OrderModel, { Order } from '../models/order';
import OrderItemModel, { OrderItem } from '../models/order-item';
import { Product } from '../models/product';
import { User } from '../models/user';
import { Address } from '../models/address';
import { Status } from '../constant/status';

@injectable()
export class OrderService {

  createOrder = async (user: User, address: Address): Promise<Order> => {
    const newOrder = new OrderModel({ fromUser: user, address });
    return newOrder.save();
  };

  submitOrder = async (order): Promise<Order> => {
    order.status = Status.ORDER_SUCCESS;
    return order.save();
  };

  findOrder = async (userId: string): Promise<Order[]> => OrderModel.find({ fromUser: userId });

  findPendingOrder = async (userId: string): Promise<Order> => OrderModel.findOne({ fromUser: userId, status: Status.ORDER_PENDING });

  findItemInOrder = async (orderId: string): Promise<OrderItem[]> => await OrderItemModel.find({ order: orderId });

  findOrderItem = async (order: Order, product: Product): Promise<OrderItem> => OrderItemModel.findOne({ order: order, product: product });

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

  deleteItem = async (id) => OrderItemModel.findByIdAndRemove(id);
}

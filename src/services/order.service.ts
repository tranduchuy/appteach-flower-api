import { injectable } from 'inversify';

import OrderModel, { Order } from '../models/order';
import OrderItemModel, { OrderItem } from '../models/order-item';
import { Product } from '../models/product';
import { User } from '../models/user';
import { Status } from '../constant/status';

@injectable()
export class OrderService {

  createOrder = async (user: User): Promise<Order> => {
    const newOrder = new OrderModel({ user });
    return newOrder.save();
  };

  submitOrder = async (order): Promise<Order> => {
    order.status = Status.ORDER_SUCCESS;
    return order.save();
  };

  findOrder = async (userId: string): Promise<Order[]> => OrderModel.find({ user: userId });

  findPendingOrder = async (userId: string): Promise<Order> => OrderModel.findOne({ user: userId, status: Status.ORDER_PENDING });

  findItemInOrder = async (orderId: string): Promise<OrderItem[]> => OrderItemModel.find({ order: orderId });

  findOrderItem = async (order: Order, product: Product): Promise<OrderItem> => OrderItemModel.findOne({ order: order, product: product });

  addItem = async (order: Order, product: Product, quantity: number): Promise<OrderItem> => {
    const newOrderItem = new OrderItemModel({
      order,
      product,
      quantity,
    });
    return newOrderItem.save();
  };

  updateItem = async (orderItem, quantity: number): Promise<OrderItem> => {
    if (quantity == 0) this.deleteItem(orderItem.id);
    orderItem.quantity = quantity;
    return orderItem.save();
  };

  deleteItem = async (id) => OrderItemModel.findByIdAndRemove(id);
}

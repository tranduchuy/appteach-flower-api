import { inject, injectable } from 'inversify';

import OrderModel, { Order } from '../models/order';
import OrderItemModel, { OrderItem } from '../models/order-item';
import ProductModel, { Product } from '../models/product';
import ShopModel from '../models/shop';
import { User } from '../models/user';
import { Address } from '../models/address';
import { Status } from '../constant/status';
import { OrderItemService } from './order-item.service';
import { AddressService } from './address.service';
import TYPES from '../constant/types';
import { CostService } from './cost.service';

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

  submitOrderDev = async (order): Promise<Order> => {
    order.status = Status.ORDER_PAID;
    order.paidAt = Date.now();
    return await order.save();
  };

  findOrder = async (userId: string): Promise<Order[]> => OrderModel.find({fromUser: userId});

  findOrders = async (userId: string, status: number): Promise<Array<Order>> => {
    try {
      const query = {
        fromUser: userId,
        status: status || {$ne: Status.ORDER_PENDING} // ko lấy order đang trong trang thái giỏ hảng
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

  updateSubmitOrder = async (order, {deliveryTime, note, address}) => {
    if (deliveryTime) {
      order.deliveryTime = deliveryTime;
    }
    if (note) {
      order.note = note;
    }
    if (address) {
      order.address = address;
    }

    return await  order.save();
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
  findOrderById = async (orderId: string) => {
    return await OrderModel.findById(orderId);
  };
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
  };
  updateCost = async (orderId: string, addressId) => {
    // get orderItem by order
    const orderItems = await this.orderItemService.findOrderItemByOrderId(orderId);

    //  calculate shipping cost for each orderItem
    await Promise.all(orderItems.map(async item => {
      const shopAddress = await this.addressService.findDeliveryAddressByShopId(item.shop);
      const shipping = await this.costService.calculateShippingCost(shopAddress._id, addressId);
      const discount = await this.costService.calculateDiscount(item.shop, item.price);
      item.shippingCost = shipping.shippingCost;
      item.shippingDistance = shipping.shippingDistance;
      item.discount = discount;
      return await item.save();
    }));
  };

  constructor(@inject(TYPES.CostService) private costService: CostService,
              @inject(TYPES.OrderItemService) private orderItemService: OrderItemService,
              @inject(TYPES.AddressService) private addressService: AddressService) {

  }
}

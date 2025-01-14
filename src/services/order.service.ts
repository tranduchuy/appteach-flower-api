import { inject, injectable } from 'inversify';
import mongoose from 'mongoose';
import { IResAddManyProducts } from '../controllers/OrderController';
import OrderModel, { Order } from '../models/order';
import OrderItemModel, { OrderItem } from '../models/order-item';
import ProductModel, { Product } from '../models/product';
import ShopModel, { Shop } from '../models/shop';
import { User } from '../models/user';
import { Status } from '../constant/status';
import { OrderItemService } from './order-item.service';
import { AddressService } from './address.service';
import TYPES from '../constant/types';
import { CostService } from './cost.service';
import { ProductService } from './product.service';

export interface IInputOrderItem {
  productId: string;
  quantity: number;
}

export interface IQueryOrderAdmin {
  code: string;
  limit: number;
  page: number;
  status: number;
  sb?: string;
  sd?: string;
}

@injectable()
export class OrderService {
  productInfoFields = ['id', 'status', 'title', 'images', 'originalPrice', 'shop', 'saleOff', 'slug'];
  shopInfoFields = ['id', 'name', 'slug'];

  constructor(@inject(TYPES.CostService) private costService: CostService,
              @inject(TYPES.OrderItemService) private orderItemService: OrderItemService,
              @inject(TYPES.ProductService) private productService: ProductService,
              @inject(TYPES.AddressService) private addressService: AddressService) {

  }

  createOrder = async (user: User): Promise<Order> => {
    const newOrder = new OrderModel({fromUser: user});
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

  findOrderByCode = async (code: string): Promise<Order> => OrderModel.findOne({code});

  findOrders = async (userId: string, status: number): Promise<Array<any>> => {
    try {
      const query = {
        fromUser: new mongoose.Types.ObjectId(userId),
        status: status || {$ne: Status.ORDER_PENDING} // ko lấy order đang trong trang thái giỏ hảng
      };

      Object.keys(query).map(key => {
        if (query[key] === null) {
          delete query[key];
        }
      });

      const orders: any = await OrderModel.find(query).lean();
      await Promise.all(orders.map(async (order: any) => {
        const orderItems = await this.findItemInOrder(order._id.toString());
        (order as any).orderItems = orderItems;
        return order;
      }));

      return orders;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  updateSubmitOrder = async (order, {deliveryTime, note, address, expectedDeliveryTime, contentOrder}) => {
    if (deliveryTime) {
      order.deliveryTime = deliveryTime;
    }

    if (note) {
      order.note = note;
    }

    if (address) {
      order.address = address;
    }

    if (expectedDeliveryTime) {
      order.expectedDeliveryTime = expectedDeliveryTime;
    }

    order.contentOrder = contentOrder || '';
    order.code = await this.generateOrderCode();

    return await order.save();
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

  updateQuantityItem = async (orderItem, quantity) => {
    try {
      if (quantity === 0) {
        return await this.deleteItem(orderItem._id);
      } else {
        orderItem.quantity = quantity;
        return await orderItem.save();
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  updateItem = async (orderItem, quantity: number, price?: number): Promise<OrderItem> => {
    try {
      if (quantity == 0) this.deleteItem(orderItem._id);
      if (price) orderItem.price = price;
      orderItem.quantity = quantity;
      orderItem.total = orderItem.quantity * orderItem.price;
      // update product sold quantity
      const product = orderItem.product;
      if (!product.sold) {
        product.sold = 0;
      }
      product.sold += orderItem.quantity;
      await product.save();
      return await orderItem.save();
    } catch (e) {
      console.log(e);
      return null;
    }

  };

  deleteItem = async (id: string) => await OrderItemModel.findByIdAndRemove(id);

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

  updateCost = async (orderId: string, addressId): Promise<number> => {
    const totalShippingCost = {
      total: 0,
      shopIds: []
    };
    // get orderItem by order
    const orderItems = await this.orderItemService.findOrderItemByOrderId(orderId);

    //  calculate shipping cost for each orderItem
    // TODO: re-calculate shipping cost. same shop only calculate one time
    await Promise.all(orderItems.map(async item => {
      const shopAddress = await this.addressService.findDeliveryAddressByShopId(item.shop);
      const shipping = await this.costService.calculateShippingCost(shopAddress._id, addressId);
      const discount = await this.costService.calculateDiscount(item.shop, item.price);
      if (totalShippingCost.shopIds.indexOf(item.shop.toString()) === -1) {
        totalShippingCost.total += shipping.shippingCost;
        totalShippingCost.shopIds.push(item.shop.toString());
      }
      console.log(totalShippingCost);
      item.shippingCost = shipping.shippingCost;
      item.shippingDistance = shipping.shippingDistance;
      item.discount = discount;
      return await item.save();
    }));
    return totalShippingCost.total;
  };

  calculateTotal = async (orderId) => {
    const items = await OrderItemModel.find({order: orderId});
    let total = 0;
    items.forEach(item => {
      total += item.total;
    });
    return total;
  };

  updateStatus = async (id: string, status: number): Promise<Order> => {
    const order = await OrderModel.findOne({_id: id});
    order.status = status;

    const orderItems = await OrderItemModel.find({order: order._id});
    if (status === Status.ORDER_CANCEL) {
      await Promise.all(orderItems.map(async item => {
        item.status = Status.ORDER_ITEM_CANCEL;
        return await item.save();
      }));
    } else {
      await Promise.all(orderItems.map(async item => {
        item.status = Status.ORDER_ITEM_PROCESSING;
        return await item.save();
      }));
    }
    return await order.save();
  };

  addManyProductsToCart = async (order: Order, items: IInputOrderItem[]): Promise<IResAddManyProducts[]> => {
    const results: IResAddManyProducts[] = [];
    if (items.length === 0) {
      return Promise.resolve([]);
    }

    await Promise.all(items.map(async (item: IInputOrderItem) => {
      const orderItem = await this.addProductToCart(order, item.productId, item.quantity);
      if (orderItem) {
        results.push(orderItem);
      }
    }));

    return Promise.resolve(results);
  };

  generateOrderCode = async () => {
    // TODO: generate order code
    const date = new Date();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const yyyy = date.getFullYear();
    const yyyymmdd = [yyyy,
      (mm > 9 ? '' : '0') + mm,
      (dd > 9 ? '' : '0') + dd
    ].join('');
    const yymmdd = yyyymmdd.slice(2);


    const todayString = new Date([yyyy,
      (mm > 9 ? '' : '0') + mm,
      (dd > 9 ? '' : '0') + dd
    ].join('-'));
    const yesterday = (new Date(todayString)).setDate((new Date(todayString)).getDate() - 1);
    const tomorrow = (new Date(todayString)).setDate((new Date(todayString)).getDate() + 1);
    const orderCount = await OrderModel.count({
      submitAt: {
        '$gt': yesterday,
        '$lt': tomorrow
      }
    });

    let count = orderCount + 1;
    let countString = count.toString();
    let splitChar = 'A';
    if (count > 9999) {
      const index = count / 10000;
      count = (count + 1) % 10000;
      splitChar = String.fromCharCode(65 + index);
    }

    if (count > 999) {
      countString = count.toString();
    } else if (count > 99) {
      countString = '0' + count;
    } else if (count > 9) {
      countString = '00' + count;
    } else {
      countString = '000' + count;
    }

    return (yymmdd + splitChar + countString).toString();
  };

  buildStageGetListOrderAdmin(queryCondition: IQueryOrderAdmin): any[] {
    const stages = [];
    const matchStage: any = {};
    if (queryCondition.code) {
      matchStage['code'] = queryCondition.code;
    }

    if (queryCondition.status) {
      matchStage['status'] = queryCondition.status;
    } else {
      matchStage['status'] = {
        $ne: Status.ORDER_PENDING
      };
    }

    if (Object.keys(matchStage).length > 0) {
      stages.push({$match: matchStage});
    }

    if (queryCondition.sb) {
      stages.push({
        $sort: {
          [queryCondition.sb]: queryCondition.sd === 'ASC' ? 1 : -1
        }
      });
    } else {
      stages.push({
        $sort: {
          submitAt: -1
        }
      });
    }

    /*stages.push({
      $lookup: {
        from: 'users',
        localField: 'fromUser',
        foreignField: '_id',
        as: 'userInfo'
      }
    });

    stages.push({$unwind: {path: '$userInfo'}});*/

    stages.push({
      $lookup: {
        from: 'addresses',
        localField: 'address',
        foreignField: '_id',
        as: 'addressInfo'
      }
    });

    stages.push({$unwind: {path: '$addressInfo'}});

    stages.push({
      $facet: {
        entries: [
          {$skip: (queryCondition.page - 1) * queryCondition.limit},
          {$limit: queryCondition.limit}
        ],
        meta: [
          {$group: {_id: null, totalItems: {$sum: 1}}},
        ],
      }
    });

    return stages;
  }

  public async addProductToCart(order: Order, productId: string, quantity: number): Promise<IResAddManyProducts | null> {
    const result: IResAddManyProducts = {
      product: null,
      shop: null,
      quantity
    };

    const product = await this.productService.findProductById(productId);
    if (!product) {
      console.warn('OrderService::addProductToCart. Product not found: ', productId);
      return Promise.resolve(null);
    }

    const orderItem = await this.findOrderItem(order, product);
    if (!orderItem && quantity > 0) {
      await this.addItem(order, product, quantity);
    } else {
      await this.updateQuantityItem(orderItem, quantity);
    }

    result.product = product;
    result.shop = product.shop as Shop;

    return Promise.resolve(result);
  }
}

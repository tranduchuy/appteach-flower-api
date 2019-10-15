import { inject, injectable } from 'inversify';
import { IResAddManyProducts } from '../controllers/OrderController';
import OrderModel, { Order } from '../models/order.model';
import OrderItemModel, { OrderItem } from '../models/order-item.model';
import ProductModel, { Product } from '../models/product.model';
import ShopModel, { Shop } from '../models/shop.model';
import { User } from '../models/user.model';
import { Status } from '../constant/status';
import { OrderItemService } from './order-item.service';
import { AddressService } from './address.service';
import TYPES from '../constant/types';
import { CostService } from './cost.service';
import { ProductService } from './product.service';
import ImageProduct from '../models/image-product.model';
import ShopHasProduct from '../models/shop-has-product.model';
import SaleOffProduct from '../models/sale-off-product.model';

export interface IInputOrderItem {
  productId: number;
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
  productInfoFields = ['id', 'status', 'title', 'originalPrice', 'slug'];
  shopInfoFields = ['id', 'name', 'slug'];

  constructor(@inject(TYPES.CostService) private costService: CostService,
    @inject(TYPES.OrderItemService) private orderItemService: OrderItemService,
    @inject(TYPES.ProductService) private productService: ProductService,
    @inject(TYPES.AddressService) private addressService: AddressService) {

  }

  createOrder = async (user: User): Promise<Order> => {
    // must find user's address??

    const newOrder = new OrderModel({ usersId: user.id });
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

  findOrder = async (userId: string): Promise<Order[]> => OrderModel.findAll({ where: { usersId: userId } });

  findOrderByCode = async (code: string): Promise<Order> => OrderModel.findOne({ where: { code } });

  findOrders = async (userId: number, status: number): Promise<Array<any>> => {
    try {
      const query = {
        usersId: userId,
        status: status || { $ne: Status.ORDER_PENDING } // ko lấy order đang trong trang thái giỏ hảng
      };

      Object.keys(query).map(key => {
        if (query[key] === null) {
          delete query[key];
        }
      });

      const orders: any = await OrderModel.findAll({ where: query });
      await Promise.all(orders.map(async (order: any) => {
        const orderItems = await this.findItemInOrder(order.id);
        (order as any).orderItems = orderItems;
        return order;
      }));

      return orders;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  updateSubmitOrder = async (order, { deliveryTime, note, address, expectedDeliveryTime, contentOrder }) => {
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

  findPendingOrder = async (userId: number): Promise<Order> => {
    return await OrderModel.findOne({
      where: {
        usersId: userId,
        status: Status.ORDER_PENDING
      }
    });
  }

  findItemInOrder = async (orderId: number): Promise<Array<any>> => {
    try {
      const orderItems = await OrderItemModel.findAll({ where: { ordersId: orderId } });
      return await Promise.all(orderItems.map(async (item: any) => {
        const productInfo: any = await ProductModel.findOne({
          attributes: ['id', 'status', 'title', 'originalPrice', 'slug'],
          where: { id: item.productsId },
          include: [
            { model: ImageProduct, as: 'imageProductInfo', duplicating: false },
            { model: ShopHasProduct, as: 'shopHasProductInfo', duplicating: false },
            { model: SaleOffProduct, as: 'saleOffProductInfo', duplicating: false }
          ]
        });

        // get product info.
        item.product = productInfo;
        // get shop info.
        const shopInfo = await ShopModel.findOne({
          attributes: this.shopInfoFields,
          where: {
            id: productInfo.shopHasProductInfo.shopsId
          }
        });
        item.shop = shopInfo;

        return item;
      }));
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  findOrderItem = async (order: Order, product: Product): Promise<OrderItem> => {
    return await OrderItemModel.findOne({
      where: {
        ordersId: order.id,
        productsId: product.id
      }
    });
  }

  addItem = async (order: Order, product: Product, quantity: number): Promise<OrderItem> => {
    const newOrderItem = new OrderItemModel({
      ordersId: order.id,
      productsId: product.id,
      quantity,
    });

    return newOrderItem.save();
  };

  updateQuantityItem = async (orderItem: OrderItem, quantity: number) => {
    try {
      if (quantity === 0) {
        return await this.deleteItem(orderItem.id);
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

  deleteItem = async (id: number) => await OrderItemModel.destroy({ where: { id } });

  findOrderById = async (orderId: number) => {
    return await OrderModel.findOne({ where: { id: orderId } });
  };

  checkAndUpdateSuccessStatus = async (orderId: string) => {
    const orderItems = await OrderItemModel.find({ order: orderId });
    const finishedItems = orderItems.filter(item => {
      return item.status === Status.ORDER_ITEM_FINISHED;
    });

    if (orderItems.length === finishedItems.length) {
      return await OrderModel.findByIdAndUpdate(orderId, { status: Status.ORDER_SUCCESS });
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
    const items = await OrderItemModel.find({ order: orderId });
    let total = 0;
    items.forEach(item => {
      total += item.total;
    });
    return total;
  };

  updateStatus = async (id: string, status: number): Promise<Order> => {
    const order = await OrderModel.findOne({ _id: id });
    order.status = status;

    const orderItems = await OrderItemModel.find({ order: order._id });
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
      stages.push({ $match: matchStage });
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

    stages.push({ $unwind: { path: '$addressInfo' } });

    stages.push({
      $facet: {
        entries: [
          { $skip: (queryCondition.page - 1) * queryCondition.limit },
          { $limit: queryCondition.limit }
        ],
        meta: [
          { $group: { _id: null, totalItems: { $sum: 1 } } },
        ],
      }
    });

    return stages;
  }

  public async addProductToCart(order: Order, productId: number, quantity: number): Promise<IResAddManyProducts | null> {
    const result: IResAddManyProducts = {
      product: null,
      shop: null,
      quantity
    };

    const product: any = await this.productService.findProductById(productId);
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

    const shopOfProduct = await ShopModel.findOne({ where: { id: product.shopHasProduct.shopsId } });

    result.shop = shopOfProduct as Shop;

    return Promise.resolve(result);
  }
}

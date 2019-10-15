import { injectable } from 'inversify';
import OrderItemModel, { OrderItem } from '../models/order-item.model';
import ProductModel, { Product } from '../models/product.model';
import ShopModel from '../models/shop';
import { Status } from '../constant/status';
import { Op } from 'sequelize';
import ShopHasProduct from '../models/shop-has-product.model';

@injectable()
export class OrderItemService {
  productInfoFields = ['id', 'status', 'title', 'images', 'originalPrice', 'shop', 'saleOff', 'slug'];
  shopInfoFields = ['id', 'name', 'slug'];

  updateStatus = async (id: number, status: number): Promise<OrderItem> => {
    const orderItem = await OrderItemModel.findOne({ where: { id } });
    orderItem.status = status;
    return await orderItem.save();
  };

  updateItemsStatus = async (items: any, status: number) => {
    return await Promise.all(items.map(async item => {
      return await this.updateStatus(item._id, status);
    }));
  };

  updateOrderItem = async (orderItem, { quantity }) => {
    if (quantity) {
      orderItem.quantity = quantity;
    }
    return await orderItem.save();
  };

  findNewOrderItemById = async (id: number): Promise<OrderItem> => {
    return await OrderItemModel.findOne({ where: { id, status: Status.ORDER_ITEM_NEW } });
  };

  findOrderItemById = async (id: number): Promise<any> => {
    const orderItem: any = await OrderItemModel.findOne({ where: { id } });
    const productInfo: any = await ProductModel.findOne({
      where: { id: orderItem.productsId },
      include: [
        {
          model: ShopHasProduct,
          as: 'shopHasProductInfo',
          duplicating: false
        }
      ]
    });
    orderItem.shopsId = productInfo.shopHasProductInfo[0].shopsId;
    return orderItem;
  };

  findOrderItemByOrderId = async (orderId: number): Promise<any> => {
    return await OrderItemModel.findAll(
      {
        where: { ordersId: orderId },
        include: [
          {
            model: Product,
            as: 'productInfo',
            duplicating: false
          }
        ]
      },
    );
  };

  findPendingOrderItems = async (orderId: string): Promise<Array<any>> => {
    try {
      const orderItems = await OrderItemModel.findAll({ where: { ordersId: orderId, status: Status.ORDER_ITEM_NEW } });
      return await Promise.all(orderItems.map(async item => {
        // get product info.
        const productInfo = await ProductModel.findOne({ id: item.productsId }, this.productInfoFields);
        item.product = productInfo;
        // get shop info.
        const shopInfo = await ShopModel.findOne({ _id: productInfo.shop }, this.shopInfoFields);
        item.shop = shopInfo;
        return item;
      }));
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  buildStageGetListOrderItemAdmin(queryCondition): any[] {
    let stages = [];
    const matchStage: any = {};

    stages.push({
      $lookup: {
        from: 'orders',
        localField: 'order',
        foreignField: '_id',
        as: 'order'
      }
    });

    stages.push({ $unwind: { path: '$order' } });

    if (queryCondition.code) {
      matchStage['order.code'] = queryCondition.code;
    }

    if (queryCondition.status) {
      matchStage['order.status'] = queryCondition.status;
    } else {
      matchStage['order.status'] = {
        $ne: Status.ORDER_PENDING
      };
    }


    if (queryCondition.startDate) {
      matchStage.createdAt = {
        $gte: new Date(queryCondition.startDate)
      };
    }

    if (queryCondition.endDate) {
      matchStage.createdAt = matchStage.createdAt || {};
      matchStage.createdAt['$lt'] = new Date(queryCondition.endDate);
    }

    if (Object.keys(matchStage).length > 0) {
      stages.push({ $match: matchStage });
    }

    stages.push({
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'product'
      }
    });

    stages.push({ $unwind: { path: '$product' } });

    stages.push({
      '$project': {
        '_id': 1,
        'order': 1,
        'product._id': 1,
        'product.slug': 1,
        'product.images': 1,
        'product.saleOff': 1,
        'product.originalPrice': 1,
        'product.title': 1,
        'product.shop': 1,
        'total': 1,
        'status': 1,
        'shippingCost': 1,
        'shippingDistance': 1,
        'quantity': 1,
        'price': 1,
        'createdAt': 1
      }
    });

    stages.push({
      $lookup: {
        from: 'shops',
        localField: 'product.shop',
        foreignField: '_id',
        as: 'product.shop'
      }
    });

    stages.push({ $unwind: { path: '$product.shop' } });

    stages.push({
      '$group': {
        _id: '$order._id',
        count: { $sum: 1 },
        order: { $push: '$order' },
        orderItems: {
          $push: {
            quantity: '$quantity',
            price: '$price',
            _id: '$_id',
            product: '$product',
            shippingCost: '$shippingCost',
            status: '$status',
            createdAt: '$createdAt'
          }
        }
      }
    });

    stages = stages.concat([
      { '$unwind': { 'path': '$order' } },
      { '$lookup': { 'from': 'users', 'localField': 'order.fromUser', 'foreignField': '_id', 'as': 'user' } },
      {
        '$unwind': {
          'path': '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      { '$lookup': { 'from': 'addresses', 'localField': 'order.address', 'foreignField': '_id', 'as': 'address' } },
      { '$unwind': { 'path': '$address' } },
      {
        '$project': {
          '_id': 1,
          'count': 1,
          'orderItems': 1,
          'order.paidAt': 1,
          'order.code': 1,
          'order.status': 1,
          'order.totalShippingCost': 1,
          'order.total': 1,
          'order.deliveryTime': 1,
          'order.buyerInfo': 1,
          'order.submitAt': 1,
          'order.note': 1,
          'user.email': 1,
          'user.phone': 1,
          'user.name': 1,
          'address': 1,
          'totalCost': { '$add': ['$order.totalShippingCost', '$order.total'] }
        }
      }
    ]);

    if (queryCondition.sb) {
      stages.push({
        $sort: {
          [queryCondition.sb]: queryCondition.sd === 'ASC' ? 1 : -1
        }
      });
    } else {
      stages.push({
        $sort: {
          'order.submitAt': -1
        }
      });
    }
    stages.push(
      {
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

  buildQueryConditionOfGetListOrderItem(queryCondition) {
    const cond: any = {};

    if (queryCondition.startDate) {
      cond.createdAt = {
        [Op.gte]: new Date(queryCondition.startDate)
      };
    }

    if (queryCondition.endDate) {
      cond.createdAt = cond.createdAt || {};
      cond.createdAt = {
        [Op.lt]: new Date(queryCondition.endDate)
      };
    }

    if (queryCondition.shopsId) {
      cond.shopsId = queryCondition.shopsId;
    }

    if (queryCondition.status) {
      cond.status = queryCondition.status;
    } else {
      cond.status = {
        [Op.ne]: Status.ORDER_ITEM_NEW
      };
    }

    return cond;
  }

  buildStageGetListOrderItem(queryCondition): any[] {
    let stages = [];
    const matchStage: any = {};

    if (queryCondition.startDate) {
      matchStage.createdAt = {
        $gte: new Date(queryCondition.startDate)
      };
    }

    if (queryCondition.endDate) {
      matchStage.createdAt = matchStage.createdAt || {};
      matchStage.createdAt['$lt'] = new Date(queryCondition.endDate);
    }

    if (queryCondition.shop) {
      matchStage['shop'] = queryCondition.shop;
    }

    if (queryCondition.status) {
      matchStage['status'] = queryCondition.status;
    } else {
      matchStage['status'] = {
        $ne: Status.ORDER_ITEM_NEW
      };
    }

    if (Object.keys(matchStage).length > 0) {
      stages.push({ $match: matchStage });
    }

    stages.push({
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'product'
      }
    });

    stages.push({ $unwind: { path: '$product' } });

    stages.push({
      '$project': {
        '_id': 1,
        'order': 1,
        'product._id': 1,
        'product.slug': 1,
        'product.images': 1,
        'product.saleOff': 1,
        'product.originalPrice': 1,
        'product.title': 1,
        'total': 1,
        'status': 1,
        'shippingCost': 1,
        'shippingDistance': 1,
        'quantity': 1,
        'price': 1,
        'createdAt': 1
      }
    });

    stages.push({
      '$group': {
        _id: '$order',
        count: { $sum: 1 },
        total: {
          $sum: '$total'
        },
        orderItems: {
          $push: {
            quantity: '$quantity',
            price: '$price',
            _id: '$_id',
            product: '$product',
            shippingCost: '$shippingCost',
            status: '$status',
            createdAt: '$createdAt'
          }
        }
      }
    });

    stages = stages.concat([
      { '$lookup': { 'from': 'orders', 'localField': '_id', 'foreignField': '_id', 'as': 'order' } },
      { '$unwind': { 'path': '$order' } },
      { '$lookup': { 'from': 'users', 'localField': 'order.fromUser', 'foreignField': '_id', 'as': 'user' } },
      {
        '$unwind': {
          'path': '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      { '$lookup': { 'from': 'addresses', 'localField': 'order.address', 'foreignField': '_id', 'as': 'address' } },
      { '$unwind': { 'path': '$address' } },
      {
        '$project': {
          '_id': 1,
          'count': 1,
          'orderItems': 1,
          'order.paidAt': 1,
          'order.code': 1,
          'order.status': 1,
          'order.deliveryTime': 1,
          'order.buyerInfo': 1,
          'order.submitAt': 1,
          'user.email': 1,
          'user.phone': 1,
          'user.name': 1,
          'address': 1,
          'total': 1
        }
      },
      {
        $facet: {
          entries: [
            { $skip: (queryCondition.page - 1) * queryCondition.limit },
            { $limit: queryCondition.limit }
          ],
          meta: [
            { $group: { _id: null, totalItems: { $sum: 1 } } },
          ],
        }
      }
    ]);

    // if (queryCondition.sb) {
    //   stages.push({
    //     $sort: {
    //       [queryCondition.sb]: queryCondition.sd === 'ASC' ? 1 : -1
    //     }
    //   });
    // } else {
    //   stages.push({
    //     $sort: {
    //       createdAt: -1
    //     }
    //   });
    // }

    return stages;
  }

}

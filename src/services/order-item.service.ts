import { injectable } from 'inversify';
import OrderItemModel, { OrderItem } from '../models/order-item';
import ProductModel from '../models/product';
import ShopModel from '../models/shop';
import { Status } from '../constant/status';

@injectable()
export class OrderItemService {
  productInfoFields = ['id', 'status', 'title', 'images', 'originalPrice', 'shop', 'saleOff', 'slug'];
  shopInfoFields = ['id', 'name', 'slug'];

  updateStatus = async (id: string, status: number): Promise<OrderItem> => {
    return await OrderItemModel.findOneAndUpdate({_id: id}, {status: status});
  };

  updateItemsStatus = async (items: any, status: number) => {
    return await Promise.all(items.map(async item => {
      return await this.updateStatus(item._id, status);
    }));
  };

  updateOrderItem = async (orderItem, {quantity}) => {
    if (quantity) {
      orderItem.quantity = quantity;
    }
    return await  orderItem.save();
  };

  findNewOrderItemById = async (id: string) => {
    return await OrderItemModel.findOne({_id: id, status: Status.ORDER_ITEM_NEW});
  };

  findOrderItemById = async (id: string) => {
    return await OrderItemModel.findOne({_id: id});
  };

  findOrderItemByOrderId = async (orderId: string) => {
    return await OrderItemModel.find({order: orderId});
  };

  findPendingOrderItems = async (orderId: string): Promise<Array<any>> => {
    try {
      const orderItems = await OrderItemModel.find({order: orderId, status: Status.ORDER_ITEM_NEW});
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

  buildStageGetListOrderItem(queryCondition): any[] {
    const stages = [];
    const matchStage: any = {};
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
      stages.push({$match: matchStage});
    }

    stages.push({
      $lookup: {
        from: 'orders',
        localField: 'order',
        foreignField: '_id',
        as: 'orderInfo'
      }
    });

    stages.push({$unwind: {path: '$orderInfo'}});

    if (queryCondition.sb) {
      stages.push({
        $sort: {
          [queryCondition.sb]: queryCondition.sd === 'ASC' ? 1 : -1
        }
      });
    }

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
}

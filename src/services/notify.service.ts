import { injectable } from 'inversify';
import { Status } from '../constant/status';
import NotifyModel from '../models/notify';
import ShopModel from '../models/shop';
import OrderItemModel from '../models/order-item';
import OrderModel from '../models/order';
import { NotifyConstant, TypeCd2Content } from '../constant/notify-type';

import * as Socket from '../utils/Socket';

@injectable()
export class NotifyService {
  getUnReadCountOfUser = async (userId: string) => {
    const query = {
      toUser: userId,
      status: Status.NOTIFY_NEW
    };

    return await NotifyModel.count(query);
  };

  isValidStatusForUpdating = (status: number) => {
    // TODO: will update this list when new status of notify appeared
    return [
      Status.NOTIFY_NEW,
      Status.NOTIFY_READ
    ].indexOf(status) !== -1;
  };

  createNotify = async ({fromUser, toUser, title, type, content, params}) => {
    const newNotify = new NotifyModel({
      fromUser,
      toUser,
      status: Status.NOTIFY_NEW,
      title: title.trim(),
      content: content.trim(),
      type,
      params
    });

    return await newNotify.save();
  };

  notifyNewOrderToShops = async (orderId) => {
    const shopIds = await OrderItemModel.find({order: orderId}).distinct('shop');
    return await Promise.all(shopIds.map(async shopId => {
      const shop = await ShopModel.findOne({_id: shopId});
      const notifyContent: any = TypeCd2Content(NotifyConstant.NEW_ORDER);

      Socket.pushToUser(shop.user, notifyContent.title);
      return await this.createNotify({
        toUser: shop.user,
        fromUser: null,
        type: NotifyConstant.NEW_ORDER,
        title: notifyContent.title,
        content: notifyContent.content,
        params: {orderId: orderId}
      });
    }));
  };

  notifyUpdateOrderItemStatusToUser = async (orderItemId) => {
    const orderItem: any = await OrderItemModel.findOne({_id: orderItemId})
        .populate({model: OrderModel, path: 'order'});

    let notifyContent;
    if (orderItem.status === Status.ORDER_ITEM_ON_DELIVERY) {
      notifyContent = TypeCd2Content(NotifyConstant.UPDATE_ORDER_ITEM_ON_DELIVERY);
    } else if (orderItem.status === Status.ORDER_ITEM_FINISHED) {
      notifyContent = TypeCd2Content(NotifyConstant.UPDATE_ORDER_ITEM_FINISHED);
    }


    Socket.pushToUser(orderItem['order'].fromUser, notifyContent.title);

    return await this.createNotify({
      toUser: orderItem['order'].fromUser,
      fromUser: orderItem.user,
      type: NotifyConstant.UPDATE_ORDER_ITEM_STATUS,
      title: notifyContent.title,
      content: notifyContent.content,
      params: {orderItemId: orderItemId}
    });
  };

  buildStageGetListNotify(queryCondition): any[] {
    const stages = [];
    const matchStage: any = {};

    if (queryCondition.toUser) {
      matchStage['toUser'] = queryCondition.toUser;
    }

    if (queryCondition.status) {
      matchStage['status'] = queryCondition.status;
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

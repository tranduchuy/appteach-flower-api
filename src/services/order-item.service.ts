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
}

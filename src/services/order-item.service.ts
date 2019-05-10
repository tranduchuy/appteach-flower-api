import { injectable } from 'inversify';
import OrderItemModel, { OrderItem } from '../models/order-item';

@injectable()
export class OrderItemService {
  updateStatus = async (id: string, status: number): Promise<OrderItem> => {
    return await OrderItemModel.findOneAndUpdate({_id: id}, {status: status});
  };

  updateItemsStatus = async (items: any, status: number)=>{
    return await Promise.all(items.map( async item =>{
      return await this.updateStatus(item._id, status);
    }))
  }
}

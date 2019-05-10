import { injectable } from 'inversify';
import OrderItemModel, { OrderItem } from '../models/order-item';

@injectable()
export class OrderItemService {
  updateStatus = async (id, status): Promise<OrderItem> => {
    return await OrderItemModel.findOneAndUpdate({_id: id}, {status: status});
  };
}

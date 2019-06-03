import { injectable } from 'inversify';

const moment = require('moment');
import OrderModel from '../models/order';
import OrderItemModel from '../models/order-item';
import schedule from 'node-schedule';
import { General } from '../constant/generals';
import { Status } from '../constant/status';

@injectable()
export class OrderWorkerService {


  findNotYetPayOrdersScheduleNeedToBeCancel = async () => {
    const notYetPayOrders = await OrderModel.find(
        {
          status: Status.ORDER_NOT_YET_PAID
        });

    const searchDate = new Date();
    searchDate.setMinutes(searchDate.getHours() - 2);
    return notYetPayOrders.filter((order) => {
      if (!order.submitAt) {
        console.log('WORKER::ChangeProductSaleOffJob::findNotYetPayOrdersScheduleNeedToBeCancel::Not defined submitAt of order id', order._id);
        return false;
      }
      return moment(searchDate).isAfter(order.submitAt);
    });
  };

  shouldCancelOrders = async () => {
    try {
      const orders = await this.findNotYetPayOrdersScheduleNeedToBeCancel();
      if (orders.length > 0) {
        return await Promise.all(orders.map(async order => {
          order.status = Status.ORDER_CANCEL;
          const orderItems = await OrderItemModel.find({order: order._id});
          await Promise.all(orderItems.map(async item => {
            item.status = Status.ORDER_ITEM_CANCEL;
            return await item.save();
          }));
          console.log('WORKER::ChangeProductSaleOffJob::shouldCancelOrders::Change change status to ORDER_CANCEL', order._id);
          return await order.save();
        }));
      }
      return [];
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  runCancelOrderJob = () => {
    console.log('WORKER::CancelOrderJob::Init: Cancel not yet pay order after 2 hours.');
    return schedule.scheduleJob(`*/${General.checkSaleOffIntervalTime} * * * *`, async () => {
      try {
        console.log('WORKER::CancelOrderJob::Start at', new Date());
        const updatedOrders = await this.shouldCancelOrders();
        console.log(`WORKER::CancelOrderJob::Finish at ${new Date()}, update on number of orders `, updatedOrders.length);
      } catch (e) {
        console.error(e);
      }
    });
  }

}
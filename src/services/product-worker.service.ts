import { injectable } from 'inversify';

const moment = require('moment');
import ProductModel from '../models/product';
import schedule from 'node-schedule';
import { General } from '../constant/generals';

@injectable()
export class ProductWorkerService {


  findProductScheduleNeedToBeUpdateSale = async () => {
    const now = new Date();
    const activeProducts = await ProductModel.find(
        {
          'saleOff.active': true
        });
    return activeProducts.filter((product) => {
      if (!product.saleOff.endDate) {
        console.log('WORKER::ChangeProductSaleOffJob::findProductScheduleNeedToBeUpdateSale::Not defined endDate of product id', product._id);
        return false;
      }
      return moment(now).isAfter(product.saleOff.endDate);
    });
  };

  shouldUnactiveSaleOnProducts = async () => {
    try {
      const products = await this.findProductScheduleNeedToBeUpdateSale();
      if (products.length > 0) {
        return await Promise.all(products.map(async product => {
          const defaultSaleOff = product.saleOff;
          defaultSaleOff.active = false;
          await ProductModel.findByIdAndUpdate(product._id,
              {
                saleOff: defaultSaleOff
              });
          console.log('WORKER::ChangeProductSaleOffJob::shouldUnactiveSaleOnProducts::Change SaleOff.active to false of product id', product._id);
          return product;
        }));
      }
      return [];
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  runChangeProductSaleOffJob = () => {
    console.log('WORKER::ChangeProductSaleOffJob::Init: Change sale off active to unactive of expired saleOff time product');
    return schedule.scheduleJob(`*/${General.checkSaleOffIntervalTime} * * * *`, async () => {
      try {
        console.log('WORKER::ChangeProductSaleOffJob::Start at', new Date());
        const updatedProducts = await this.shouldUnactiveSaleOnProducts();
        console.log(`WORKER::ChangeProductSaleOffJob::Finish at ${new Date()}, update on number of products `, updatedProducts.length);
      } catch (e) {
        console.error(e);
      }
    });
  }

}
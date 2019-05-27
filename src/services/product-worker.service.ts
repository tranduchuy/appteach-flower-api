import { injectable } from 'inversify';

const moment = require('moment');
import ProductModel from '../models/product';
import schedule from 'node-schedule';

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
          return product;
        }));
      }
      return [];
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  runChangeProductSaleJob = () => {
    return schedule.scheduleJob(`5 * * * * *`, async () => {
      try {
        await this.shouldUnactiveSaleOnProducts();
      } catch (e) {
        console.error(e);
      }
    });
  }

}